import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { isTransientBootstrapError } from "@/lib/bootstrapAdminRetry";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ error: Error | null; requiresEmailConfirmation: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authIdentityEpoch, setAuthIdentityEpoch] = useState(0);
  const latestSessionUserId = useRef<string | null>(null);
  const activeBootstrap = useRef<{ userId: string; cancel: () => void } | null>(null);

  useEffect(() => {
    let disposed = false;
    let receivedAuthEvent = false;
    const applySession = (nextSession: Session | null) => {
      const nextUserId = nextSession?.user.id ?? null;
      // Cancel synchronously with auth changes, before React commits the next
      // render, so a racing old-account response cannot invalidate its cache.
      if (latestSessionUserId.current !== nextUserId) {
        latestSessionUserId.current = nextUserId;
        activeBootstrap.current?.cancel();
        // Preserve identity transitions even when React batches sign-out and
        // sign-in of the same user into one render. Token refreshes do not count.
        setAuthIdentityEpoch((epoch) => epoch + 1);
      }
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    };

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (disposed) return;
        receivedAuthEvent = true;
        // Handle session expiry
        if (event === 'TOKEN_REFRESHED') {
          console.log('Session refreshed');
          toast({
            title: "Session actualisée",
            description: "Votre session a été automatiquement prolongée.",
          });
        }
        if (event === 'SIGNED_OUT') {
          console.log('User signed out');
        }
        applySession(session);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      // A newer auth event is authoritative; a delayed initial read must not
      // restore an old account (or update an already unmounted provider).
      if (!disposed && !receivedAuthEvent) applySession(session);
    });

    return () => {
      disposed = true;
      subscription.unsubscribe();
    };
  }, []);

  // Server-side bootstrap: if the logged-in user is the founder (ADMIN_EMAIL), grant admin role automatically.
  useEffect(() => {
    const uid = session?.user?.id;
    if (!uid) return;

    // One bounded cycle per authenticated identity epoch. Session/token
    // refreshes keep both the user ID and epoch unchanged.
    const controller = new AbortController();
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let attempts = 0;
    const cancel = () => {
      controller.abort();
      if (retryTimer !== undefined) clearTimeout(retryTimer);
    };
    activeBootstrap.current = { userId: uid, cancel };

    const bootstrap = async () => {
      if (controller.signal.aborted) return;
      attempts += 1;
      let error: unknown;

      try {
        ({ error } = await supabase.functions.invoke("bootstrap-admin", {
          body: { action: "ensure" },
          signal: controller.signal,
        }));
      } catch (invokeError) {
        error = invokeError;
      }

      // A request may finish even after aborting; never invalidate a stale user.
      if (controller.signal.aborted) return;
      if (!error) {
        void queryClient.invalidateQueries({ queryKey: ["isAdmin", uid] });
        return;
      }

      console.warn("bootstrap-admin error", error);
      if (attempts < 3 && isTransientBootstrapError(error)) {
        retryTimer = setTimeout(() => void bootstrap(), 1_000 * 2 ** (attempts - 1));
      }
    };

    void bootstrap();
    return () => {
      cancel();
      if (activeBootstrap.current?.cancel === cancel) activeBootstrap.current = null;
    };
  }, [session?.user?.id, authIdentityEpoch, queryClient]);

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    const redirectUrl = `${window.location.origin}/dashboard`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          first_name: firstName,
          last_name: lastName,
        }
      }
    });

    return { error: error as Error | null, requiresEmailConfirmation: !error && !data.session };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
