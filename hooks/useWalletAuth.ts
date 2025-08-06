// useWalletAuth replaced with usePrivyAuth
// This file exists as a stub for backward compatibility

import { usePrivyAuth } from './usePrivyAuth';

export function useWalletAuth() {
  // Redirect to the new Privy auth hook
  const privyAuth = usePrivyAuth();
  
  return {
    ...privyAuth,
    // Backward compatibility aliases
    connected: privyAuth.walletInfo?.connected || false,
    walletAddress: privyAuth.walletInfo?.address || '',
    createUserProfile: async () => {
      console.warn('createUserProfile is deprecated - using frontend-only approach');
    },
    manualAuth: privyAuth.login,
    signOut: privyAuth.logout,
  };
}