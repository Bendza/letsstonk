"use client"

import { FC, ReactNode, useMemo } from "react"
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import "@solana/wallet-adapter-react-ui/styles.css"
import { clusterApiUrl } from "@solana/web3.js"
import { getTradingRpcUrl } from "@/lib/rpc-config"
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  MathWalletAdapter,
  CoinbaseWalletAdapter,
} from "@solana/wallet-adapter-wallets"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"

interface WalletContextProviderProps {
  children: ReactNode
}

const WalletContextProvider: FC<WalletContextProviderProps> = ({ children }) => {
  const network = WalletAdapterNetwork.Mainnet
  
  // Use our RPC configuration to avoid rate limiting
  const endpoint = useMemo(() => {
    // Try to use custom RPC first, fallback to default if not set
    const customRpc = getTradingRpcUrl()
    if (customRpc && customRpc !== 'https://api.mainnet-beta.solana.com') {
      return customRpc
    }
    
    return clusterApiUrl(network)
  }, [network])

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new MathWalletAdapter(),
      new CoinbaseWalletAdapter(),
    ],
    []
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

export default WalletContextProvider 