"use client"

import { useState } from 'react'
import { Connection } from '@solana/web3.js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const TEST_RPCS = [
  'https://api.mainnet-beta.solana.com',
  'https://rpc.ankr.com/solana',
  'https://solana-api.projectserum.com',
]

interface RpcTestResult {
  url: string
  status: 'testing' | 'success' | 'error'
  error?: string
  latency?: number
}

export function RpcDebugger() {
  const [results, setResults] = useState<RpcTestResult[]>([])
  const [testing, setTesting] = useState(false)

  const testRpc = async (url: string): Promise<RpcTestResult> => {
    const startTime = Date.now()
    try {
      const connection = new Connection(url, 'confirmed')
      
      // Test basic operations needed for trading
      const blockhash = await connection.getLatestBlockhash()
      const slot = await connection.getSlot()
      
      const latency = Date.now() - startTime
      
      if (blockhash && slot > 0) {
        return { url, status: 'success', latency }
      } else {
        throw new Error('Invalid response from RPC')
      }
    } catch (error) {
      const latency = Date.now() - startTime
      return { 
        url, 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error',
        latency 
      }
    }
  }

  const testAllRpcs = async () => {
    setTesting(true)
    setResults([])
    
    // Initialize results with testing status
    const initialResults = TEST_RPCS.map(url => ({ url, status: 'testing' as const }))
    setResults(initialResults)
    
    // Test each RPC
    for (let i = 0; i < TEST_RPCS.length; i++) {
      const result = await testRpc(TEST_RPCS[i])
      setResults(prev => prev.map((r, idx) => idx === i ? result : r))
    }
    
    setTesting(false)
  }

  const testCustomRpc = async () => {
    const customUrl = process.env.NEXT_PUBLIC_TRADING_RPC_URL
    if (!customUrl) {
      alert('No NEXT_PUBLIC_TRADING_RPC_URL set in environment')
      return
    }
    
    setTesting(true)
    const result = await testRpc(customUrl)
    setResults([result])
    setTesting(false)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>🔧 RPC Endpoint Debugger</CardTitle>
        <p className="text-sm text-gray-600">
          Test which RPC endpoints work for trading operations
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={testAllRpcs} disabled={testing}>
            {testing ? 'Testing...' : 'Test Free RPCs'}
          </Button>
          <Button onClick={testCustomRpc} disabled={testing} variant="outline">
            Test Custom RPC
          </Button>
        </div>
        
        {process.env.NEXT_PUBLIC_TRADING_RPC_URL && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium">Custom RPC Set:</p>
            <code className="text-xs">{process.env.NEXT_PUBLIC_TRADING_RPC_URL}</code>
          </div>
        )}
        
        <div className="space-y-2">
          {results.map((result, idx) => (
            <div 
              key={idx} 
              className={`p-3 rounded-lg border ${
                result.status === 'success' ? 'bg-green-50 border-green-200' :
                result.status === 'error' ? 'bg-red-50 border-red-200' :
                'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <code className="text-xs font-mono">{result.url}</code>
                  {result.status === 'success' && (
                    <p className="text-green-700 text-sm mt-1">
                      ✅ Working ({result.latency}ms)
                    </p>
                  )}
                  {result.status === 'error' && (
                    <p className="text-red-700 text-sm mt-1">
                      ❌ Failed: {result.error}
                    </p>
                  )}
                  {result.status === 'testing' && (
                    <p className="text-gray-700 text-sm mt-1">
                      🔄 Testing...
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {results.length > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Next Steps:</strong> If an RPC shows ✅, copy its URL and set it as 
              <code className="mx-1">NEXT_PUBLIC_TRADING_RPC_URL</code> in your .env.local file, then restart the app.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 