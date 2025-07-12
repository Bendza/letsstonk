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
          console.log('✅ Found existing session:', session.user.id);
          await updateUserState(session.user);
        } else {
          console.log('❌ No existing session found');
          setState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('❌ Error checking session:', error);
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔔 Auth state change:', event);
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('✅ User signed in:', session.user.id);
          await updateUserState(session.user);
        } else if (event === 'SIGNED_OUT') {
          console.log('👋 User signed out');
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

      console.log('✅ User state updated:', {
        userId: user.id,
        hasProfile: !!profile && !profileError,
        hasPortfolio: !!portfolio && !portfolioError,
      });
    } catch (error) {
      console.error('❌ Error updating user state:', error);
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
      console.log('❌ Wallet not connected');
      return;
    }

    if (state.authInProgress) {
      console.log('⏳ Authentication already in progress');
      return;
    }

    setState(prev => ({ ...prev, authInProgress: true }));

    try {
      console.log('🔐 Starting Web3 authentication...');
      
      const { data, error } = await supabase.auth.signInWithWeb3({
        chain: 'solana',
        statement: 'I accept the Terms of Service and authorize access to SolStock AI',
      });

      if (error) {
        console.error('❌ Web3 authentication error:', error);
        setState(prev => ({ ...prev, authInProgress: false }));
        return;
      }

      if (data.user) {
        console.log('✅ Web3 authentication successful:', data.user.id);
        // updateUserState will be called by the auth state change listener
      }
    } catch (error) {
      console.error('❌ Web3 authentication failed:', error);
      setState(prev => ({ ...prev, authInProgress: false }));
    }
  };

  const manualAuth = async () => {
    if (state.isAuthenticated) {
      console.log('✅ Already authenticated');
      return;
    }
    
    console.log('🔐 Manual authentication triggered');
    await authenticateWithWeb3();
  };

  const signOut = async () => {
    try {
      console.log('🚪 Signing out...');
      await supabase.auth.signOut();
      
      // Also disconnect the wallet
      if (connected) {
        await disconnect();
      }
      
      console.log('✅ Signed out successfully');
    } catch (error) {
      console.error('❌ Error signing out:', error);
    }
  };

  const createUserProfile = async (riskLevel: number, initialInvestment: number) => {
    if (!state.user || !publicKey) {
      throw new Error('No authenticated user or wallet');
    }

    const walletAddress = publicKey.toBase58();

    try {
      console.log('📝 Creating user profile...', { riskLevel, initialInvestment, walletAddress });

      // Create user profile
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: state.user.id,
          wallet_address: walletAddress,
          risk_tolerance: riskLevel,
          total_invested: initialInvestment,
        });

      if (userError) {
        console.error('❌ Error creating user profile:', userError);
        throw userError;
      }

      // Create portfolio
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
        console.error('❌ Error creating portfolio:', portfolioError);
        throw portfolioError;
      }

      // Update state
      setState(prev => ({
        ...prev,
        hasProfile: true,
        hasPortfolio: true,
      }));

      console.log('✅ User profile and portfolio created successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Error creating user profile:', error);
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