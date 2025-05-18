
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { useNavigate } from 'react-router-dom';

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null;
  status: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Clean up auth state from localStorage
  const cleanupAuthState = () => {
    // Remove standard auth tokens
    localStorage.removeItem('supabase.auth.token');
    // Remove all Supabase auth keys
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data as Profile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (!user) return;
    const profile = await fetchProfile(user.id);
    setProfile(profile);
  };

  useEffect(() => {
    // First set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);

        // Only fetch profile after a short delay
        if (newSession?.user) {
          setTimeout(async () => {
            const profile = await fetchProfile(newSession.user.id);
            setProfile(profile);
            setLoading(false);
          }, 0);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    // Then check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          setProfile(profile);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        throw error;
      }

      toast.success('Compte créé avec succès! Connectez-vous maintenant.');
      navigate('/auth?tab=signin');
      
    } catch (error: any) {
      toast.error(error.message || "Une erreur s'est produite lors de l'inscription");
      console.error('Signup error:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      cleanupAuthState();
      
      // Try global signout first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        throw error;
      }

      toast.success('Connecté avec succès!');
      navigate('/');
      
    } catch (error: any) {
      toast.error(error.message || "Une erreur s'est produite lors de la connexion");
      console.error('Signin error:', error);
    }
  };

  const signOut = async () => {
    try {
      cleanupAuthState();
      
      await supabase.auth.signOut({ scope: 'global' });
      toast.success('Déconnecté avec succès');
      
      // Force page reload for a clean state
      window.location.href = '/auth?tab=signin';
      
    } catch (error: any) {
      toast.error(error.message || "Une erreur s'est produite lors de la déconnexion");
      console.error('Signout error:', error);
    }
  };

  const isAdmin = profile?.role === 'Admin';

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      profile, 
      loading,
      signUp, 
      signIn, 
      signOut,
      refreshProfile,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
