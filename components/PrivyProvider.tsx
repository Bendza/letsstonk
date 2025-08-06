'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
import { ReactNode } from 'react';

interface PrivyProviderWrapperProps {
  children: ReactNode;
}

export function PrivyProviderWrapper({ children }: PrivyProviderWrapperProps) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  
  // Demo mode: if no valid Privy App ID is provided, use a demo app ID
  const effectiveAppId = (!appId || appId === 'your-privy-app-id-here') 
    ? 'demo-app-id-for-development' 
    : appId;

  if (!appId || appId === 'your-privy-app-id-here') {
    console.warn('⚠️  DEMO MODE: No valid Privy App ID found. Using demo configuration.');
  }

  return (
    <PrivyProvider
      appId={effectiveAppId}
      config={{
        // Minimal configuration to test Solana wallet login
        appearance: {
          theme: 'dark',
          accentColor: '#FF9500',
          showWalletLoginFirst: true,
        },
        loginMethods: ['wallet'],
        // Enable Solana external wallets
        externalWallets: {
          solana: {
            connectors: toSolanaWalletConnectors(),
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}