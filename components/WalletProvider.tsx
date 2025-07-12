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
import { clusterApiUrl } from '@solana/web3.js'

interface Props {
  children: React.ReactNode
}

export function SolanaWalletProvider({ children }: Props) {
  // Use devnet for development, can switch to mainnet-beta for production
  const network = WalletAdapterNetwork.Devnet
  
  // For free RPC, we'll use the public endpoint first
  // You can later switch to Helius/QuickNode free tier if needed
  const endpoint = useMemo(() => {
    if (network === WalletAdapterNetwork.Devnet) {
      return 'https://api.devnet.solana.com'
    }
    // For mainnet, we'll use public RPC for now (rate limited but free)
    return 'https://api.mainnet-beta.solana.com'
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