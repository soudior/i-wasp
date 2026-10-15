import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type WalletType = 'apple' | 'google';

/** One Wallet request per card/account generation, cancellable before navigation. */
export function useWalletRequest(scopeKey: string) {
  const mounted = useRef(true);
  const scope = useRef(scopeKey);
  const request = useRef<AbortController | null>(null);
  const account = useRef<string | null | undefined>(undefined);
  const generation = useRef(0);
  const committedGeneration = useRef(0);
  const [busyType, setBusyType] = useState<WalletType | null>(null);
  const [accountEpoch, setAccountEpoch] = useState(0);

  // Invalidate an old card's request before effects or an async service can run.
  if (scope.current !== scopeKey) {
    scope.current = scopeKey;
    generation.current += 1;
    request.current?.abort();
    request.current = null;
  }

  useEffect(() => {
    mounted.current = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted.current) return;
      const nextAccount = session?.user?.id ?? null;
      if (account.current === undefined && event === 'INITIAL_SESSION' && !request.current) {
        account.current = nextAccount;
        return;
      }
      if (nextAccount === account.current && event !== 'SIGNED_OUT') return;
      account.current = nextAccount;
      generation.current += 1;
      // The service receives this signal and checks it before navigating.
      request.current?.abort();
      request.current = null;
      setBusyType(null);
      setAccountEpoch(value => value + 1);
    });
    return () => {
      mounted.current = false;
      generation.current += 1;
      request.current?.abort();
      request.current = null;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    committedGeneration.current = generation.current;
    setBusyType(null);
  }, [scopeKey, accountEpoch]);

  const start = (type: WalletType) => {
    // Even the same UID after sign-out/sign-in requires a new committed render.
    if (!mounted.current || request.current || scope.current !== scopeKey ||
      committedGeneration.current !== generation.current) return null;
    const controller = new AbortController();
    const epoch = generation.current;
    request.current = controller;
    setBusyType(type);
    const isCurrent = () => mounted.current && !controller.signal.aborted &&
      request.current === controller && generation.current === epoch && scope.current === scopeKey;
    return {
      signal: controller.signal,
      isCurrent,
      acceptOwner: (userId: string) => {
        if (!isCurrent() || (account.current !== undefined && account.current !== userId)) return false;
        account.current = userId;
        return true;
      },
      finish: () => {
        if (!isCurrent()) return;
        request.current = null;
        setBusyType(null);
      },
    };
  };

  return { start, busyType, isBusy: busyType !== null, accountEpoch };
}
