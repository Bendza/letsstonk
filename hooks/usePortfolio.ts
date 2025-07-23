import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

type Portfolio = Database['public']['Tables']['portfolios']['Row'] & {
  positions: Database['public']['Tables']['positions']['Row'][]
}

interface UsePortfolioReturn {
  portfolio: Portfolio | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  syncPortfolio: () => Promise<void>
}

export function usePortfolio(walletAddress: string | null): UsePortfolioReturn {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPortfolio = async () => {
    if (!walletAddress) {
      setPortfolio(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Fetch portfolio with positions
      const { data, error: fetchError } = await supabase
        .from('portfolios')
        .select(`
          *,
          positions (*)
        `)
        .eq('wallet_address', walletAddress)
        .eq('is_active', true)
        .single()

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          // No portfolio found - this is normal for new users
          setPortfolio(null)
        } else {
          throw fetchError
        }
      } else {
        setPortfolio(data as Portfolio)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch portfolio')
    } finally {
      setLoading(false)
    }
  }

  const syncPortfolio = async () => {
    if (!walletAddress) return

    try {
      setError(null)
      
      // Call portfolio sync Edge Function
      const { data, error } = await supabase.functions.invoke('portfolio-sync', {
        body: { walletAddress }
      })

      if (error) throw error

      // Refetch portfolio data after sync
      await fetchPortfolio()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync portfolio')
    }
  }

  useEffect(() => {
    fetchPortfolio()
  }, [walletAddress])

  // Set up real-time subscription for portfolio updates
  useEffect(() => {
    if (!walletAddress) return

    const channel = supabase
      .channel('portfolio-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'portfolios',
          filter: `wallet_address=eq.${walletAddress}`
        },
        () => {
          fetchPortfolio()
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'positions'
        },
        () => {
          fetchPortfolio()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [walletAddress])

  return {
    portfolio,
    loading,
    error,
    refetch: fetchPortfolio,
    syncPortfolio
  }
} 