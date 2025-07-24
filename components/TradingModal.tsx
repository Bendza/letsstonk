"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpDown, TrendingUp, TrendingDown, DollarSign, Coins, CheckCircle, ExternalLink, AlertCircle, Wallet } from "lucide-react"
import { useJupiterTrading } from "@/hooks/useJupiterTrading"
import { useWalletAuth } from "@/hooks/useWalletAuth"
import { usePortfolio } from "@/hooks/usePortfolio"
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Connection } from '@solana/web3.js'
import { getTradingRpcUrl } from "@/lib/rpc-config"

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
  const payWith: 'SOL' = 'SOL'
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [showTransactionFlow, setShowTransactionFlow] = useState(false)
  const [transactionSteps, setTransactionSteps] = useState<TransactionStep[]>([])
  const [transactionError, setTransactionError] = useState<string | null>(null)
  const [quote, setQuote] = useState<any>(null)
  const [quoteLoading, setQuoteLoading] = useState(false)
  const [solBalance, setSolBalance] = useState<number | null>(null)
  
  const { 
    getQuote, 
    buyXStock, 
    sellXStock, 
    checkSolBalance,
    loading: jupiterLoading, 
    error: jupiterError,
    connected 
  } = useJupiterTrading()
  
  const { user } = useWalletAuth()
  const { publicKey } = useWallet()
  const { portfolio, syncPortfolio } = usePortfolio(publicKey?.toString() || null)

  // Fetch SOL balance once when modal opens or after a trade completes
  useEffect(() => {
    if (!open) return

    const getBalance = async () => {
      if (!connected || !publicKey) {
        setSolBalance(null)
        return
      }
      try {
        const connection = new Connection(getTradingRpcUrl(), 'confirmed')
        const lamports = await connection.getBalance(publicKey)
        setSolBalance(lamports / 1e9)
      } catch (err) {
        console.warn('Balance fetch failed', err)
        setSolBalance(null)
      }
    }

    getBalance()
  }, [open, connected, publicKey])

  // Get quote when amount changes
  useEffect(() => {
    const fetchQuote = async () => {
      if (!amount || parseFloat(amount) <= 0 || !connected) {
        setQuote(null)
        return
      }

      setQuoteLoading(true)
      try {
        const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
        const amountNum = parseFloat(amount)
        
        let amountInDecimals: number
        
        if (side === 'buy') {
          // For buying: user enters USDC amount they want to spend
          amountInDecimals = Math.floor(amountNum * Math.pow(10, 6)) // USDC has 6 decimals
        } else {
          // For selling: user enters quantity of stock tokens they want to sell
          amountInDecimals = Math.floor(amountNum * Math.pow(10, 6)) // xStocks typically have 6 decimals
        }

        const quoteData = await getQuote({
          inputMint: side === 'buy' ? USDC_MINT : stock.address,
          outputMint: side === 'buy' ? stock.address : USDC_MINT,
          amount: amountInDecimals,
          slippageBps: 100 // 1% slippage
        })

        setQuote(quoteData)
      } catch (error) {
      } finally {
        setQuoteLoading(false)
      }
    }

    const timeoutId = setTimeout(fetchQuote, 500) // Debounce
    return () => clearTimeout(timeoutId)
  }, [amount, side, stock.address, getQuote, connected])

  const initializeTransactionSteps = () => {
    const steps: TransactionStep[] = [
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

  const handleTrade = async () => {
    if (!amount || parseFloat(amount) <= 0 || !connected) return
    
    setLoading(true)
    setShowTransactionFlow(true)
    setTransactionError(null)
    initializeTransactionSteps()
    
    try {
      const tradeAmount = parseFloat(amount)
      const portfolioId = portfolio?.id
      
      
      // Step 1: Get quote
      updateTransactionStep('quote', 'in_progress', 'Getting best price quote...')
      
      let signature: string | null = null
      
      if (side === 'buy') {
        signature = await buyXStock(stock.symbol, tradeAmount, portfolioId, 'SOL')
      } else {
        signature = await sellXStock(stock.symbol, tradeAmount, portfolioId)
      }
      
      if (signature) {
        updateTransactionStep('quote', 'completed', 'Quote received')
        updateTransactionStep('transaction', 'completed', 'Transaction executed', signature)
        updateTransactionStep('confirmation', 'completed', 'Transaction confirmed')
        updateTransactionStep('database', 'completed', 'Transaction recorded')
        updateTransactionStep('portfolio', 'in_progress', 'Updating portfolio...')
        
        // Sync portfolio
        if (syncPortfolio) {
          await syncPortfolio()
          updateTransactionStep('portfolio', 'completed', 'Portfolio updated')
        }
        
        
        // Reset form
        setTimeout(() => {
          setAmount("")
          setShowTransactionFlow(false)
          setLoading(false)
          onOpenChange(false)
        }, 2000)
        
      } else {
        throw new Error(jupiterError || 'Transaction failed')
      }
      
    } catch (error) {
      setTransactionError(error instanceof Error ? error.message : 'Trade failed')
      
      // Mark current step as failed
      const currentStep = transactionSteps.find(s => s.status === 'in_progress')
      if (currentStep) {
        updateTransactionStep(currentStep.id, 'failed', error instanceof Error ? error.message : 'Failed')
      }
      
      setLoading(false)
    }
  }

  const resetModal = () => {
    setAmount("")
    setShowTransactionFlow(false)
    setTransactionSteps([])
    setLoading(false)
    setTransactionError(null)
    setQuote(null)
    setQuoteLoading(false)
  }

  const handleClose = () => {
    resetModal()
    onOpenChange(false)
  }

  const estimatedTotal = amount ? parseFloat(amount) * stock.price : 0

  const renderLogo = () => {
    if (stock.logoUri) {
      return <img src={stock.logoUri} alt={stock.symbol} className="w-8 h-8 rounded-full" />
    }
    return <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs">{stock.symbol.slice(0, 2)}</div>
  }

  const formatNumber = (value: string, decimals: number = 6) => {
    const num = parseFloat(value) / Math.pow(10, decimals)
    return num.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 6 
    })
  }

  // Show transaction flow
  if (showTransactionFlow) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Transaction Progress</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {transactionSteps.map((step) => (
              <div key={step.id} className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  step.status === 'completed' 
                    ? 'bg-green-100 text-green-600' 
                    : step.status === 'in_progress'
                    ? 'bg-blue-100 text-blue-600'
                    : step.status === 'failed'
                    ? 'bg-red-100 text-red-600'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {step.status === 'completed' ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : step.status === 'in_progress' ? (
                    <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  ) : step.status === 'failed' ? (
                    <AlertCircle className="w-4 h-4" />
                  ) : (
                    <div className="w-2 h-2 bg-gray-400 rounded-full" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className={`text-sm font-medium ${
                    step.status === 'failed' ? 'text-red-600' : 'text-gray-900'
                  }`}>
                    {step.label}
                  </div>
                  {step.message && (
                    <div className={`text-xs ${
                      step.status === 'failed' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {step.message}
                    </div>
                  )}
                  {step.signature && (
                    <div className="mt-2">
                      <a
                        href={`https://solscan.io/tx/${step.signature}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                      >
                        View on Solscan 
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {transactionError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="text-red-800 text-sm">{transactionError}</div>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => onOpenChange(false)}
                variant="outline"
                className="flex-1"
                disabled={loading}
              >
                Close
              </Button>
              {!loading && transactionError && (
                <Button
                  onClick={() => {
                    setShowTransactionFlow(false)
                    setTransactionError(null)
                  }}
                  className="flex-1"
                >
                  Try Again
                </Button>
              )}
              {!loading && !transactionError && transactionSteps.some(s => s.status === 'completed') && (
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
          {/* Wallet Connection Check */}
          {!connected && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Wallet className="w-5 h-5 text-amber-600" />
                <div>
                  <div className="text-sm font-medium text-amber-800">Connect Wallet Required</div>
                  <div className="text-xs text-amber-700">Please connect your Solana wallet to trade</div>
                </div>
              </div>
              <div className="mt-3">
                <WalletMultiButton />
              </div>
            </div>
          )}

          {connected && (
            <>
              {/* SOL Balance Check */}
              {solBalance !== null && (
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">SOL Balance</span>
                      <div className="text-right">
                        <div className={`font-semibold ${solBalance < 0.01 ? 'text-red-600' : 'text-green-600'}`}>
                          {solBalance.toFixed(4)} SOL
                        </div>
                        {solBalance < 0.01 && (
                          <div className="text-xs text-red-600">
                            ⚠️ Low balance - need 0.01+ SOL for fees
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

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
                  <strong>Real Trading:</strong> Uses Jupiter's swap aggregator for on-chain trading on Solana mainnet.
                  <br />
                  <strong>Slippage:</strong> Set to 3% for better execution. Transactions require SOL for fees.
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
                    <Label htmlFor="amount">
                      {side === 'buy' 
                        ? `Amount to spend (SOL)` 
                        : `Quantity to sell (${stock.symbol})`
                      }
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder={side === 'buy' ? "0.1" : "0.30"}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min="0"
                      step={side === 'buy' ? "0.000001" : "0.000001"}
                    />
                    <div className="text-xs text-gray-500">
                      {side === 'buy' 
                        ? `Enter how much SOL you want to spend (e.g., 0.1 SOL)`
                        : `Enter how many ${stock.symbol} tokens you want to sell`
                      }
                    </div>
                  </div>

                  {/* Quote Display */}
                  {amount && parseFloat(amount) > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Quote</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {quoteLoading ? (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                            Getting best price...
                          </div>
                        ) : quote ? (
                          <>
                            <div className="flex justify-between">
                              <span>Input:</span>
                              <span>{formatNumber(quote.inAmount, 6)} SOL</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Output:</span>
                              <span>{formatNumber(quote.outAmount, 6)} {side === 'buy' ? stock.symbol : 'USDC'}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                              <span>Price Impact:</span>
                              <span className={parseFloat(quote.priceImpactPct) > 1 ? 'text-red-600' : 'text-green-600'}>
                                {parseFloat(quote.priceImpactPct).toFixed(4)}%
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="text-sm text-gray-600">Unable to get quote</div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Order Summary */}
                  {amount && !quote && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Estimated Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {side === 'buy' ? (
                          <>
                            <div className="flex justify-between">
                              <span>SOL to spend:</span>
                              <span>{parseFloat(amount).toFixed(4)} SOL</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Stock price:</span>
                              <span>${stock.price.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-semibold border-t pt-2">
                              <span>Est. {stock.symbol} received:</span>
                              <span>{(parseFloat(amount) / stock.price).toFixed(6)}</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex justify-between">
                              <span>{stock.symbol} to sell:</span>
                              <span>{parseFloat(amount).toFixed(6)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Stock price:</span>
                              <span>${stock.price.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-semibold border-t pt-2">
                              <span>Est. USDC received:</span>
                              <span>${(parseFloat(amount) * stock.price).toFixed(2)}</span>
                            </div>
                          </>
                        )}
                        <div className="text-xs text-gray-600 mt-2">
                          * Actual amounts may vary based on Jupiter routing and slippage
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Trade Button */}
                  <Button
                    onClick={handleTrade}
                    disabled={loading || !amount || parseFloat(amount) <= 0 || !connected || jupiterLoading || (solBalance !== null && solBalance < 0.01) || (solBalance!==null && parseFloat(amount) >= solBalance)}
                    className={`w-full ${
                      side === "buy" 
                        ? "bg-green-600 hover:bg-green-700" 
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {loading || jupiterLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </div>
                    ) : solBalance !== null && solBalance < 0.01 ? (
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4" />
                        Need more SOL for fees
                      </div>
                    ) : (
                      <>
                        <Coins className="w-4 h-4 mr-2" />
                        {side === "buy" ? "Buy" : "Sell"} {stock.symbol}
                      </>
                    )}
                  </Button>

                  {jupiterError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="text-red-800 text-sm">{jupiterError}</div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
