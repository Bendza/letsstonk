"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Percent, 
  Activity, 
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  Target,
  PieChart as PieChartIcon,
  BarChart3,
  Download
} from "lucide-react"
import { usePortfolio } from "@/hooks/usePortfolio"

interface PortfolioProps {
  onboardingData: {
    walletAddress: string | null
    riskTolerance: number
    initialInvestment: number
    portfolioName: string
    rebalanceFrequency: string
    autoRebalance: boolean
  }
  onNavigate: (page: string) => void
  onLogout: () => void
}

const COLORS = ["#374151", "#4B5563", "#6B7280", "#9CA3AF", "#D1D5DB"]

const getStockLogo = (symbol: string) => {
  const logoMap: Record<string, string> = {
    'AAPLx': '🍎',
    'TSLAx': '🚗', 
    'GOOGLx': '🔍',
    'AMZNx': '📦',
    'MSFTx': '💻',
    'NVDAx': '🎮',
    'JPMx': '🏦',
    'Vx': '💳',
    'WMTx': '🛒',
    'PGx': '🧴',
    'UNHx': '🏥',
  }
  return logoMap[symbol] || '📈'
}

// Generate sector allocation from real positions
const generateSectorData = (positions: any[], currentValue: number) => {
  const sectorMap: Record<string, string> = {
    'AAPLx': 'Technology',
    'TSLAx': 'Automotive',
    'GOOGLx': 'Technology',
    'AMZNx': 'Consumer Discretionary',
    'PGx': 'Consumer Staples',
    'UNHx': 'Healthcare',
    'Vx': 'Financial Services',
    'WMTx': 'Consumer Staples',
    'MSFTx': 'Technology',
    'NVDAx': 'Technology',
  }

  const sectorTotals: Record<string, number> = {}
  
  positions.forEach(position => {
    const sector = sectorMap[position.symbol] || 'Technology'
    sectorTotals[sector] = (sectorTotals[sector] || 0) + position.value
  })

  const sectorData = Object.entries(sectorTotals).map(([sector, value], index) => ({
    name: sector,
    value: currentValue > 0 ? (value / currentValue) * 100 : 0,
    amount: value,
    color: COLORS[index % COLORS.length],
  }))

  return sectorData.sort((a, b) => b.value - a.value)
}

export function Portfolio({ onboardingData, onNavigate, onLogout }: PortfolioProps) {
  const [timeframe, setTimeframe] = useState("1Y")
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Use real portfolio data from Supabase
  const { portfolio, loading: portfolioLoading, error: portfolioError, syncPortfolio } = usePortfolio(onboardingData.walletAddress || null)
  
  // Set error state from portfolio hook
  useEffect(() => {
    if (portfolioError) {
      setError(portfolioError)
    }
  }, [portfolioError])

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

  // Show loading state
  if (portfolioLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Portfolio</h1>
            <p className="text-gray-600">Track your investment performance</p>
          </div>
        </div>
        
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

  // Show error state
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

  // Show empty state if no portfolio
  if (!portfolio) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No Portfolio Found</h2>
            <p className="text-gray-600 mb-4">No active portfolio found for your wallet.</p>
            <Button onClick={() => onNavigate('dashboard')}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Calculate portfolio metrics from real data
  const currentValue = portfolio.total_value || 0
  const initialInvestment = portfolio.initial_investment || onboardingData.initialInvestment
  const totalReturn = portfolio.current_pnl || 0
  const totalReturnPercent = portfolio.pnl_percentage || 0

  // Convert database positions to display format
  const positions = (portfolio.positions || []).map((position: any) => ({
    symbol: position.symbol,
    name: position.symbol.replace("x", ""),
    shares: position.amount || 0,
    avgPrice: position.average_price || 0,
    currentPrice: position.current_price || 0,
    value: position.value || 0,
    change: position.pnl || 0,
    changePercent: position.pnl_percentage || 0,
    allocation: Number(position.current_percentage || 0),
    logo: getStockLogo(position.symbol),
  }))

  // Create pie chart data from real positions
  const pieData = positions.map((pos, index) => ({
    name: pos.symbol,
    value: pos.allocation,
    amount: pos.value,
    color: COLORS[index % COLORS.length],
  }))

  // Generate sector allocation from real data
  const sectorData = generateSectorData(positions, currentValue)

  // Generate performance chart - simple progression for now
  const performanceData = Array.from({ length: 12 }, (_, i) => {
    const progress = (i + 1) / 12
    const value = initialInvestment + (totalReturn * progress)
    const sp500Value = initialInvestment * (1 + (progress * 0.12)) // Assume 12% annual return for S&P 500
    
    return {
      date: new Date(2024, i).toLocaleDateString('en-US', { month: 'short' }),
      portfolio: value,
      sp500: sp500Value
    }
  })

  const metrics = {
    volatility: 12.5,
    sharpeRatio: 1.24,
    beta: 0.95,
    maxDrawdown: -8.2,
    winRate: 68,
  }

  // Find best and worst performers
  const bestPerformer = positions.reduce((best, current) => 
    (current.changePercent || 0) > (best.changePercent || 0) ? current : best
  , positions[0] || { symbol: 'N/A', changePercent: 0 })

  const topHolding = positions.reduce((top, current) => 
    (current.allocation || 0) > (top.allocation || 0) ? current : top
  , positions[0] || { symbol: 'N/A', allocation: 0 })

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
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

      {/* Portfolio Summary Cards */}
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
              <PieChartIcon className="h-4 w-4 text-gray-400" />
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
            <div className="text-xl md:text-3xl font-bold text-gray-900">{bestPerformer.symbol}</div>
            <div className="text-xs md:text-sm text-green-700 mt-2">
              +{(bestPerformer.changePercent || 0).toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card className="minimal-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Top Allocation
              </CardTitle>
              <Percent className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-3xl font-bold text-gray-900">{(topHolding.allocation || 0).toFixed(0)}%</div>
            <div className="text-xs md:text-sm text-gray-500 mt-2">
              {topHolding.symbol}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-white border border-gray-200 rounded-none">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-gray-900 data-[state=active]:text-white rounded-none flex items-center gap-2"
          >
            <PieChartIcon className="h-4 w-4" />
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
            value="sectors"
            className="data-[state=active]:bg-gray-900 data-[state=active]:text-white rounded-none flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">SECTORS</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Portfolio Allocation */}
            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="flex items-center gap-2 heading-md">
                  <PieChartIcon className="h-5 w-5 text-gray-600" />
                  ALLOCATION BY STOCK
                </CardTitle>
                <CardDescription>Current portfolio distribution</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [`${Number(value || 0).toFixed(1)}%`, "Allocation"]} />
                    </PieChart>
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
                        <div className="text-sm text-gray-500">{(item.value || 0).toFixed(1)}%</div>
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
                    <PieChart>
                      <Pie data={sectorData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                        {sectorData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [`${Number(value || 0).toFixed(1)}%`, "Allocation"]} />
                    </PieChart>
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
                        <div className="text-sm text-gray-500">{item.value.toFixed(1)}%</div>
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
              {positions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No positions found. Try syncing your portfolio.</p>
                </div>
              ) : (
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
                        <td className="font-semibold">{position.shares.toFixed(4)}</td>
                        <td>${position.avgPrice.toFixed(2)}</td>
                        <td className="font-semibold">${position.currentPrice.toFixed(2)}</td>
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
                            {position.allocation.toFixed(1)}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
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

        {/* Sectors Tab */}
        <TabsContent value="sectors">
          <Card className="minimal-card">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="heading-md">SECTOR BREAKDOWN</CardTitle>
              <CardDescription>Investment distribution across market sectors</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {sectorData.map((sector, index) => (
                  <div key={sector.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: sector.color }} />
                      <div>
                        <h3 className="font-semibold">{sector.name}</h3>
                        <p className="text-sm text-gray-600">{sector.value.toFixed(1)}% of portfolio</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${sector.amount.toFixed(0)}</div>
                      <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${Math.min(100, sector.value)}%`,
                            backgroundColor: sector.color 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
