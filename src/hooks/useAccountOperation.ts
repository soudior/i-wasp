import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

/** Synchronous lock plus account/unmount cancellation for multi-step UI writes. */
export function useAccountOperation(userId: string | undefined) {
  const mounted = useRef(true);
  const currentUser = useRef(userId);
  const renderedUser = useRef(userId);
  const generation = useRef(0);
  const committedGeneration = useRef(0);
  const active = useRef<symbol | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [accountEpoch, setAccountEpoch] = useState(0);

  // Invalidate during render as well as at the auth event, before effects run.
  if (renderedUser.current !== userId) {
    renderedUser.current = userId;
    currentUser.current = userId;
    generation.current += 1;
    active.current = null;
  }

  useEffect(() => {
    mounted.current = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted.current) return;
      const nextUser = session?.user?.id;
      if (nextUser === currentUser.current) return;
      currentUser.current = nextUser;
      generation.current += 1;
      active.current = null;
      setIsBusy(false);
      setAccountEpoch(value => value + 1);
    });
    return () => {
      mounted.current = false;
      generation.current += 1;
      active.current = null;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    committedGeneration.current = generation.current;
    setIsBusy(false);
  }, [userId, accountEpoch]);

  const capture = () => {
    const epoch = generation.current;
    const owner = currentUser.current;
    return () => mounted.current && epoch === generation.current && owner === currentUser.current;
  };

  const isLocked = () => !mounted.current || active.current !== null || currentUser.current !== userId ||
    committedGeneration.current !== generation.current;

  const start = () => {
    // Auth can sign out and back into the same account before React resets pending IDs.
    // Do not let a same-tick click reuse that previous account generation.
    if (isLocked()) return null;
    const token = Symbol('account-operation');
    active.current = token;
    const currentAccount = capture();
    const isCurrent = () => currentAccount() && active.current === token;
    setIsBusy(true);
    return {
      isCurrent,
      finish: () => {
        if (!isCurrent()) return;
        active.current = null;
        setIsBusy(false);
      },
    };
  };

  return { start, isLocked, isBusy, accountEpoch };
}
