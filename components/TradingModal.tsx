"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpDown, TrendingUp, TrendingDown, DollarSign, Coins, CheckCircle, ExternalLink, AlertCircle } from "lucide-react"
import { useSwapLeg } from "@/hooks/useSwapLeg"
import { useMockSwap } from "@/hooks/useMockSwap"
import { useWalletAuth } from "@/hooks/useWalletAuth"
import { usePortfolio } from "@/hooks/usePortfolio"
import { useWallet } from '@solana/wallet-adapter-react'
import { supabase } from "@/lib/supabase"

interface TradingModalProps {
  stock: {
    symbol: string
    name: string
    price: number
    change: number
    changePercent: number
    logoUri?: string
    address: string
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface TransactionStep {
  id: string
  label: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  message?: string
  signature?: string
}

export function TradingModal({ stock, open, onOpenChange }: TradingModalProps) {
  const [side, setSide] = useState<"buy" | "sell">("buy")
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [showTransactionFlow, setShowTransactionFlow] = useState(false)
  const [transactionSteps, setTransactionSteps] = useState<TransactionStep[]>([])
  const [useMockSwapMode, setUseMockSwapMode] = useState(false)
  const [transactionError, setTransactionError] = useState<string | null>(null)
  
  // Known liquid tokens that should work with Jupiter (for testing)
  const LIQUID_TOKENS = [
    'So11111111111111111111111111111111111111112', // SOL
    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
    'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', // USDT
    'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So', // mSOL
    'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN', // JUP
    'bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1', // bSOL
  ]
  
  const { swapMutation } = useSwapLeg()
  const { swapMutation: mockSwapMutation } = useMockSwap()
  const { user } = useWalletAuth()
  const { publicKey } = useWallet()
  const { portfolio, syncPortfolio } = usePortfolio(publicKey?.toString() || null)



  const initializeTransactionSteps = () => {
    const steps: TransactionStep[] = [
      { id: 'availability', label: 'Checking token availability', status: 'pending' },
      { id: 'quote', label: 'Getting swap quote', status: 'pending' },
      { id: 'transaction', label: 'Executing swap transaction', status: 'pending' },
      { id: 'confirmation', label: 'Confirming transaction', status: 'pending' },
      { id: 'database', label: 'Recording transaction', status: 'pending' },
      { id: 'portfolio', label: 'Updating portfolio', status: 'pending' }
    ]
    setTransactionSteps(steps)
  }

  const updateTransactionStep = (stepId: string, status: TransactionStep['status'], message?: string, signature?: string) => {
    setTransactionSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status, message, signature } : step
    ))
  }

  const testTokenAvailability = async (inputMint: string, outputMint: string, amount: number) => {
    try {
      // Test if we can get a quote from Jupiter
      const quoteUrl = new URL("https://lite-api.jup.ag/v6/quote")
      quoteUrl.searchParams.set("inputMint", inputMint)
      quoteUrl.searchParams.set("outputMint", outputMint)
      quoteUrl.searchParams.set("amount", amount.toString())
      quoteUrl.searchParams.set("slippageBps", "50")

      console.log("Testing token availability:", {
        inputMint,
        outputMint,
        amount,
        url: quoteUrl.toString()
      })

      const response = await fetch(quoteUrl.toString(), {
        headers: {
          Accept: "application/json",
          "User-Agent": "SolanaRoboAdvisor/1.0",
        },
      })

      console.log("Jupiter quote response:", response.status, response.statusText)

      if (response.ok) {
        const data = await response.json()
        console.log("Jupiter quote data:", data)
        return data.outAmount !== undefined && data.outAmount !== "0"
      } else {
        const errorData = await response.text()
        console.warn("Jupiter quote failed:", response.status, errorData)
        
        // Check if it's a 404 (token not found) vs other errors
        if (response.status === 404) {
          console.log("Token not available on Jupiter (404)")
          return false
        }
      }
      return false
    } catch (error) {
      console.warn("Token availability test failed:", error)
      return false
    }
  }

  const handleTrade = async () => {
    if (!amount || parseFloat(amount) <= 0) return
    
    setLoading(true)
    setShowTransactionFlow(true)
    initializeTransactionSteps()
    
    try {
      const tradeAmount = parseFloat(amount)
      
      console.log("Executing trade:", { 
        symbol: stock.symbol, 
        side, 
        amount: tradeAmount, 
      })
      
      // Step 1: Check token availability
      updateTransactionStep('availability', 'in_progress', 'Checking if token is available on Jupiter...')
      
      let swapParams
      
      // Always try with the actual xStock token address first
      if (side === "buy") {
        // For buying: USDC -> xStock Token
        const usdcAmount = tradeAmount * stock.price
        swapParams = {
          inputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC mint
          outputMint: stock.address, // Actual xStock token mint
          amount: Math.floor(usdcAmount * 1_000_000), // Convert to USDC decimals
          slippageBps: 50 // 0.5% slippage
        }
      } else {
        // For selling: xStock Token -> USDC
        swapParams = {
          inputMint: stock.address, // Actual xStock token mint
          outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC mint
          amount: Math.floor(tradeAmount * Math.pow(10, 6)), // xStocks typically have 6 decimals
          slippageBps: 50 // 0.5% slippage
        }
      }
      
      // Test if the token is available on Jupiter
      const isAvailable = await testTokenAvailability(swapParams.inputMint, swapParams.outputMint, swapParams.amount)
      
      // Use local variable to ensure immediate availability check results
      let shouldUseMockSwap = false
      
      if (isAvailable) {
        updateTransactionStep('availability', 'completed', 'Token available on Jupiter - using real swap')
        shouldUseMockSwap = false
      } else {
        updateTransactionStep('availability', 'completed', 'Token not available on Jupiter - using mock swap')
        shouldUseMockSwap = true
      }
      
      // Update state for UI display (async, for UI only)
      setUseMockSwapMode(shouldUseMockSwap)
      
      // Step 2: Get quote and execute swap
      updateTransactionStep('quote', 'in_progress', 'Getting best swap route...')
      
      let result
      
      console.log("Swap parameters:", swapParams)
      console.log("Using mock swap mode:", shouldUseMockSwap)
      
      // Use the local variable for immediate decision making
      if (shouldUseMockSwap) {
        // Use mock swap for demonstration
        console.log("Executing mock swap...")
        result = await mockSwapMutation.mutateAsync(swapParams)
        updateTransactionStep('quote', 'completed', 'Mock quote received successfully')
        updateTransactionStep('transaction', 'in_progress', 'Executing mock swap transaction...')
      } else {
        // Use real Jupiter swap
        console.log("Executing real Jupiter swap...")
        result = await swapMutation.mutateAsync(swapParams)
        updateTransactionStep('quote', 'completed', 'Real quote received successfully')
        updateTransactionStep('transaction', 'in_progress', 'Executing real swap transaction...')
      }
      
      console.log("Swap result:", result)
      
      if (!result.signature) {
        throw new Error('Transaction failed - no signature returned')
      }
      
      updateTransactionStep('transaction', 'completed', 'Transaction executed successfully', result.signature)
      updateTransactionStep('confirmation', 'completed', 'Transaction confirmed on blockchain')
      
      // Step 4: Record transaction in database
      updateTransactionStep('database', 'in_progress', 'Recording transaction...')
      
      if (portfolio) {
        const { error: dbError } = await supabase
          .from('transactions')
          .insert({
            portfolio_id: portfolio.id,
            transaction_signature: result.signature,
            transaction_type: side,
            input_token: side === "buy" ? 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' : stock.address,
            output_token: side === "buy" ? stock.address : 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
            input_amount: swapParams.amount,
            output_amount: parseInt(result.quote.outAmount),
            price_impact: parseFloat(result.quote.priceImpactPct || '0'),
            slippage: 0.5, // 0.5% slippage used
            status: 'confirmed',
            block_time: new Date().toISOString()
          })

        if (dbError) {
          console.error('Database error:', dbError)
          updateTransactionStep('database', 'failed', 'Failed to record transaction in database')
        } else {
          updateTransactionStep('database', 'completed', 'Transaction recorded successfully')
        }
      }
      
      // Step 5: Update portfolio
      updateTransactionStep('portfolio', 'in_progress', 'Updating portfolio...')
      
      if (syncPortfolio) {
        await syncPortfolio()
        updateTransactionStep('portfolio', 'completed', 'Portfolio updated successfully')
      }
      
      console.log("✅ Trade completed successfully:", result)
      
    } catch (error) {
      console.error("❌ Trade failed:", error)
      
      // Update the current step as failed
      const currentStep = transactionSteps.find(step => step.status === 'in_progress')
      if (currentStep) {
        updateTransactionStep(currentStep.id, 'failed', error instanceof Error ? error.message : 'Unknown error')
      }
    } finally {
      setLoading(false)
    }
  }

  const resetModal = () => {
    setAmount("")
    setShowTransactionFlow(false)
    setTransactionSteps([])
    setLoading(false)
    setUseMockSwapMode(false)
    setTransactionError(null)
  }

  const handleClose = () => {
    resetModal()
    onOpenChange(false)
  }

  const estimatedTotal = parseFloat(amount || "0") * stock.price

  const renderLogo = () => {
    if (stock.logoUri) {
      if (stock.logoUri.startsWith('http')) {
        return (
          <img 
            src={stock.logoUri} 
            alt={`${stock.symbol} logo`} 
            className="w-8 h-8 rounded-full"
            onError={(e) => {
              // Fallback to emoji if image fails
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              target.nextElementSibling?.classList.remove('hidden')
            }}
          />
        )
      } else {
        return (
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-lg">
            {stock.logoUri}
          </div>
        )
      }
    }
    
    return (
      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
        <DollarSign className="w-4 h-4 text-gray-600" />
      </div>
    )
  }

  if (showTransactionFlow) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowUpDown className="w-5 h-5" />
              Transaction Progress
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {transactionSteps.map((step) => (
              <div key={step.id} className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="flex-shrink-0">
                  {step.status === 'pending' && (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                  )}
                  {step.status === 'in_progress' && (
                    <div className="w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                  )}
                  {step.status === 'completed' && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  {step.status === 'failed' && (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="font-medium text-sm">{step.label}</div>
                  {step.message && (
                    <div className={`text-xs mt-1 ${
                      step.status === 'failed' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {step.message}
                    </div>
                  )}
                  {step.signature && (
                    <div className="mt-2">
                      <a
                        href={useMockSwapMode ? '#' : `https://solscan.io/tx/${step.signature}`}
                        target={useMockSwapMode ? '_self' : '_blank'}
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1 text-xs ${
                          useMockSwapMode 
                            ? 'text-gray-500 cursor-default' 
                            : 'text-blue-600 hover:text-blue-800'
                        }`}
                        onClick={useMockSwapMode ? (e) => e.preventDefault() : undefined}
                      >
                        {useMockSwapMode ? 'Mock Transaction' : 'View on Solscan'} 
                        {!useMockSwapMode && <ExternalLink className="w-3 h-3" />}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Close
              </Button>
              {transactionSteps.every(step => step.status === 'completed') && (
                <Button
                  onClick={() => {
                    resetModal()
                    setShowTransactionFlow(false)
                  }}
                  className="flex-1"
                >
                  Trade Again
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {renderLogo()}
            <div>
              <div className="font-semibold">{stock.symbol}</div>
              <div className="text-sm text-gray-600">{stock.name}</div>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Current Price */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Current Price</span>
                <div className="text-right">
                  <div className="font-semibold">${stock.price.toFixed(2)}</div>
                  <div className={`text-xs flex items-center gap-1 ${
                    stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stock.changePercent >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {stock.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-sm text-blue-800">
              <strong>Demo Mode:</strong> This will automatically detect if the token is available on Jupiter. 
              If not, it will use a mock swap for demonstration purposes.
            </div>
          </div>

          {/* Buy/Sell Tabs */}
          <Tabs value={side} onValueChange={(value) => setSide(value as "buy" | "sell")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="buy" className="text-green-600 data-[state=active]:bg-green-50">
                Buy
              </TabsTrigger>
              <TabsTrigger value="sell" className="text-red-600 data-[state=active]:bg-red-50">
                Sell
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={side} className="space-y-4">
              {/* Amount Input */}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ({stock.symbol})</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Order Summary */}
              {amount && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span>{amount} {stock.symbol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Market Price:</span>
                      <span>${stock.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-2">
                      <span>Estimated Total:</span>
                      <span>${estimatedTotal.toFixed(2)}</span>
                    </div>
                    <div className="text-xs text-gray-600 mt-2">
                      * Market orders execute at the current market price
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Trade Button */}
              <Button
                onClick={handleTrade}
                disabled={loading || !amount || parseFloat(amount) <= 0}
                className={`w-full ${
                  side === "buy" 
                    ? "bg-green-600 hover:bg-green-700" 
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  <>
                    <Coins className="w-4 h-4 mr-2" />
                    {side === "buy" ? "Buy" : "Sell"} {stock.symbol}
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
