import { useEffect, useState, useCallback } from 'react'
// Removed supabase dependency - using mock data

export interface Transaction {
  id: string
  created_at: string
  portfolio_id: string | null
  wallet_address?: string | null
  transaction_type: 'buy' | 'sell' | 'rebalance'
  input_token: string
  output_token: string
  input_amount: number
  output_amount: number
  price_impact?: number | null
  slippage?: number | null
  fees?: number | null
  status: 'pending' | 'confirmed' | 'failed'
  block_time?: string | null
  transaction_signature: string
}

export function useTransactions(walletAddress: string | null) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = useCallback(async () => {
    if (!walletAddress) return
    setLoading(true)
    setError(null)

    try {
      // Generate mock transactions
      const mockTransactions: Transaction[] = [
        {
          id: `tx-1-${walletAddress.slice(0, 8)}`,
          created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          portfolio_id: `portfolio-${walletAddress.slice(0, 8)}`,
          wallet_address: walletAddress,
          transaction_type: 'buy',
          input_token: 'So11111111111111111111111111111111111111112', // SOL
          output_token: 'XsbEhLAtcf6HdfpFZ5xEMdqW8nfAvcsP5bdudRLJzJp', // AAPLx
          input_amount: 0.5,
          output_amount: 1.2,
          price_impact: 0.15,
          slippage: 3.0,
          fees: 0.005,
          status: 'confirmed',
          block_time: new Date(Date.now() - 86400000).toISOString(),
          transaction_signature: `mock_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        },
        {
          id: `tx-2-${walletAddress.slice(0, 8)}`,
          created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          portfolio_id: `portfolio-${walletAddress.slice(0, 8)}`,
          wallet_address: walletAddress,
          transaction_type: 'buy',
          input_token: 'So11111111111111111111111111111111111111112', // SOL
          output_token: 'XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB', // TSLAx
          input_amount: 1.0,
          output_amount: 0.8,
          price_impact: 0.22,
          slippage: 3.0,
          fees: 0.01,
          status: 'confirmed',
          block_time: new Date(Date.now() - 172800000).toISOString(),
          transaction_signature: `mock_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }
      ]

      setTransactions(mockTransactions)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions')
    } finally {
      setLoading(false)
    }
  }, [walletAddress])

  // initial fetch
  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return { transactions, loading, error, refetch: fetchTransactions }
} 