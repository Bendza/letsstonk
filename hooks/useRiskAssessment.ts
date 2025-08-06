import { useState, useEffect, useCallback } from 'react'
// Removed supabase dependency - using mock data

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
      // Generate mock risk assessment
      const mockAssessment: RiskAssessment = {
        portfolioId: `portfolio-${walletAddress.slice(0, 8)}`,
        riskMetrics: {
          portfolioVolatility: Math.random() * 0.3 + 0.1, // 10-40%
          sharpeRatio: Math.random() * 1.5 + 0.5, // 0.5-2.0
          diversificationScore: Math.random() * 40 + 60, // 60-100
          riskScore: Math.floor(Math.random() * 5) + 3, // 3-7
          recommendation: 'Portfolio shows moderate risk with good diversification'
        },
        stockRiskData: [],
        recommendations: {
          overall: 'Your portfolio is well-balanced for your risk tolerance',
          actions: ['Consider rebalancing quarterly', 'Monitor high-volatility positions'],
          rebalanceNeeded: Math.random() > 0.7,
          riskAdjustments: ['Reduce exposure to high-beta stocks']
        },
        userRiskTolerance: 5,
        timestamp: new Date().toISOString()
      }

      setRiskAssessment(mockAssessment)
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
      // Generate mock risk assessment based on tolerance
      const mockAssessment: RiskAssessment = {
        portfolioId: `portfolio-${walletAddress.slice(0, 8)}`,
        riskMetrics: {
          portfolioVolatility: (riskTolerance / 10) * 0.4 + 0.1, // Scale with tolerance
          sharpeRatio: Math.random() * 1.5 + 0.5,
          diversificationScore: Math.random() * 40 + 60,
          riskScore: riskTolerance,
          recommendation: `Portfolio aligned with ${riskTolerance}/10 risk tolerance`
        },
        stockRiskData: [],
        recommendations: {
          overall: `Your portfolio matches your ${riskTolerance}/10 risk tolerance`,
          actions: ['Maintain current allocation', 'Review quarterly'],
          rebalanceNeeded: false,
          riskAdjustments: []
        },
        userRiskTolerance: riskTolerance,
        timestamp: new Date().toISOString()
      }

      setRiskAssessment(mockAssessment)
      return mockAssessment
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