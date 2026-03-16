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
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();
    const admin = !!data;
    cachedAdminStatus = { userId, isAdmin: admin };
    setIsAdmin(admin);
  }, []);

  useEffect(() => {
    let mounted = true;

    // First get the current session synchronously
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await checkAdmin(session.user.id);
      }
      if (mounted) setLoading(false);
    });

    // Then listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await checkAdmin(session.user.id);
        } else {
          setIsAdmin(false);
          cachedAdminStatus = null;
        }
        if (mounted) setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [checkAdmin]);

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
