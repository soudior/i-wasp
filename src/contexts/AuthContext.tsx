import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let disposed = false;
    let receivedAuthEvent = false;
    const applySession = (nextSession: Session | null) => {
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

  // Customer login does not call bootstrap-admin. That function returns 500
  // when ADMIN_EMAIL is unset, and a retry treated that 500 as transient, so
  // every session hit it three times. Founder promotion stays on the dev-only
  // control in AdminGuard. The deployed function is unchanged.

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
