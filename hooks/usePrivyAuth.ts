'use client';

import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useState, useEffect } from 'react';
import { generateMockPortfolio, MockPortfolio } from '@/lib/frontend-data';

interface PrivyAuthState {
  user: any | null;
  isAuthenticated: boolean;
  loading: boolean;
  hasProfile: boolean;
  hasPortfolio: boolean;
  portfolio: MockPortfolio | null;
  error: string | null;
}

export function usePrivyAuth() {
  // Check if we're in demo mode (no valid Privy app ID)
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const isDemoMode = !appId || appId === 'your-privy-app-id-here';
  
  const {
    user,
    authenticated,
    ready,
    login,
    logout,
    connectWallet,
    linkWallet,
  } = isDemoMode ? {
    user: null,
    authenticated: false,
    ready: true,
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    connectWallet: () => Promise.resolve(),
    linkWallet: () => Promise.resolve(),
  } : usePrivy();
  
  const { wallets } = isDemoMode ? { wallets: [] } : useWallets();
  
  const [state, setState] = useState<PrivyAuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
    hasProfile: false,
    hasPortfolio: false,
    portfolio: null,
    error: null,
  });

  // Update state when Privy state changes or in demo mode
  useEffect(() => {
    if (isDemoMode) {
      // Demo mode: provide mock authentication for browsing
      setState({
        user: { 
          id: 'demo-user',
          wallet: { address: 'DemoWallet1234567890123456789012345678' }
        },
        isAuthenticated: true, // Set to true for demo
        loading: false,
        hasProfile: true,
        hasPortfolio: true,
        portfolio: generateMockPortfolio('DemoWallet1234567890123456789012345678', 5),
        error: null,
      });
      return;
    }

    if (!ready) {
      setState(prev => ({ ...prev, loading: true }));
      return;
    }

    if (authenticated && user) {
      // Get the primary wallet (Solana wallet)
      const solanaWallet = wallets.find(w => w.chainType === 'solana');
      const walletAddress = solanaWallet?.address || user.id;

      // Generate mock portfolio for the user
      const mockPortfolio = generateMockPortfolio(walletAddress, 5);

      setState({
        user,
        isAuthenticated: true,
        loading: false,
        hasProfile: true, // Always true in frontend-only mode
        hasPortfolio: true, // Always true in frontend-only mode
        portfolio: mockPortfolio,
        error: null,
      });
    } else {
      setState({
        user: null,
        isAuthenticated: false,
        loading: false,
        hasProfile: false,
        hasPortfolio: false,
        portfolio: null,
        error: null,
      });
    }
  }, [isDemoMode, ready, authenticated, user, wallets]);

  const handleLogin = async () => {
    try {
      setState(prev => ({ ...prev, error: null }));
      await login();
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Login failed',
      }));
    }
  };

  const handleLogout = async () => {
    try {
      setState(prev => ({ ...prev, error: null }));
      await logout();
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Logout failed',
      }));
    }
  };

  const handleConnectWallet = async () => {
    try {
      setState(prev => ({ ...prev, error: null }));
      await connectWallet();
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Wallet connection failed',
      }));
    }
  };

  // Get wallet info - simplified since we're using useSolanaWallets in components
  const getWalletInfo = () => {
    if (!authenticated) return null;
    
    return {
      connected: authenticated,
      chainType: 'solana',
    };
  };

  return {
    // State
    ...state,
    ready,
    
    // Wallet info
    walletInfo: getWalletInfo(),
    wallets,
    
    // Actions
    login: handleLogin,
    logout: handleLogout,
    connectWallet: handleConnectWallet,
    linkWallet,
    
    // Backward compatibility aliases
    isAuthenticated: state.isAuthenticated,
    signOut: handleLogout,
    manualAuth: handleLogin,
  };
}