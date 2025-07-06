import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Transaction, VersionedTransaction } from "@solana/web3.js"
import { useMutation } from "@tanstack/react-query"
import type { SwapQuote } from "../lib/types"

interface SwapParams {
  inputMint: string
  outputMint: string
  amount: number
  slippageBps?: number
}

interface SwapResult {
  signature: string
  quote: SwapQuote
}

export function useSwapLeg() {
  const { connection } = useConnection()
  const { publicKey, signTransaction, signAllTransactions } = useWallet()

  const getQuote = async (params: SwapParams): Promise<SwapQuote> => {
    const { inputMint, outputMint, amount, slippageBps = 50 } = params

    // Use public API endpoint without API key for quotes
    const quoteUrl = new URL("https://lite-api.jup.ag/v6/quote")
    quoteUrl.searchParams.set("inputMint", inputMint)
    quoteUrl.searchParams.set("outputMint", outputMint)
    quoteUrl.searchParams.set("amount", amount.toString())
    quoteUrl.searchParams.set("slippageBps", slippageBps.toString())
    quoteUrl.searchParams.set("onlyDirectRoutes", "false")
    quoteUrl.searchParams.set("asLegacyTransaction", "false")

    const response = await fetch(quoteUrl.toString(), {
      headers: {
        Accept: "application/json",
        "User-Agent": "SolanaRoboAdvisor/1.0",
      },
    })

    if (!response.ok) {
      throw new Error(`Quote failed: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  const executeSwap = async (quote: SwapQuote): Promise<string> => {
    if (!publicKey || !signTransaction) {
      throw new Error("Wallet not connected")
    }

    // Get swap transaction using public API
    const swapResponse = await fetch("https://lite-api.jup.ag/v6/swap", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "SolanaRoboAdvisor/1.0",
      },
      body: JSON.stringify({
        quoteResponse: quote,
        userPublicKey: publicKey.toString(),
        wrapAndUnwrapSol: true,
        useSharedAccounts: true,
        feeAccount: undefined, // Add your fee account if needed
        trackingAccount: undefined, // Add tracking account if needed
        computeUnitPriceMicroLamports: "auto",
      }),
    })

    if (!swapResponse.ok) {
      throw new Error(`Swap transaction failed: ${swapResponse.status}`)
    }

    const { swapTransaction } = await swapResponse.json()

    try {
      // Try as VersionedTransaction first
      const transactionBuf = Buffer.from(swapTransaction, "base64")
      const transaction = VersionedTransaction.deserialize(transactionBuf)

      const signedTransaction = await signTransaction(transaction as any)
      const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
        skipPreflight: false,
        preflightCommitment: "confirmed",
        maxRetries: 3,
      })

      // Confirm transaction
      await connection.confirmTransaction(signature, "confirmed")
      return signature
    } catch (versionedError) {
      console.warn("VersionedTransaction failed, trying legacy:", versionedError)

      // Fallback to legacy transaction
      try {
        const transaction = Transaction.from(Buffer.from(swapTransaction, "base64"))
        const signedTransaction = await signTransaction(transaction)

        const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
          skipPreflight: false,
          preflightCommitment: "confirmed",
          maxRetries: 3,
        })

        await connection.confirmTransaction(signature, "confirmed")
        return signature
      } catch (legacyError) {
        console.error("Both versioned and legacy transactions failed:", legacyError)
        throw new Error("Transaction signing failed")
      }
    }
  }

  const swapMutation = useMutation({
    mutationFn: async (params: SwapParams): Promise<SwapResult> => {
      const quote = await getQuote(params)
      const signature = await executeSwap(quote)
      return { signature, quote }
    },
    onError: (error) => {
      console.error("Swap failed:", error)
    },
  })

  const batchSwapMutation = useMutation({
    mutationFn: async (swaps: SwapParams[]): Promise<SwapResult[]> => {
      const results: SwapResult[] = []

      // Execute swaps sequentially to avoid rate limits
      for (const swap of swaps) {
        const quote = await getQuote(swap)
        const signature = await executeSwap(quote)
        results.push({ signature, quote })

        // Small delay between swaps to respect rate limits
        await new Promise((resolve) => setTimeout(resolve, 200))
      }

      return results
    },
  })

  return {
    getQuote,
    executeSwap,
    swapMutation,
    batchSwapMutation,
    isSwapping: swapMutation.isPending || batchSwapMutation.isPending,
  }
}
