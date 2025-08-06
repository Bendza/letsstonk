"use client"

import { useState } from 'react'
import { useWallets } from '@privy-io/react-auth'
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react'
import { getTradingRpcUrl } from '@/lib/rpc-config'

interface DiagnosticResult {
  test: string
  status: 'pass' | 'fail' | 'warning' | 'loading'
  message: string
  details?: string
}

export function TransactionDiagnostics() {
  const { wallets } = useWallets()
  const publicKey = wallets[0]?.address
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([])
  const [running, setRunning] = useState(false)

  const runDiagnostics = async () => {
    if (!publicKey) return

    setRunning(true)
    const results: DiagnosticResult[] = []
    
    // Initialize all tests as loading
    const tests = [
      'RPC Connection',
      'SOL Balance',
      'USDC Token Account', 
      'Network Congestion',
      'Jupiter API Access'
    ]
    
    setDiagnostics(tests.map(test => ({
      test,
      status: 'loading',
      message: 'Testing...'
    })))

    const connection = new Connection(getTradingRpcUrl(), 'confirmed')

    // Test 1: RPC Connection
    try {
      const slot = await connection.getSlot()
      results.push({
        test: 'RPC Connection',
        status: 'pass',
        message: `Connected to slot ${slot}`,
        details: `Using RPC: ${getTradingRpcUrl()}`
      })
    } catch (error) {
      results.push({
        test: 'RPC Connection',
        status: 'fail',
        message: 'Failed to connect to RPC',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
    setDiagnostics([...results])

    // Test 2: SOL Balance
    try {
      const balance = await connection.getBalance(publicKey)
      const solBalance = balance / LAMPORTS_PER_SOL
      
      if (solBalance >= 0.01) {
        results.push({
          test: 'SOL Balance',
          status: 'pass',
          message: `${solBalance.toFixed(4)} SOL available`,
          details: 'Sufficient balance for transaction fees'
        })
      } else if (solBalance > 0) {
        results.push({
          test: 'SOL Balance',
          status: 'warning',
          message: `${solBalance.toFixed(4)} SOL (low)`,
          details: 'May not be enough for transaction fees. Recommended: 0.01+ SOL'
        })
      } else {
        results.push({
          test: 'SOL Balance',
          status: 'fail',
          message: 'No SOL balance',
          details: 'Need SOL to pay transaction fees'
        })
      }
    } catch (error) {
      results.push({
        test: 'SOL Balance',
        status: 'fail',
        message: 'Failed to check balance',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
    setDiagnostics([...results])

    // Test 3: USDC Token Account
    try {
      const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
      const tokenAccounts = await connection.getTokenAccountsByOwner(publicKey, {
        mint: new PublicKey(USDC_MINT)
      })
      
      if (tokenAccounts.value.length > 0) {
        const accountInfo = await connection.getTokenAccountBalance(tokenAccounts.value[0].pubkey)
        const usdcBalance = parseFloat(accountInfo.value.uiAmountString || '0')
        
        results.push({
          test: 'USDC Token Account',
          status: 'pass',
          message: `${usdcBalance.toFixed(2)} USDC available`,
          details: 'USDC account exists and has balance'
        })
      } else {
        results.push({
          test: 'USDC Token Account',
          status: 'warning',
          message: 'No USDC account found',
          details: 'USDC token account will be created automatically during first transaction'
        })
      }
    } catch (error) {
      results.push({
        test: 'USDC Token Account',
        status: 'warning',
        message: 'Could not check USDC account',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
    setDiagnostics([...results])

    // Test 4: Network Congestion
    try {
      const recentPerformance = await connection.getRecentPerformanceSamples(1)
      if (recentPerformance.length > 0) {
        const sample = recentPerformance[0]
        const tps = sample.numTransactions / sample.samplePeriodSecs
        
        if (tps > 2000) {
          results.push({
            test: 'Network Congestion',
            status: 'pass',
            message: `${Math.round(tps)} TPS`,
            details: 'Network is performing well'
          })
        } else if (tps > 1000) {
          results.push({
            test: 'Network Congestion',
            status: 'warning',
            message: `${Math.round(tps)} TPS`,
            details: 'Network is moderately congested'
          })
        } else {
          results.push({
            test: 'Network Congestion',
            status: 'fail',
            message: `${Math.round(tps)} TPS`,
            details: 'Network is highly congested - transactions may fail'
          })
        }
      }
    } catch (error) {
      results.push({
        test: 'Network Congestion',
        status: 'warning',
        message: 'Could not check network status',
        details: 'Unable to determine network performance'
      })
    }
    setDiagnostics([...results])

    // Test 5: Jupiter API Access
    try {
      const response = await fetch('https://lite-api.jup.ag/swap/v1/quote?inputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&outputMint=So11111111111111111111111111111111111111112&amount=1000000')
      
      if (response.ok) {
        results.push({
          test: 'Jupiter API Access',
          status: 'pass',
          message: 'Jupiter API accessible',
          details: 'Can fetch quotes from Jupiter'
        })
      } else {
        results.push({
          test: 'Jupiter API Access',
          status: 'fail',
          message: `Jupiter API error: ${response.status}`,
          details: 'Cannot access Jupiter swap quotes'
        })
      }
    } catch (error) {
      results.push({
        test: 'Jupiter API Access',
        status: 'fail',
        message: 'Failed to reach Jupiter API',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
    setDiagnostics([...results])

    setRunning(false)
  }

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-600" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case 'loading':
        return <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
    }
  }

  const getStatusBadge = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'pass':
        return <Badge className="bg-green-100 text-green-800">Pass</Badge>
      case 'fail':
        return <Badge className="bg-red-100 text-red-800">Fail</Badge>
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
      case 'loading':
        return <Badge className="bg-gray-100 text-gray-600">Testing</Badge>
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>🔍 Transaction Diagnostics</CardTitle>
        <p className="text-sm text-gray-600">
          Check your setup before trading to avoid transaction failures
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runDiagnostics} 
          disabled={!publicKey || running}
          className="w-full"
        >
          {running ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Running Diagnostics...
            </div>
          ) : (
            'Run Diagnostics'
          )}
        </Button>

        {!publicKey && (
          <div className="text-center text-gray-500 text-sm">
            Connect your wallet to run diagnostics
          </div>
        )}

        {diagnostics.length > 0 && (
          <div className="space-y-3">
            {diagnostics.map((result, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(result.status)}
                    <span className="font-medium">{result.test}</span>
                  </div>
                  {getStatusBadge(result.status)}
                </div>
                <div className="text-sm text-gray-700 mb-1">
                  {result.message}
                </div>
                {result.details && (
                  <div className="text-xs text-gray-500">
                    {result.details}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {diagnostics.length > 0 && !running && (
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-700">
              <strong>Common Issues:</strong>
              <ul className="mt-2 space-y-1 text-xs">
                <li>• <strong>Insufficient SOL:</strong> Get SOL from an exchange or bridge</li>
                <li>• <strong>High Slippage:</strong> Try trading smaller amounts</li>
                <li>• <strong>Network Congestion:</strong> Wait and retry during lower traffic</li>
                <li>• <strong>RPC Issues:</strong> Switch to a different RPC endpoint</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 