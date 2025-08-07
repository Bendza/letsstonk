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
import { usePrivyAuth } from "@/hooks/usePrivyAuth"
import { usePortfolio } from "@/hooks/usePortfolio"
import { PrivyWalletButton } from "@/components/PrivyWalletButton"
// Import Privy wallet hooks for both Solana and Ethereum
import { useSolanaWallets } from '@privy-io/react-auth/solana'
import { useWallets } from '@privy-io/react-auth'
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
  
  const { user, isAuthenticated } = usePrivyAuth()
  
  // Check if we're in demo mode
  const isDemoMode = !process.env.NEXT_PUBLIC_PRIVY_APP_ID || process.env.NEXT_PUBLIC_PRIVY_APP_ID === 'your-privy-app-id-here'
  
  // Always call the hooks - this is required by React's Rules of Hooks
  const { wallets: realWallets } = useSolanaWallets()
  const { wallets: allWallets } = useWallets()
  console.log('[PRIVY] useSolanaWallets returned:', realWallets);
  console.log('[PRIVY] useWallets returned:', allWallets);
  
  // Create demo wallet if in demo mode
  const demoWallet = isDemoMode && isAuthenticated ? {
    address: 'DemoWallet1234567890123456789012345678',
    chainType: 'solana',
    sendTransaction: async (transaction: any, connection: any, options: any) => {
      console.log('[DEMO] Mock transaction sent:', { transaction, options })
      // Return a mock signature
      return `demo_signature_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
  } : null
  
  const solanaWallets = isDemoMode ? (demoWallet ? [demoWallet] : []) : realWallets
  const allConnectedWallets = isDemoMode ? (demoWallet ? [demoWallet] : []) : allWallets
  
  // Enhanced wallet detection with better debugging
  const solanaWallet = solanaWallets?.[0]
  const ethereumWallet = allConnectedWallets?.find(w => {
    // Check if it's an Ethereum wallet by looking at the wallet type or chain
    const wallet = w as any
    console.log('[PRIVY] Checking wallet for ETH:', wallet)
    return wallet.walletClientType === 'metamask' || 
           wallet.walletClientType === 'phantom' || 
           wallet.chainType === 'ethereum' ||
           wallet.chain === 'ethereum'
  })
  
  // Determine which wallet to use for trading
  const activeWallet = solanaWallet || ethereumWallet
  const walletAddress = activeWallet?.address || null
  
  // Determine chain type more reliably
  let walletChainType: string | null = null
  if (activeWallet) {
    const wallet = activeWallet as any
    if (solanaWallet) {
      walletChainType = 'solana'
    } else if (ethereumWallet) {
      walletChainType = 'ethereum'
    } else {
      // Fallback: if we have a wallet but can't determine type, assume Solana
      // since Jupiter quotes are working (SOL -> xStock swaps)
      walletChainType = 'solana'
    }
    console.log('[PRIVY] Active wallet details:', {
      address: walletAddress,
      chainType: walletChainType,
      walletClientType: wallet.walletClientType,
      chain: wallet.chain
    })
  }
  
  const sendTransaction = activeWallet?.sendTransaction || null
  
  const { 
    getQuote, 
    buyXStock, 
    sellXStock, 
    checkSolBalance,
    loading: jupiterLoading, 
    error: jupiterError,
    connected 
  } = useJupiterTrading(walletAddress, sendTransaction, walletChainType)
  
  const { portfolio, syncPortfolio } = usePortfolio(walletAddress)

  // Fetch SOL balance once when modal opens or after a trade completes
  useEffect(() => {
    if (!open) return

    const getBalance = async () => {
      if (!connected || !walletAddress || walletChainType !== 'solana') {
        setSolBalance(null)
        return
      }
      
      // Demo mode: set mock balance
      if (isDemoMode) {
        setSolBalance(2.5) // Demo wallet has 2.5 SOL
        return
      }
      
      try {
        const { PublicKey } = await import('@solana/web3.js')
        const connection = new Connection(getTradingRpcUrl(), 'confirmed')
        const publicKey = new PublicKey(walletAddress)
        const lamports = await connection.getBalance(publicKey)
        setSolBalance(lamports / 1e9)
      } catch (err) {
        console.warn('Balance fetch failed', err)
        setSolBalance(null)
      }
    }

    getBalance()
  }, [open, connected, walletAddress, walletChainType, isDemoMode])

  // Get quote when amount changes
  useEffect(() => {
    const fetchQuote = async () => {
      if (!amount || parseFloat(amount) <= 0 || !isAuthenticated) {
        console.log('[QUOTE] Skipping quote fetch:', { amount, isAuthenticated })
        setQuote(null)
        return
      }

      console.log('[QUOTE] Starting quote fetch for:', { amount, side, stock: stock.symbol, walletChainType })
      setQuoteLoading(true)
      try {
        const SOL_MINT = 'So11111111111111111111111111111111111111112' // Native SOL
        const ETH_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' // USDC (proxy for ETH)
        const amountNum = parseFloat(amount)
        
        // Determine input/output mints based on wallet chain type
        let inputMint: string
        let outputMint: string
        let amountInDecimals: number
        
        // Get correct decimals for the token
        const tokenDecimals = getTokenDecimals(stock.address)
        
        if (walletChainType === 'ethereum') {
          // ETH wallet: use USDC for buying, token for selling
          if (side === 'buy') {
            inputMint = ETH_MINT // USDC
            outputMint = stock.address // Token
            amountInDecimals = Math.floor(amountNum * Math.pow(10, 6)) // USDC has 6 decimals
          } else {
            inputMint = stock.address // Token
            outputMint = ETH_MINT // USDC
            amountInDecimals = Math.floor(amountNum * Math.pow(10, tokenDecimals)) // Use correct token decimals
          }
        } else {
          // Default to SOL wallet: use SOL for buying, token for selling
          // This handles both explicit 'solana' and null/undefined chain types
          if (side === 'buy') {
            inputMint = SOL_MINT // SOL
            outputMint = stock.address // Token
            amountInDecimals = Math.floor(amountNum * Math.pow(10, 9)) // SOL has 9 decimals
          } else {
            inputMint = stock.address // Token
            outputMint = SOL_MINT // SOL
            amountInDecimals = Math.floor(amountNum * Math.pow(10, tokenDecimals)) // Use correct token decimals
          }
        }

        console.log('[QUOTE] Quote request:', {
          inputMint,
          outputMint,
          amount: amountInDecimals,
          stockAddress: stock.address,
          side,
          walletChainType,
          originalAmount: amountNum
        })

        const quoteData = await getQuote({
          inputMint,
          outputMint,
          amount: amountInDecimals,
          slippageBps: 300 // 3% slippage for better success
        })

        console.log('[QUOTE] Quote response:', quoteData)
        setQuote(quoteData)
      } catch (error) {
        console.error('[QUOTE] Quote fetch error:', error)
        setQuote(null)
      } finally {
        setQuoteLoading(false)
      }
    }

    const timeoutId = setTimeout(fetchQuote, 500) // Debounce
    return () => clearTimeout(timeoutId)
  }, [amount, side, stock.address, getQuote, isAuthenticated])

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
    if (!amount || parseFloat(amount) <= 0 || !connected || !walletChainType) {
      console.log('[TRADE] Trade blocked:', { amount, connected, walletAddress, walletChainType, sendTransaction: !!sendTransaction })
      return
    }
    
    console.log('[TRADE] Starting trade:', {
      side,
      amount,
      stock: stock.symbol,
      walletAddress,
      connected,
      sendTransaction: !!sendTransaction
    })
    
    setLoading(true)
    setShowTransactionFlow(true)
    setTransactionError(null)
    initializeTransactionSteps()
    
    try {
      const tradeAmount = parseFloat(amount)
      const portfolioId = portfolio?.id
      
      console.log('[TRADE] Trade parameters:', {
        tradeAmount,
        portfolioId,
        side,
        stockSymbol: stock.symbol
      })
      
      // Step 1: Get quote
      updateTransactionStep('quote', 'in_progress', 'Getting best price quote...')
      
      let result: any = null
      
      if (side === 'buy') {
        console.log('[TRADE] Calling buyXStock...')
        const payWith = walletChainType === 'ethereum' ? 'USDC' : 'SOL'
        result = await buyXStock(stock.symbol, tradeAmount, portfolioId, payWith)
      } else {
        console.log('[TRADE] Calling sellXStock...')
        result = await sellXStock(stock.symbol, tradeAmount, portfolioId)
      }
      
      console.log('[TRADE] Trade result:', result)
      
      if (result?.signature) {
        const signature = result.signature
        console.log('[TRADE] Trade successful:', signature)
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
        console.error('[TRADE] No signature received:', result)
        throw new Error(jupiterError || 'Transaction failed - no signature returned')
      }
      
    } catch (error) {
      console.error('[TRADE] Trade error:', error)
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
      maximumFractionDigits: 8 
    })
  }
  
  // Determine correct decimals based on token type
  const getTokenDecimals = (tokenAddress: string) => {
    // Check if it's a PreStock (addresses start with 'Pre')
    if (tokenAddress.startsWith('Pre')) {
      return 9  // PreStocks need 9 decimals for proper calculation
    }
    // xStocks use 8 decimals
    return 8
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
                    step.status === 'failed' ? 'text-destructive' : 'text-foreground'
                  }`}>
                    {step.label}
                  </div>
                  {step.message && (
                    <div className={`text-xs ${
                      step.status === 'failed' ? 'text-destructive' : 'text-muted-foreground'
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
                        className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80"
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
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <div className="text-destructive text-sm">{transactionError}</div>
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
      <DialogContent className="sm:max-w-md bg-background border border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {renderLogo()}
              <div>
                <div className="font-semibold text-foreground">{stock.symbol}</div>
                <div className="text-sm text-muted-foreground">{stock.name}</div>
              </div>
            </div>
            <a 
              href="https://xstocks.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              Learn more about xStocks
              <ExternalLink className="h-3 w-3" />
            </a>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Wallet Connection Check */}
          {!isAuthenticated && (
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Wallet className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm font-medium text-foreground">Connect Wallet Required</div>
                  <div className="text-xs text-muted-foreground">Please connect your Solana wallet to trade</div>
                </div>
              </div>
              <div className="mt-3">
                <PrivyWalletButton />
              </div>
            </div>
          )}


          {isAuthenticated && (
            <>
              {/* SOL Balance Check - Only for Solana wallets */}
              {solBalance !== null && walletChainType === 'solana' && (
                <Card className="bg-card border-border">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">SOL Balance</span>
                      <div className="text-right">
                        <div className={`font-semibold ${solBalance < 0.01 ? 'text-destructive' : 'text-primary'}`}>
                          {solBalance.toFixed(4)} SOL
                        </div>
                        {solBalance < 0.01 && (
                          <div className="text-xs text-destructive">
                            ⚠️ Low balance - need 0.01+ SOL for fees
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Current Price */}
              <Card className="bg-card border-border">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Current Price</span>
                    <div className="text-right">
                      <div className="font-semibold text-foreground">${stock.price.toFixed(2)}</div>
                      <div className={`text-xs flex items-center gap-1 ${
                        stock.changePercent >= 0 ? 'text-primary' : 'text-destructive'
                      }`}>
                        {stock.changePercent >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {stock.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Info Banner */}
              <div className="bg-card border border-border rounded-lg p-3">
                <div className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Real Trading:</strong> Uses Jupiter's swap aggregator for on-chain trading on Solana mainnet.
                  <br />
                  <strong className="text-foreground">Wallet:</strong> {walletChainType === 'ethereum' ? 'Ethereum (USDC)' : 'Solana (SOL)'}
                  <br />
                  <strong className="text-foreground">Slippage:</strong> Set to 3% for better execution. {walletChainType === 'solana' ? 'Transactions require SOL for fees.' : 'USDC transactions supported.'}
                </div>
              </div>

              {/* Buy/Sell Tabs */}
              <Tabs value={side} onValueChange={(value) => setSide(value as "buy" | "sell")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="buy" className="text-green-600 data-[state=active]:bg-green-100 data-[state=active]:text-green-700">
                    Buy
                  </TabsTrigger>
                  <TabsTrigger value="sell" className="text-red-600 data-[state=active]:bg-red-100 data-[state=active]:text-red-700">
                    Sell
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value={side} className="space-y-4">
                  {/* Amount Input */}
                  <div className="space-y-2">
                    <Label htmlFor="amount">
                      {side === 'buy' 
                        ? `Amount to spend (${walletChainType === 'ethereum' ? 'USDC' : 'SOL'})` 
                        : `Quantity to sell (${stock.symbol})`
                      }
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder={side === 'buy' ? (walletChainType === 'ethereum' ? "100" : "0.1") : "0.30"}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min="0"
                      step={side === 'buy' ? "0.000001" : "0.000001"}
                    />
                    <div className="text-xs text-muted-foreground">
                      {side === 'buy' 
                        ? `Enter how much SOL you want to spend`
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
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="w-4 h-4 border-2 border-muted border-t-primary rounded-full animate-spin" />
                            Getting best price...
                          </div>
                        ) : quote ? (
                          <>
                            <div className="flex justify-between">
                              <span>You pay:</span>
                              <span>{parseFloat(amount).toFixed(4)} SOL</span>
                            </div>
                            <div className="flex justify-between">
                              <span>You receive:</span>
                              <span>{formatNumber(quote.outAmount, stock.address.startsWith('Pre') ? 9 : 8)} {stock.symbol}</span>
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>Price Impact:</span>
                              <span className={parseFloat(quote.priceImpactPct) > 1 ? 'text-destructive' : 'text-primary'}>
                                {parseFloat(quote.priceImpactPct).toFixed(4)}%
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="text-sm text-muted-foreground">Unable to get quote</div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Fallback when Jupiter quote fails */}
                  {amount && !quote && !quoteLoading && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Quote Unavailable</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="text-sm text-muted-foreground text-center py-4">
                          <div className="mb-2">⚠️ Unable to get real-time quote</div>
                          <div className="text-xs">
                            Jupiter swap quote failed. Please check your connection or try again.
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Trade Button */}
                  {console.log('[DEBUG] Button disabled conditions:', {
                    loading,
                    amount,
                    amountValid: amount && parseFloat(amount) > 0,
                    connected,
                    jupiterLoading,
                    solBalance,
                    lowBalance: solBalance !== null && solBalance < 0.01,
                    insufficientFunds: side === 'buy' && solBalance !== null && parseFloat(amount || '0') >= (solBalance - 0.01)
                  })}
                  <Button
                    onClick={handleTrade}
                    disabled={loading || !amount || parseFloat(amount) <= 0 || !connected || jupiterLoading || (solBalance !== null && solBalance < 0.01) || (side === 'buy' && solBalance !== null && parseFloat(amount) >= (solBalance - 0.01))}
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
                        {side === "buy" ? "Buy with SOL" : "Sell for SOL"} 
                      </>
                    )}
                  </Button>

                  {jupiterError && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                      <div className="text-destructive text-sm">{jupiterError}</div>
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
