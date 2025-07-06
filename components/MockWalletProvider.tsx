"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import { PublicKey } from "@solana/web3.js"

interface MockWalletContextType {
  connected: boolean
  connecting: boolean
  publicKey: PublicKey | null
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  signTransaction: (transaction: any) => Promise<any>
  signAllTransactions: (transactions: any[]) => Promise<any[]>
}

const MockWalletContext = createContext<MockWalletContextType | null>(null)

export function useMockWallet() {
  const context = useContext(MockWalletContext)
  if (!context) {
    throw new Error("useMockWallet must be used within MockWalletProvider")
  }
  return context
}

export function MockWalletProvider({ children }: { children: React.ReactNode }) {
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null)

  const connect = useCallback(async () => {
    setConnecting(true)

    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock wallet address
    const mockAddress = "7BgBvyjrZX1YKz4oh9mjb8ZScatkkwb8DzFx7LoiVkM3"
    setPublicKey(new PublicKey(mockAddress))
    setConnected(true)
    setConnecting(false)
  }, [])

  const disconnect = useCallback(async () => {
    setPublicKey(null)
    setConnected(false)
  }, [])

  const signTransaction = useCallback(
    async (transaction: any) => {
      if (!connected) {
        throw new Error("Wallet not connected")
      }

      // Mock transaction signing
      console.log("Mock signing transaction:", transaction)
      return {
        ...transaction,
        signatures: ["mock_signature_" + Date.now()],
        serialize: () => Buffer.from("mock_serialized_transaction", "base64"),
      }
    },
    [connected],
  )

  const signAllTransactions = useCallback(
    async (transactions: any[]) => {
      if (!connected) {
        throw new Error("Wallet not connected")
      }

      return transactions.map((tx, index) => ({
        ...tx,
        signatures: [`mock_signature_${index}_${Date.now()}`],
        serialize: () => Buffer.from(`mock_serialized_transaction_${index}`, "base64"),
      }))
    },
    [connected],
  )

  const value = {
    connected,
    connecting,
    publicKey,
    connect,
    disconnect,
    signTransaction,
    signAllTransactions,
  }

  return <MockWalletContext.Provider value={value}>{children}</MockWalletContext.Provider>
}
