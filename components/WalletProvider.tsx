"use client"

import React, { useMemo } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets'

// Import wallet adapter CSS
require('@solana/wallet-adapter-react-ui/styles.css')

interface Props {
  children: React.ReactNode
}

export function SolanaWalletProvider({ children }: Props) {
  // Use devnet for development, can switch to mainnet-beta for production
  const network = WalletAdapterNetwork.Devnet
  
  // Use more reliable RPC endpoints to avoid 403 errors
  const endpoint = useMemo(() => {
    if (network === WalletAdapterNetwork.Devnet) {
      return 'https://api.devnet.solana.com'
    }
    // For mainnet, use Helius free tier or other reliable RPC
    // These are more reliable than the public api.mainnet-beta.solana.com
    return process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://mainnet.helius-rpc.com/?api-key=demo'
  }, [network])

  // Wallet adapters supported
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
    ],
    [network]
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
} 