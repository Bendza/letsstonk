import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

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
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('wallet_address', walletAddress)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTransactions(data as Transaction[])
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

  // realtime subscription
  useEffect(() => {
    if (!walletAddress) return

    const channel = supabase
      .channel('transactions-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `wallet_address=eq.${walletAddress}`,
        },
        () => fetchTransactions()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [walletAddress, fetchTransactions])

  return { transactions, loading, error, refetch: fetchTransactions }
} 