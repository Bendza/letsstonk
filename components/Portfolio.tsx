"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Target,
  Activity,
  Percent,
  Download,
  RefreshCw,
  AlertCircle,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { usePortfolio } from "@/hooks/usePortfolio"
import { useWalletAuth } from "@/hooks/useWalletAuth"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import type { OnboardingData } from "./OnboardingFlow"
import { getAllocationForRisk } from "../lib/risk-engine"
import { RiskAssessment } from "./RiskAssessment"
import React from "react"

interface PortfolioProps {
  onboardingData: OnboardingData
  onNavigate: (page: "landing" | "dashboard" | "markets" | "portfolio" | "analytics" | "history" | "settings") => void
  onLogout: () => void
}

const COLORS = ["#374151", "#4B5563", "#6B7280", "#9CA3AF", "#D1D5DB"]

// Helper function to get stock logos
function getStockLogo(symbol: string): string {
  const logoMap: Record<string, string> = {
    'xTSLA': '🚗',
    'xAAPL': '🍎', 
    'xMSFT': '💻',
    'xGOOGL': '🔍',
    'xAMZN': '📦',
    'xNVDA': '🎮',
    'xMETA': '👥',
  }
  return logoMap[symbol] || '📈'
}

// Generate realistic mock data based on portfolio
const generateMockData = (portfolio: any, initialInvestment: number) => {
  const currentValue = portfolio?.total_value || initialInvestment
  const pnl = portfolio?.current_pnl || 0
  const pnlPercentage = portfolio?.pnl_percentage || 0
  
  // Generate performance data showing progression from initial investment to current value
  const performanceData = Array.from({ length: 12 }, (_, i) => {
    const progress = (i + 1) / 12
    const portfolioValue = initialInvestment + (pnl * progress)
    const sp500Value = initialInvestment * (1 + (progress * 0.12)) // Assume 12% annual return for S&P 500
    
    return {
      date: new Date(2024, i).toLocaleDateString('en-US', { month: 'short' }),
      portfolio: portfolioValue,
      sp500: sp500Value
    }
  })
  
  // Generate sector allocation based on risk level
  const sectorData = [
    { name: "Technology", value: 45, amount: currentValue * 0.45, color: "#374151" },
    { name: "Healthcare", value: 20, amount: currentValue * 0.20, color: "#4B5563" },
    { name: "Finance", value: 15, amount: currentValue * 0.15, color: "#6B7280" },
    { name: "Consumer", value: 12, amount: currentValue * 0.12, color: "#9CA3AF" },
    { name: "Energy", value: 8, amount: currentValue * 0.08, color: "#D1D5DB" },
  ]
  
  return { performanceData, sectorData }
}

export function Portfolio({ onboardingData, onNavigate, onLogout }: PortfolioProps) {
  const [timeframe, setTimeframe] = useState("1Y")
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Use real portfolio data from Supabase
  const { portfolio, loading: portfolioLoading, error: portfolioError, syncPortfolio } = usePortfolio(onboardingData.walletAddress || null)
  
  // Set error state from portfolio hook
  React.useEffect(() => {
    if (portfolioError) {
      setError(portfolioError)
    }
  }, [portfolioError])

  // Generate mock data based on portfolio
  const { performanceData, sectorData } = generateMockData(portfolio, onboardingData.initialInvestment)
  
  // Generate mock positions if no real data available
  const mockPositions = portfolio?.positions?.length ? portfolio.positions : [
    {
      id: '1',
      symbol: 'xTSLA',
      token_address: 'tesla_address',
      amount: 10.5,
      shares: 10.5,
      avgPrice: 180.00,
      currentPrice: 195.50,
      value: 2052.75,
      change: 162.75,
      changePercent: 8.6,
      target_percentage: 25,
      current_percentage: 25.5
    },
    {
      id: '2',
      symbol: 'xAAPL',
      token_address: 'apple_address',
      amount: 12.0,
      shares: 12.0,
      avgPrice: 150.00,
      currentPrice: 165.25,
      value: 1983.00,
      change: 183.00,
      changePercent: 10.2,
      target_percentage: 25,
      current_percentage: 24.6
    },
    {
      id: '3',
      symbol: 'xMSFT',
      token_address: 'microsoft_address',
      amount: 8.0,
      shares: 8.0,
      avgPrice: 200.00,
      currentPrice: 210.75,
      value: 1686.00,
      change: 86.00,
      changePercent: 5.4,
      target_percentage: 20,
      current_percentage: 20.9
    },
    {
      id: '4',
      symbol: 'xGOOGL',
      token_address: 'google_address',
      amount: 6.0,
      shares: 6.0,
      avgPrice: 140.00,
      currentPrice: 135.50,
      value: 813.00,
      change: -27.00,
      changePercent: -3.2,
      target_percentage: 15,
      current_percentage: 10.1
    },
    {
      id: '5',
      symbol: 'xNVDA',
      token_address: 'nvidia_address',
      amount: 4.0,
      shares: 4.0,
      avgPrice: 220.00,
      currentPrice: 245.75,
      value: 983.00,
      change: 103.00,
      changePercent: 11.7,
      target_percentage: 15,
      current_percentage: 12.2
    }
  ]

  const handleSync = async () => {
    setSyncing(true)
    setError(null)
    try {
      await syncPortfolio()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync portfolio')
    } finally {
      setSyncing(false)
    }
  }

  // Calculate portfolio metrics from real data
  const currentValue = portfolio?.total_value || mockPositions.reduce((sum, pos: any) => sum + (pos.value || 0), 0)
  const initialInvestment = portfolio?.initial_investment || onboardingData.initialInvestment
  const totalReturn = portfolio?.current_pnl || (currentValue - initialInvestment)
  const totalReturnPercent = portfolio?.pnl_percentage || ((totalReturn / initialInvestment) * 100)

  // Convert database positions to display format
  const positions = mockPositions.map((position: any) => ({
    symbol: position.symbol,
    name: position.symbol.replace("x", ""),
    shares: position.shares || position.amount,
    avgPrice: position.avgPrice || position.average_price,
    currentPrice: position.currentPrice || position.current_price,
    value: position.value,
    change: position.change || position.pnl,
    changePercent: position.changePercent || position.pnl_percentage,
    allocation: position.current_percentage,
    logo: getStockLogo(position.symbol),
  }))

  const pieData = positions.map((pos, index) => ({
    name: pos.symbol,
    value: pos.allocation,
    amount: pos.value,
    color: COLORS[index % COLORS.length],
  }))

  const metrics = {
    volatility: 12.5,
    sharpeRatio: 1.24,
    beta: 0.95,
    maxDrawdown: -8.2,
    winRate: 68,
  }

  // Loading state - same as Markets
  if (portfolioLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Portfolio</h1>
            <p className="text-gray-600">Track your investment performance</p>
          </div>
        </div>
        
        {/* Loading State - Same as Markets */}
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Portfolio Data</h2>
            <p className="text-gray-600 mb-4">Syncing wallet balances and portfolio state...</p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-gray-800 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-800 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-gray-800 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Portfolio Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={handleSync} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry Sync
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      {/* Show error alert if there's an issue */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Show info if no real portfolio data */}
      {!portfolio && (
        <Alert className="border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            No portfolio found. Complete the onboarding process to create your portfolio.
          </AlertDescription>
        </Alert>
      )}

      {/* Header - Similar to Markets */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Portfolio</h1>
            <p className="text-gray-600 text-sm md:text-base">
              {portfolio ? `${positions.length} positions • $${currentValue.toFixed(0)} total value` : 'Track your investment performance'}
            </p>
            {portfolio && portfolio.updated_at && (
              <p className="text-xs text-gray-500 mt-1">
                Last synced: {new Date(portfolio.updated_at).toLocaleString()}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex items-center gap-2 px-2 md:px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
            <Activity className="h-4 w-4 text-gray-600" />
            <span className="text-xs md:text-sm font-medium text-gray-700">
              Risk Level: {onboardingData.riskTolerance}/10
            </span>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSync}
            disabled={syncing}
          >
            <RefreshCw className={`h-4 w-4 md:mr-2 ${syncing ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">{syncing ? 'Syncing...' : 'Sync Portfolio'}</span>
          </Button>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-20 md:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7D">7D</SelectItem>
              <SelectItem value="30D">30D</SelectItem>
              <SelectItem value="90D">90D</SelectItem>
              <SelectItem value="1Y">1Y</SelectItem>
              <SelectItem value="ALL">All</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Portfolio Summary Cards - More precise data */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
        <Card className="minimal-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Portfolio Value
              </CardTitle>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-3xl font-bold text-gray-900">${currentValue.toFixed(0)}</div>
            <div className={`flex items-center text-xs md:text-sm mt-2 ${totalReturn >= 0 ? "text-green-700" : "text-red-600"}`}>
              {totalReturn >= 0 ? (
                <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 md:h-4 md:w-4 mr-1" />
              )}
              ${Math.abs(totalReturn).toFixed(0)} ({totalReturnPercent.toFixed(1)}%)
            </div>
          </CardContent>
        </Card>

        <Card className="minimal-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Invested
              </CardTitle>
              <Target className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-3xl font-bold text-gray-900">${initialInvestment.toFixed(0)}</div>
            <div className="text-xs md:text-sm text-gray-500 mt-2">
              Initial investment
            </div>
          </CardContent>
        </Card>

        <Card className="minimal-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Holdings
              </CardTitle>
              <PieChart className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-3xl font-bold text-gray-900">{positions.length}</div>
            <div className="text-xs md:text-sm text-gray-500 mt-2">
              Active positions
            </div>
          </CardContent>
        </Card>

        <Card className="minimal-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Best Performer
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            {(() => {
              const bestPerformer = positions.reduce((best, current) => 
                (current.changePercent || 0) > (best.changePercent || 0) ? current : best
              , positions[0] || { symbol: 'N/A', changePercent: 0 })
              
              return (
                <>
                  <div className="text-xl md:text-3xl font-bold text-gray-900">{bestPerformer.symbol}</div>
                  <div className="text-xs md:text-sm text-green-700 mt-2">
                    +{(bestPerformer.changePercent || 0).toFixed(1)}%
                  </div>
                </>
              )
            })()}
          </CardContent>
        </Card>

        <Card className="minimal-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Allocation
              </CardTitle>
              <Percent className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            {(() => {
              const topHolding = positions.reduce((top, current) => 
                (current.allocation || 0) > (top.allocation || 0) ? current : top
              , positions[0] || { symbol: 'N/A', allocation: 0 })
              
              return (
                <>
                  <div className="text-xl md:text-3xl font-bold text-gray-900">{(topHolding.allocation || 0).toFixed(0)}%</div>
                  <div className="text-xs md:text-sm text-gray-500 mt-2">
                    Top: {topHolding.symbol}
                  </div>
                </>
              )
            })()}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-white border border-gray-200 rounded-none">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-gray-900 data-[state=active]:text-white rounded-none flex items-center gap-2"
          >
            <PieChart className="h-4 w-4" />
            <span className="hidden sm:inline">OVERVIEW</span>
          </TabsTrigger>
          <TabsTrigger
            value="holdings"
            className="data-[state=active]:bg-gray-900 data-[state=active]:text-white rounded-none flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">HOLDINGS</span>
          </TabsTrigger>
          <TabsTrigger
            value="performance"
            className="data-[state=active]:bg-gray-900 data-[state=active]:text-white rounded-none flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">PERFORMANCE</span>
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-gray-900 data-[state=active]:text-white rounded-none flex items-center gap-2"
          >
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">ANALYTICS</span>
          </TabsTrigger>
          <TabsTrigger
            value="risk"
            className="data-[state=active]:bg-gray-900 data-[state=active]:text-white rounded-none flex items-center gap-2"
          >
            <AlertCircle className="h-4 w-4" />
            <span className="hidden sm:inline">RISK</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Portfolio Allocation */}
            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="flex items-center gap-2 heading-md">
                  <PieChart className="h-5 w-5 text-gray-600" />
                  ALLOCATION BY STOCK
                </CardTitle>
                <CardDescription>Current portfolio distribution</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <RechartsPieChart data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </RechartsPieChart>
                      <Tooltip formatter={(value: any) => [`${value}%`, "Allocation"]} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3 mt-6">
                  {pieData.map((item, index) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4" style={{ backgroundColor: item.color }} />
                        <span className="font-semibold">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${item.amount?.toFixed(0) || '0'}</div>
                        <div className="text-sm text-gray-500">{item.value}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sector Allocation */}
            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="flex items-center gap-2 heading-md">
                  <BarChart3 className="h-5 w-5 text-gray-600" />
                  SECTOR ALLOCATION
                </CardTitle>
                <CardDescription>Diversification across sectors</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <RechartsPieChart data={sectorData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                        {sectorData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </RechartsPieChart>
                      <Tooltip formatter={(value: any) => [`${value}%`, "Allocation"]} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3 mt-6">
                  {sectorData.map((item, index) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4" style={{ backgroundColor: item.color }} />
                        <span className="font-semibold">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${item.amount.toFixed(0)}</div>
                        <div className="text-sm text-gray-500">{item.value}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Portfolio Growth Chart */}
          <Card className="minimal-card">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="heading-md">PORTFOLIO GROWTH</CardTitle>
              <CardDescription>Performance over time ({timeframe})</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="portfolio"
                      stroke="#374151"
                      fill="#374151"
                      fillOpacity={0.1}
                      strokeWidth={3}
                      name="Your Portfolio"
                    />
                    <Line
                      type="monotone"
                      dataKey="sp500"
                      stroke="#9CA3AF"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="S&P 500"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Holdings Tab */}
        <TabsContent value="holdings">
          <Card className="minimal-card">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="heading-md">CURRENT HOLDINGS</CardTitle>
              <CardDescription>Detailed breakdown of your stock positions</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <table className="portfolio-table">
                <thead>
                  <tr>
                    <th>STOCK</th>
                    <th>SHARES</th>
                    <th>AVG PRICE</th>
                    <th>CURRENT PRICE</th>
                    <th>VALUE</th>
                    <th>P&L</th>
                    <th>ALLOCATION</th>
                  </tr>
                </thead>
                <tbody>
                  {positions.map((position) => (
                    <tr key={position.symbol}>
                      <td>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{position.logo}</span>
                          <div>
                            <div className="font-semibold">{position.symbol}</div>
                            <div className="text-sm text-gray-500">{position.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="font-semibold">{position.shares}</td>
                      <td>${position.avgPrice}</td>
                      <td className="font-semibold">${position.currentPrice}</td>
                      <td className="font-semibold">${position.value?.toFixed(0) || '0'}</td>
                      <td className={`${(position.change || 0) >= 0 ? "text-green-700" : "text-red-600"}`}>
                        <div className="flex items-center">
                          {(position.change || 0) >= 0 ? (
                            <TrendingUp className="h-4 w-4 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 mr-1" />
                          )}
                          <div>
                            <div>${Math.abs(position.change || 0).toFixed(0)}</div>
                            <div className="text-xs">({(position.changePercent || 0).toFixed(1)}%)</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge variant="secondary" className="bg-gray-100 text-gray-700 rounded-none">
                          {position.allocation}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance">
          <div className="grid gap-6">
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="minimal-card text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-green-700 mb-2">+{totalReturnPercent.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600 uppercase tracking-wide">Total Return</div>
                </CardContent>
              </Card>
              <Card className="minimal-card text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-gray-900 mb-2">{metrics.sharpeRatio}</div>
                  <div className="text-sm text-gray-600 uppercase tracking-wide">Sharpe Ratio</div>
                </CardContent>
              </Card>
              <Card className="minimal-card text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-gray-900 mb-2">{metrics.volatility}%</div>
                  <div className="text-sm text-gray-600 uppercase tracking-wide">Volatility</div>
                </CardContent>
              </Card>
              <Card className="minimal-card text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-red-600 mb-2">{metrics.maxDrawdown}%</div>
                  <div className="text-sm text-gray-600 uppercase tracking-wide">Max Drawdown</div>
                </CardContent>
              </Card>
            </div>

            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="heading-md">PERFORMANCE VS BENCHMARK</CardTitle>
                <CardDescription>Portfolio performance compared to S&P 500</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="portfolio"
                        stroke="#374151"
                        strokeWidth={4}
                        name="Your Portfolio"
                      />
                      <Line
                        type="monotone"
                        dataKey="sp500"
                        stroke="#9CA3AF"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="S&P 500"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="heading-md">RISK METRICS</CardTitle>
                <CardDescription>Portfolio risk analysis</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-1">{metrics.volatility}%</div>
                    <div className="text-sm text-gray-600">VOLATILITY</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-1">{metrics.beta}</div>
                    <div className="text-sm text-gray-600">BETA</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-1">{metrics.sharpeRatio}</div>
                    <div className="text-sm text-gray-600">SHARPE RATIO</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600 mb-1">{metrics.maxDrawdown}%</div>
                    <div className="text-sm text-gray-600">MAX DRAWDOWN</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="heading-md">DIVERSIFICATION SCORE</CardTitle>
                <CardDescription>Portfolio diversification analysis</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-green-700 mb-2">8.2/10</div>
                  <div className="text-sm text-gray-600">WELL DIVERSIFIED</div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Stock Concentration</span>
                      <span>85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Sector Spread</span>
                      <span>75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "75%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Risk Distribution</span>
                      <span>90%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: "90%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Risk Tab */}
        <TabsContent value="risk">
          <RiskAssessment 
            walletAddress={onboardingData.walletAddress || null}
            userRiskTolerance={onboardingData.riskTolerance}
            onRiskToleranceChange={(newTolerance) => {
              // Update onboarding data if needed
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
