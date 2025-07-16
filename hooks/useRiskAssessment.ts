import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export interface RiskMetrics {
  portfolioVolatility: number
  sharpeRatio: number
  diversificationScore: number
  riskScore: number // 1-10 scale
  recommendation: string
}

export interface StockRiskData {
  symbol: string
  volatility30d: number
  beta: number
  riskLevel: 'low' | 'medium' | 'high'
  recommendationScore: number
}

export interface RiskRecommendations {
  overall: string
  actions: string[]
  rebalanceNeeded: boolean
  riskAdjustments: string[]
}

export interface RiskAssessment {
  portfolioId: string
  riskMetrics: RiskMetrics
  stockRiskData: StockRiskData[]
  recommendations: RiskRecommendations
  userRiskTolerance: number
  timestamp: string
}

export function useRiskAssessment(walletAddress: string | null) {
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRiskAssessment = useCallback(async () => {
    if (!walletAddress) return

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.functions.invoke('risk-analysis', {
        body: { walletAddress }
      })

      if (error) {
        throw error
      }

      if (data?.success) {
        setRiskAssessment(data)
      } else {
        throw new Error(data?.error || 'Failed to fetch risk assessment')
      }
    } catch (err) {
      console.error('Risk assessment error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch risk assessment')
    } finally {
      setLoading(false)
    }
  }, [walletAddress])

  const generateRiskAssessment = useCallback(async (riskTolerance: number) => {
    if (!walletAddress) return

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.functions.invoke('risk-analysis', {
        body: { 
          walletAddress,
          riskTolerance 
        }
      })

      if (error) {
        throw error
      }

      if (data?.success) {
        setRiskAssessment(data)
        return data
      } else {
        throw new Error(data?.error || 'Failed to generate risk assessment')
      }
    } catch (err) {
      console.error('Risk assessment generation error:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate risk assessment')
      throw err
    } finally {
      setLoading(false)
    }
  }, [walletAddress])

  useEffect(() => {
    if (walletAddress) {
      fetchRiskAssessment()
    }
  }, [walletAddress, fetchRiskAssessment])

  return {
    riskAssessment,
    loading,
    error,
    fetchRiskAssessment,
    generateRiskAssessment
  }
} 