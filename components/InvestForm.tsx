"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, TrendingUp, Shield, AlertTriangle } from "lucide-react"
import { InvestmentFormSchema } from "../lib/types"
import { getAllocationForRisk, calculatePositionAmounts } from "../lib/risk-engine"
import { xStocksFetcher } from "../lib/fetchXStocks"
import { useMockSwap } from "../hooks/useMockSwap"
import { useMockWallet } from "./MockWalletProvider"
import { MockWalletButton } from "./MockWalletButton"

const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"

const riskLabels = {
  1: "Ultra Conservative",
  2: "Very Conservative",
  3: "Conservative",
  4: "Moderately Conservative",
  5: "Moderate",
  6: "Moderately Aggressive",
  7: "Aggressive",
  8: "Very Aggressive",
  9: "Ultra Aggressive",
  10: "Maximum Risk",
}

export function InvestForm() {
  const { connected, publicKey } = useMockWallet()
  const [riskLevel, setRiskLevel] = useState(5)
  const [usdcAmount, setUsdcAmount] = useState("")
  const [isInvesting, setIsInvesting] = useState(false)
  const { batchSwapMutation } = useMockSwap()

  // Fetch xStocks data
  const { data: xStocks, isLoading: isLoadingStocks } = useQuery({
    queryKey: ["xstocks"],
    queryFn: () => xStocksFetcher.fetchXStocks(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000,
  })

  // Get xStock addresses mapping
  const { data: xStockAddresses } = useQuery({
    queryKey: ["xstock-addresses"],
    queryFn: () => xStocksFetcher.getXStockAddresses(),
    enabled: !!xStocks,
    staleTime: 5 * 60 * 1000,
  })

  const allocation = getAllocationForRisk(riskLevel)
  const amount = Number.parseFloat(usdcAmount) || 0

  const handleInvest = async () => {
    if (!connected || !publicKey || !xStockAddresses) {
      return
    }

    try {
      // Validate form
      const formData = InvestmentFormSchema.parse({
        riskLevel,
        usdcAmount: amount,
        walletAddress: publicKey.toString(),
      })

      setIsInvesting(true)

      // Calculate position amounts
      const positions = calculatePositionAmounts(formData.usdcAmount, formData.riskLevel, xStockAddresses)

      // Create swap parameters for each position
      const swapParams = positions
        .filter((pos) => pos.address && pos.amount > 0)
        .map((pos) => ({
          inputMint: USDC_MINT,
          outputMint: pos.address,
          amount: Math.floor(pos.amount * 1_000_000), // Convert to USDC decimals (6)
          slippageBps: 50, // 0.5% slippage
        }))

      if (swapParams.length === 0) {
        throw new Error("No valid positions to invest in")
      }

      // Execute batch swap
      const results = await batchSwapMutation.mutateAsync(swapParams)

      console.log("Investment successful:", results)

      // TODO: Store investment record in Supabase
      // TODO: Redirect to portfolio dashboard
    } catch (error) {
      console.error("Investment failed:", error)
    } finally {
      setIsInvesting(false)
    }
  }

  const isFormValid = connected && amount > 0 && amount <= 1000000 && !isLoadingStocks

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Disclaimer */}
      <Alert className="border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <strong>Important Disclaimer:</strong> xStocks are tokenized securities issued by Backed Finance. They do not
          provide voting rights and are subject to regulatory restrictions. US persons are prohibited from trading these
          tokens. This is not investment advice.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Tokenized Stock Investment
          </CardTitle>
          <CardDescription>Invest in tokenized stocks through Backed Finance xStocks on Solana</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Mock Wallet Connection */}
          <div className="flex justify-center">
            <MockWalletButton />
          </div>

          {connected && (
            <>
              {/* Investment Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Investment Amount (USDC)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter USDC amount"
                  value={usdcAmount}
                  onChange={(e) => setUsdcAmount(e.target.value)}
                  min="1"
                  max="1000000"
                  step="0.01"
                />
                <p className="text-sm text-muted-foreground">Minimum: $1 USDC • Maximum: $1,000,000 USDC</p>
              </div>

              {/* Risk Level Slider */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Risk Level: {riskLevel}</Label>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4" />
                    {riskLabels[riskLevel as keyof typeof riskLabels]}
                  </div>
                </div>

                <Slider
                  value={[riskLevel]}
                  onValueChange={(value) => setRiskLevel(value[0])}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />

                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Conservative</span>
                  <span>Aggressive</span>
                </div>
              </div>

              {/* Allocation Preview */}
              {amount > 0 && (
                <div className="space-y-3">
                  <Label>Portfolio Allocation</Label>
                  <div className="grid gap-2">
                    {allocation.map((item) => (
                      <div key={item.symbol} className="flex justify-between items-center p-2 bg-muted rounded">
                        <span className="font-medium">{item.symbol}</span>
                        <div className="text-right">
                          <div className="font-medium">${((amount * item.percentage) / 100).toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground">{item.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>

        <CardFooter>
          <Button onClick={handleInvest} disabled={!isFormValid || isInvesting} className="w-full" size="lg">
            {isInvesting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Investment...
              </>
            ) : (
              "Invest Now"
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Rate Limiting Info */}
      <Alert>
        <AlertDescription>
          <strong>Rate Limiting:</strong> For high-frequency trading, consider upgrading to Jupiter's paid Portal API
          for higher rate limits. Current limit: 7 trades/minute on lite-api.jup.ag.
        </AlertDescription>
      </Alert>
    </div>
  )
}
