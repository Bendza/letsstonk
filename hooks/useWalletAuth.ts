import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

interface WalletAuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  authInProgress: boolean;
  hasProfile: boolean;
  hasPortfolio: boolean;
}

export function useWalletAuth() {
  const { connected, publicKey, disconnect } = useWallet();
  const [state, setState] = useState<WalletAuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
    authInProgress: false,
    hasProfile: false,
    hasPortfolio: false,
  });

  // Check existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await updateUserState(session.user);
        } else {
          setState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        
        if (event === 'SIGNED_IN' && session?.user) {
          await updateUserState(session.user);
        } else if (event === 'SIGNED_OUT') {
          setState({
            user: null,
            isAuthenticated: false,
            loading: false,
            authInProgress: false,
            hasProfile: false,
            hasPortfolio: false,
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const updateUserState = async (user: User) => {
    try {
      // Check if user has profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      // Check if user has portfolio
      const { data: portfolio, error: portfolioError } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setState({
        user,
        isAuthenticated: true,
        loading: false,
        authInProgress: false,
        hasProfile: !!profile && !profileError,
        hasPortfolio: !!portfolio && !portfolioError,
      });

    } catch (error) {
      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
        loading: false,
        authInProgress: false,
      }));
    }
  };

  const authenticateWithWeb3 = async () => {
    if (!connected || !publicKey) {
      return;
    }

    if (state.authInProgress) {
      return;
    }

    setState(prev => ({ ...prev, authInProgress: true }));

    try {
      
      const { data, error } = await supabase.auth.signInWithWeb3({
        chain: 'solana',
        statement: 'I accept the Terms of Service and authorize access to SolStock AI',
      });

      if (error) {
        setState(prev => ({ ...prev, authInProgress: false }));
        return;
      }

      if (data.user) {
        // updateUserState will be called by the auth state change listener
      }
    } catch (error) {
      setState(prev => ({ ...prev, authInProgress: false }));
    }
  };

  const manualAuth = async () => {
    if (state.isAuthenticated) {
      return;
    }
    
    await authenticateWithWeb3();
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      
      // Also disconnect the wallet
      if (connected) {
        await disconnect();
      }
      
    } catch (error) {
    }
  };

  const createUserProfile = async (riskLevel: number, initialInvestment: number) => {
    if (!state.user || !publicKey) {
      throw new Error('No authenticated user or wallet');
    }

    const walletAddress = publicKey.toBase58();

    try {

      // Upsert user profile (update if exists, create if not)
      const { error: userError } = await supabase
        .from('users')
        .upsert({
          id: state.user.id,
          wallet_address: walletAddress,
          risk_tolerance: riskLevel,
          total_invested: initialInvestment,
        }, {
          onConflict: 'id'
        });

      if (userError) {
        throw userError;
      }

      // Check if portfolio already exists
      const { data: existingPortfolio, error: checkError } = await supabase
        .from('portfolios')
        .select('id')
        .eq('user_id', state.user.id)
        .eq('is_active', true)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      // Only create portfolio if it doesn't exist
      if (!existingPortfolio) {
        const { error: portfolioError } = await supabase
          .from('portfolios')
          .insert({
            user_id: state.user.id,
            wallet_address: walletAddress,
            risk_level: riskLevel,
            initial_investment: initialInvestment,
            total_value: initialInvestment,
          });

        if (portfolioError) {
          throw portfolioError;
        }
      } else {
      }

      // Update state
      setState(prev => ({
        ...prev,
        hasProfile: true,
        hasPortfolio: true,
      }));

      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  return {
    ...state,
    manualAuth,
    signOut,
    createUserProfile,
  };
} 