import { z } from "zod"

// Zod schemas for validation
export const InvestmentFormSchema = z.object({
  riskLevel: z.number().min(1).max(10),
  usdcAmount: z.number().min(1).max(1000000),
  walletAddress: z.string().min(32),
})

export const XStockSchema = z.object({
  address: z.string(),
  symbol: z.string(),
  name: z.string(),
  decimals: z.number(),
  logoURI: z.string().optional(),
  tags: z.array(z.string()),
  daily_volume: z.number().optional(),
  market_cap: z.number().optional(),
  freeze_authority: z.string().nullable().optional(),
  mint_authority: z.string().nullable().optional(),
})

// Core types
export type XStock = z.infer<typeof XStockSchema>
export type InvestmentForm = z.infer<typeof InvestmentFormSchema>

export interface Allocation {
  symbol: string
  percentage: number
  address: string
}

export interface SwapQuote {
  inputMint: string
  inAmount: string
  outputMint: string
  outAmount: string
  otherAmountThreshold: string
  swapMode: string
  slippageBps: number
  platformFee: null
  priceImpactPct: string
  routePlan: any[]
}

export interface Portfolio {
  totalValue: number
  positions: Position[]
  lastUpdated: Date
}

export interface Position {
  symbol: string
  address: string
  amount: number
  value: number
  allocation: number
  pnl: number
  pnlPercentage: number
}
