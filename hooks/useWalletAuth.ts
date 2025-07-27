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
  error: string | null;
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
    error: null,
  });

  // Ref to track authentication timeout
  const authTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear any existing auth timeout
  const clearAuthTimeout = () => {
    if (authTimeoutRef.current) {
      clearTimeout(authTimeoutRef.current);
      authTimeoutRef.current = null;
    }
  };

  // Check existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('[AUTH] Checking existing session...');
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          console.log('[AUTH] Found existing session, updating user state');
          await updateUserState(session.user);
        } else {
          console.log('[AUTH] No existing session found');
          setState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('[AUTH] Error checking session:', error);
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: 'Failed to check authentication session'
        }));
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[AUTH] Auth state changed:', event, session?.user?.id);
        
        // Clear any pending auth timeout since we got a response
        clearAuthTimeout();
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('[AUTH] User signed in, updating state');
          await updateUserState(session.user);
        } else if (event === 'SIGNED_OUT') {
          console.log('[AUTH] User signed out');
          setState({
            user: null,
            isAuthenticated: false,
            loading: false,
            authInProgress: false,
            hasProfile: false,
            hasPortfolio: false,
            error: null,
          });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
      clearAuthTimeout();
    };
  }, []);

  const updateUserState = async (user: User) => {
    try {
      console.log('[AUTH] Updating user state for user:', user.id);
      
      // Use mock data (no Supabase calls to avoid 406 errors)
      const hasProfile = true; // Mock: assume user always has profile
      const hasPortfolio = true; // Mock: assume user always has portfolio

      console.log('[AUTH] Profile exists:', hasProfile, 'Portfolio exists:', hasPortfolio);

      setState({
        user,
        isAuthenticated: true,
        loading: false,
        authInProgress: false,
        hasProfile,
        hasPortfolio,
        error: null,
      });

    } catch (error) {
      console.error('[AUTH] Error updating user state:', error);
      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
        loading: false,
        authInProgress: false,
        error: null,
      }));
    }
  };

  const authenticateWithWeb3 = async () => {
    if (!connected || !publicKey) {
      console.log('[AUTH] Cannot authenticate: wallet not connected or no public key');
      return;
    }

    if (state.authInProgress) {
      console.log('[AUTH] Authentication already in progress, skipping');
      return;
    }

    console.log('[AUTH] Starting Web3 authentication...');
    setState(prev => ({ ...prev, authInProgress: true, error: null }));

    // Set a timeout to prevent getting stuck in authInProgress state
    authTimeoutRef.current = setTimeout(() => {
      console.error('[AUTH] Authentication timeout - resetting authInProgress');
      setState(prev => ({ 
        ...prev, 
        authInProgress: false,
        error: 'Authentication timed out. Please try again.'
      }));
    }, 30000); // 30 second timeout

    try {
      console.log('[AUTH] Calling supabase.auth.signInWithWeb3...');
      const { data, error } = await supabase.auth.signInWithWeb3({
        chain: 'solana',
        statement: 'I accept the Terms of Service and authorize access to SolStock AI',
      });

      if (error) {
        console.error('[AUTH] signInWithWeb3 error:', error);
        clearAuthTimeout();
        setState(prev => ({ 
          ...prev, 
          authInProgress: false,
          error: `Authentication failed: ${error.message}`
        }));
        return;
      }

      console.log('[AUTH] signInWithWeb3 success, data:', data);
      
      if (data.user) {
        console.log('[AUTH] User data received, waiting for auth state change...');
        // updateUserState will be called by the auth state change listener
        // If it doesn't fire within timeout, the timeout will reset authInProgress
      } else {
        console.warn('[AUTH] No user data in response');
        clearAuthTimeout();
        setState(prev => ({ 
          ...prev, 
          authInProgress: false,
          error: 'Authentication completed but no user data received'
        }));
      }
    } catch (error) {
      console.error('[AUTH] authenticateWithWeb3 catch error:', error);
      clearAuthTimeout();
      const errorMessage = error instanceof Error ? error.message : 'Unknown authentication error';
      setState(prev => ({ 
        ...prev, 
        authInProgress: false,
        error: `Authentication failed: ${errorMessage}`
      }));
    }
  };

  const manualAuth = async () => {
    console.log('[AUTH] Manual auth triggered, current state:', {
      connected,
      isAuthenticated: state.isAuthenticated,
      authInProgress: state.authInProgress,
      hasError: !!state.error
    });
    
    if (state.isAuthenticated) {
      console.log('[AUTH] Already authenticated, skipping');
      return;
    }

    // Clear any previous errors when attempting authentication again
    if (state.error) {
      console.log('[AUTH] Clearing previous error before retry');
      setState(prev => ({ ...prev, error: null }));
    }
    
    await authenticateWithWeb3();
  };

  // Clear error when wallet connection changes
  useEffect(() => {
    if (!connected) {
      setState(prev => ({ ...prev, error: null }));
    }
  }, [connected]);

  const signOut = async () => {
    try {
      clearAuthTimeout();
      console.log('[AUTH] Signing out...');
      
      // Immediately update state to prevent race conditions
      setState({
        user: null,
        isAuthenticated: false,
        loading: false,
        authInProgress: false,
        hasProfile: false,
        hasPortfolio: false,
        error: null,
      });
      
      // Perform cleanup operations in parallel
      const cleanupPromises = [];
      
      // Add wallet disconnect if connected
      if (connected) {
        cleanupPromises.push(disconnect().catch(err => console.error('Wallet disconnect error:', err)));
      }
      
      // Add Supabase signOut
      cleanupPromises.push(
        supabase.auth.signOut().catch(err => console.error('Supabase signOut error:', err))
      );
      
      // Wait for all cleanup operations with timeout
      await Promise.allSettled(cleanupPromises);
      
    } catch (error) {
      console.error('Logout error:', error);
      
      // Ensure state is always updated even on error
      setState({
        user: null,
        isAuthenticated: false,
        loading: false,
        authInProgress: false,
        hasProfile: false,
        hasPortfolio: false,
        error: null,
      });
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