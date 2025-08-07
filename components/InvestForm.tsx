"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, TrendingUp, Shield, AlertTriangle, Wallet } from "lucide-react"
import { InvestmentFormSchema } from "../lib/types"
import { getAllocationForRisk, calculatePositionAmounts } from "../lib/risk-engine"
import { fetchXStocks, fetchPrices } from "../lib/fetchXStocks"
import { useJupiterTrading } from "../hooks/useJupiterTrading"
import { useWallets } from '@privy-io/react-auth'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { usePortfolio } from "../hooks/usePortfolio"

const SOL_MINT = "So11111111111111111111111111111111111111112"

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
  const { wallets } = useWallets()
  const connected = wallets.length > 0
  const publicKey = wallets[0]?.address
  const [riskLevel, setRiskLevel] = useState(5)
  const [solAmount, setSolAmount] = useState("")
  const [isInvesting, setIsInvesting] = useState(false)
  const [stocks, setStocks] = useState<any[]>([])
  const [stockPrices, setStockPrices] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const { buyXStock, loading: jupiterLoading, error: jupiterError, connected: jupiterConnected } = useJupiterTrading()
  const { portfolio, syncPortfolio } = usePortfolio(publicKey?.toString() || null)

  // Fetch xStocks data and prices (same as Markets page)
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true)
        
        // Fetch xStocks metadata from database (same as Markets)
        const xStocks = await fetchXStocks()
        
        if (xStocks.length === 0) {
          return
        }

        // Fetch live prices only for tokens with valid addresses
        const validStocks = xStocks.filter(stock => stock.address && stock.address.length > 0)
        const addresses = validStocks.map(stock => stock.address)
        
        const prices = await fetchPrices(addresses)

        setStocks(xStocks)
        setStockPrices(prices)
      } catch (err) {
      } finally {
        setLoading(false)
      }
    }

    fetchStockData()
  }, [])

  const allocation = getAllocationForRisk(riskLevel)
  const amount = Number.parseFloat(solAmount) || 0

  const handleInvest = async () => {
    if (!connected || !publicKey || !jupiterConnected) {
      return
    }

    try {
      setIsInvesting(true)

      // Get allocation for risk level
      const allocations = getAllocationForRisk(riskLevel)
      const portfolioId = portfolio?.id
      
      // Process each allocation sequentially to avoid overwhelming the network
      for (const allocation of allocations) {
        const solAllocation = (amount * allocation.percentage) / 100
        
        if (solAllocation > 0.001) { // Only trade if allocation is meaningful (> 0.001 SOL)
          try {
            const signature = await buyXStock(allocation.symbol, solAllocation, portfolioId, 'SOL')
            
            if (signature) {
            } else {
            }
            
            // Small delay between trades to avoid rate limits
            await new Promise(resolve => setTimeout(resolve, 1000))
          } catch (error) {
          }
        }
      }
      
      // Sync portfolio after all trades
      if (syncPortfolio) {
        await syncPortfolio()
      }
      
      // Reset form
      setSolAmount("")
      
    } catch (error) {
    } finally {
      setIsInvesting(false)
    }
  }

  const isFormValid = connected && amount > 0 && amount <= 100 && !loading // Max 100 SOL

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
          {/* Wallet Connection */}
          {!connected && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Wallet className="w-5 h-5 text-amber-600" />
                <div>
                  <div className="text-sm font-medium text-amber-800">Connect Wallet Required</div>
                  <div className="text-xs text-amber-700">Please connect your Solana wallet to invest</div>
                </div>
              </div>
              <div className="mt-3 flex justify-center">
                <WalletMultiButton />
              </div>
            </div>
          )}

          {connected && (
            <>
              {/* Investment Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Investment Amount (SOL)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter SOL amount"
                  value={solAmount}
                  onChange={(e) => setSolAmount(e.target.value)}
                  min="0.1"
                  max="100"
                  step="0.01"
                />
                <p className="text-sm text-muted-foreground">Minimum: 0.1 SOL • Maximum: 100 SOL</p>
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
                    {allocation.map((item) => {
                      const solAllocation = (amount * item.percentage) / 100
                      const stockPrice = stockPrices[stocks.find(s => s.symbol === item.symbol)?.address || '']
                      const estimatedShares = stockPrice ? solAllocation / stockPrice : 0
                      
                      return (
                        <div key={item.symbol} className="flex justify-between items-center p-2 bg-muted rounded">
                          <div>
                            <span className="font-medium">{item.symbol}</span>
                            {stockPrice && (
                              <div className="text-xs text-muted-foreground">
                                ~{estimatedShares.toFixed(4)} shares @ ${stockPrice.toFixed(2)}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{solAllocation.toFixed(3)} SOL</div>
                            <div className="text-sm text-muted-foreground">{item.percentage}%</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>

        <CardFooter className="space-y-4">
          {jupiterError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 w-full">
              <div className="text-red-800 text-sm">{jupiterError}</div>
            </div>
          )}
          
          <Button onClick={handleInvest} disabled={!isFormValid || isInvesting || jupiterLoading} className="w-full" size="lg">
            {isInvesting || jupiterLoading ? (
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

      {/* Real Trading Info */}
      <Alert>
        <AlertDescription>
          <strong>Real Trading:</strong> This uses Jupiter's swap aggregator for on-chain trading on Solana mainnet.
          Transactions require SOL for fees and may take 15-30 seconds to confirm.
        </AlertDescription>
      </Alert>
    </div>
  )
}
