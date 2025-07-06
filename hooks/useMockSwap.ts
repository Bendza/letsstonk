"use client"

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

export function useMockSwap() {
  const getQuote = async (params: SwapParams): Promise<SwapQuote> => {
    const { inputMint, outputMint, amount, slippageBps = 50 } = params

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock quote response
    return {
      inputMint,
      inAmount: amount.toString(),
      outputMint,
      outAmount: Math.floor(amount * 0.98).toString(), // 2% price impact simulation
      otherAmountThreshold: Math.floor(amount * 0.975).toString(),
      swapMode: "ExactIn",
      slippageBps,
      platformFee: null,
      priceImpactPct: "2.0",
      routePlan: [
        {
          swapInfo: {
            ammKey: "mock_amm_key",
            label: "Mock DEX",
            inputMint,
            outputMint,
            inAmount: amount.toString(),
            outAmount: Math.floor(amount * 0.98).toString(),
            feeAmount: Math.floor(amount * 0.003).toString(),
            feeMint: inputMint,
          },
        },
      ],
    }
  }

  const executeSwap = async (quote: SwapQuote): Promise<string> => {
    // Simulate swap execution delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock transaction signature
    const signature = `mock_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    console.log("Mock swap executed:", { quote, signature })

    return signature
  }

  const swapMutation = useMutation({
    mutationFn: async (params: SwapParams): Promise<SwapResult> => {
      const quote = await getQuote(params)
      const signature = await executeSwap(quote)
      return { signature, quote }
    },
    onError: (error) => {
      console.error("Mock swap failed:", error)
    },
  })

  const batchSwapMutation = useMutation({
    mutationFn: async (swaps: SwapParams[]): Promise<SwapResult[]> => {
      const results: SwapResult[] = []

      // Execute swaps sequentially
      for (const swap of swaps) {
        const quote = await getQuote(swap)
        const signature = await executeSwap(quote)
        results.push({ signature, quote })

        // Small delay between swaps
        await new Promise((resolve) => setTimeout(resolve, 500))
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
