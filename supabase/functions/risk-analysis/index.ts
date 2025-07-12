import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

interface RiskAnalysisRequest {
  portfolioId?: string
  walletAddress?: string
  riskTolerance?: number
}

interface RiskMetrics {
  portfolioVolatility: number
  sharpeRatio: number
  diversificationScore: number
  riskScore: number // 1-10 scale
  recommendation: string
}

interface StockRiskData {
  symbol: string
  volatility30d: number
  beta: number
  riskLevel: 'low' | 'medium' | 'high'
  recommendationScore: number
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      },
    })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    const supabase = createClient(supabaseUrl, supabaseKey)

    let body: RiskAnalysisRequest = {}
    
    if (req.method === 'POST') {
      body = await req.json()
    } else if (req.method === 'GET') {
      const url = new URL(req.url)
      body = {
        portfolioId: url.searchParams.get('portfolioId') || undefined,
        walletAddress: url.searchParams.get('walletAddress') || undefined,
        riskTolerance: url.searchParams.get('riskTolerance') ? 
          parseInt(url.searchParams.get('riskTolerance')!) : undefined
      }
    }

    // Get portfolio data
    let portfolio
    if (body.portfolioId) {
      const { data } = await supabase
        .from('portfolios')
        .select(`
          *,
          positions (
            symbol,
            token_address,
            amount,
            current_percentage,
            value,
            pnl_percentage
          )
        `)
        .eq('id', body.portfolioId)
        .single()
      
      portfolio = data
    } else if (body.walletAddress) {
      const { data } = await supabase
        .from('portfolios')
        .select(`
          *,
          positions (
            symbol,
            token_address,
            amount,
            current_percentage,
            value,
            pnl_percentage
          )
        `)
        .eq('wallet_address', body.walletAddress)
        .eq('is_active', true)
        .single()
      
      portfolio = data
    }

    if (!portfolio) {
      return new Response(
        JSON.stringify({ 
          error: 'Portfolio not found' 
        }),
        { 
          status: 404,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
    }

    // Calculate risk metrics
    const riskMetrics = await calculatePortfolioRisk(portfolio)
    
    // Get stock-specific risk data
    const stockRiskData = await calculateStockRiskData(portfolio.positions)
    
    // Generate recommendations based on risk tolerance
    const userRiskTolerance = body.riskTolerance || portfolio.risk_level
    const recommendations = generateRecommendations(riskMetrics, stockRiskData, userRiskTolerance)

    return new Response(
      JSON.stringify({
        success: true,
        portfolioId: portfolio.id,
        riskMetrics: riskMetrics,
        stockRiskData: stockRiskData,
        recommendations: recommendations,
        userRiskTolerance: userRiskTolerance,
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )

  } catch (error) {
    console.error('Risk analysis error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: error.message
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }
})

async function calculatePortfolioRisk(portfolio: any): Promise<RiskMetrics> {
  const positions = portfolio.positions || []
  
  if (positions.length === 0) {
    return {
      portfolioVolatility: 0,
      sharpeRatio: 0,
      diversificationScore: 0,
      riskScore: 5,
      recommendation: 'No positions to analyze'
    }
  }

  // Calculate portfolio volatility (simplified)
  const pnlVariance = positions.reduce((acc: number, pos: any) => {
    const pnl = pos.pnl_percentage || 0
    return acc + Math.pow(pnl, 2)
  }, 0) / positions.length

  const portfolioVolatility = Math.sqrt(pnlVariance)

  // Calculate diversification score
  const diversificationScore = calculateDiversificationScore(positions)

  // Simplified Sharpe ratio calculation
  const avgReturn = positions.reduce((acc: number, pos: any) => 
    acc + (pos.pnl_percentage || 0), 0) / positions.length
  
  const sharpeRatio = portfolioVolatility > 0 ? avgReturn / portfolioVolatility : 0

  // Calculate overall risk score (1-10, where 10 is highest risk)
  let riskScore = 5 // Default medium risk
  
  if (portfolioVolatility > 30) riskScore = Math.min(10, riskScore + 3)
  else if (portfolioVolatility > 20) riskScore = Math.min(10, riskScore + 2)
  else if (portfolioVolatility > 10) riskScore = Math.min(10, riskScore + 1)
  else if (portfolioVolatility < 5) riskScore = Math.max(1, riskScore - 2)
  else if (portfolioVolatility < 10) riskScore = Math.max(1, riskScore - 1)

  if (diversificationScore < 0.3) riskScore = Math.min(10, riskScore + 2)
  else if (diversificationScore > 0.7) riskScore = Math.max(1, riskScore - 1)

  // Generate recommendation
  let recommendation = 'Balanced portfolio with medium risk'
  if (riskScore <= 3) recommendation = 'Low-risk, conservative portfolio'
  else if (riskScore <= 6) recommendation = 'Moderate risk, balanced approach'
  else if (riskScore <= 8) recommendation = 'High-risk, growth-oriented portfolio'
  else recommendation = 'Very high-risk, speculative portfolio'

  return {
    portfolioVolatility: Math.round(portfolioVolatility * 100) / 100,
    sharpeRatio: Math.round(sharpeRatio * 100) / 100,
    diversificationScore: Math.round(diversificationScore * 100) / 100,
    riskScore: riskScore,
    recommendation: recommendation
  }
}

function calculateDiversificationScore(positions: any[]): number {
  if (positions.length <= 1) return 0

  // Calculate concentration risk (Herfindahl index)
  const totalValue = positions.reduce((acc, pos) => acc + (pos.value || 0), 0)
  
  if (totalValue === 0) return 0

  const concentrationIndex = positions.reduce((acc, pos) => {
    const weight = (pos.value || 0) / totalValue
    return acc + Math.pow(weight, 2)
  }, 0)

  // Convert to diversification score (1 - concentration)
  const diversificationScore = 1 - concentrationIndex
  
  // Adjust for number of positions
  const positionBonus = Math.min(0.2, positions.length * 0.05)
  
  return Math.min(1, diversificationScore + positionBonus)
}

async function calculateStockRiskData(positions: any[]): Promise<StockRiskData[]> {
  // Simplified risk calculation for each stock
  // In production, you'd fetch real historical data
  
  const stockRiskMap = new Map([
    ['xTSLA', { volatility: 35, beta: 1.8, riskLevel: 'high' as const }],
    ['xAAPL', { volatility: 25, beta: 1.2, riskLevel: 'medium' as const }],
    ['xMSFT', { volatility: 22, beta: 1.1, riskLevel: 'medium' as const }],
    ['xGOOGL', { volatility: 28, beta: 1.3, riskLevel: 'medium' as const }],
    ['xAMZN', { volatility: 30, beta: 1.4, riskLevel: 'high' as const }],
    ['xNVDA', { volatility: 40, beta: 2.0, riskLevel: 'high' as const }],
    ['xMETA', { volatility: 32, beta: 1.5, riskLevel: 'high' as const }],
  ])

  return positions.map(position => {
    const symbol = position.symbol
    const riskData = stockRiskMap.get(symbol) || {
      volatility: 25, // Default medium volatility
      beta: 1.0,      // Market beta
      riskLevel: 'medium' as const
    }

    // Calculate recommendation score (0-10, higher is better)
    let recommendationScore = 5
    
    // Adjust based on current performance
    const pnl = position.pnl_percentage || 0
    if (pnl > 10) recommendationScore += 2
    else if (pnl > 0) recommendationScore += 1
    else if (pnl < -20) recommendationScore -= 3
    else if (pnl < -10) recommendationScore -= 2
    else if (pnl < 0) recommendationScore -= 1

    // Adjust based on risk level
    if (riskData.riskLevel === 'low') recommendationScore += 1
    else if (riskData.riskLevel === 'high') recommendationScore -= 1

    recommendationScore = Math.max(0, Math.min(10, recommendationScore))

    return {
      symbol: symbol,
      volatility30d: riskData.volatility,
      beta: riskData.beta,
      riskLevel: riskData.riskLevel,
      recommendationScore: Math.round(recommendationScore * 100) / 100
    }
  })
}

function generateRecommendations(
  riskMetrics: RiskMetrics,
  stockRiskData: StockRiskData[],
  userRiskTolerance: number
): any {
  const recommendations = {
    overall: '',
    actions: [] as string[],
    rebalanceNeeded: false,
    riskAdjustments: [] as string[]
  }

  // Overall assessment
  const riskMismatch = Math.abs(riskMetrics.riskScore - userRiskTolerance)
  
  if (riskMismatch > 2) {
    recommendations.rebalanceNeeded = true
    if (riskMetrics.riskScore > userRiskTolerance) {
      recommendations.overall = 'Your portfolio is riskier than your tolerance. Consider reducing exposure to high-risk positions.'
      recommendations.actions.push('Reduce allocation to high-volatility stocks')
      recommendations.actions.push('Consider adding more stable, low-beta positions')
    } else {
      recommendations.overall = 'Your portfolio is more conservative than your risk tolerance allows. Consider increasing growth exposure.'
      recommendations.actions.push('Consider adding higher-growth potential stocks')
      recommendations.actions.push('Increase allocation to emerging sectors')
    }
  } else {
    recommendations.overall = 'Your portfolio risk level aligns well with your tolerance.'
  }

  // Diversification recommendations
  if (riskMetrics.diversificationScore < 0.5) {
    recommendations.actions.push('Improve diversification by adding positions in different sectors')
    recommendations.riskAdjustments.push('Current portfolio is highly concentrated')
  }

  // Stock-specific recommendations
  const highRiskStocks = stockRiskData.filter(stock => 
    stock.riskLevel === 'high' && stock.recommendationScore < 4
  )
  
  if (highRiskStocks.length > 0 && userRiskTolerance < 7) {
    recommendations.riskAdjustments.push(
      `Consider reducing exposure to: ${highRiskStocks.map(s => s.symbol).join(', ')}`
    )
  }

  const lowPerformingStocks = stockRiskData.filter(stock => 
    stock.recommendationScore < 3
  )
  
  if (lowPerformingStocks.length > 0) {
    recommendations.actions.push(
      `Review underperforming positions: ${lowPerformingStocks.map(s => s.symbol).join(', ')}`
    )
  }

  // Volatility recommendations
  if (riskMetrics.portfolioVolatility > 25 && userRiskTolerance < 7) {
    recommendations.riskAdjustments.push('Portfolio volatility is high for your risk tolerance')
    recommendations.actions.push('Consider adding more stable positions to reduce volatility')
  }

  return recommendations
} 