import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

// Cache admin status to avoid re-fetching on every mount
let cachedAdminStatus: { userId: string; isAdmin: boolean } | null = null;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdmin = useCallback(async (userId: string) => {
    if (cachedAdminStatus?.userId === userId) {
      setIsAdmin(cachedAdminStatus.isAdmin);
      return;
    }

    const { data, error } = await supabase.rpc('has_role', {
      _user_id: userId,
      _role: 'admin',
    });

    const admin = !error && !!data;
    cachedAdminStatus = { userId, isAdmin: admin };
    setIsAdmin(admin);
  }, []);

  const syncSessionState = useCallback(
    async (currentSession: Session | null) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        await checkAdmin(currentSession.user.id);
      } else {
        setIsAdmin(false);
        cachedAdminStatus = null;
      }

      setLoading(false);
    },
    [checkAdmin]
  );

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, nextSession) => {
        if (!mounted) return;
        await syncSessionState(nextSession);
      }
    );

    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      if (!mounted) return;
      await syncSessionState(currentSession);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [syncSessionState]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    cachedAdminStatus = null;
    await supabase.auth.signOut();
  };

  return { user, session, isAdmin, loading, signIn, signOut };
}
