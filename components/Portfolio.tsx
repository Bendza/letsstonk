"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  AlertCircle
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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Portfolio</h1>
          <Button disabled>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Loading...
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Portfolio</h1>
          <Button onClick={handleSync} disabled={syncing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
            Retry Sync
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span>Error: {error}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show empty state if no portfolio
  if (!portfolio) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Portfolio</h1>
          <Button onClick={handleSync} disabled={syncing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
            Sync Portfolio
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold mb-2">No Portfolio Found</h3>
              <p className="text-gray-600 mb-4">No active portfolio found for your wallet.</p>
              <Button onClick={() => onNavigate('dashboard')}>
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
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

  // Generate simple performance chart - for now show current value
  const performanceData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    // Simple mock progression for now - in production this would come from price_history table
    const progress = (i + 1) / 7
    const value = initialInvestment + (totalReturn * progress)
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      portfolio: value,
      sp500: initialInvestment * (1 + (progress * 0.08)) // Assume 8% benchmark return
    }
  })

  const metrics = {
    volatility: 12.5, // These would come from analytics calculation
    sharpeRatio: 1.24,
    beta: 0.95,
    maxDrawdown: -8.2,
    winRate: 68,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Portfolio</h1>
        <Button onClick={handleSync} disabled={syncing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing...' : 'Sync Portfolio'}
        </Button>
      </div>

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold">${currentValue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Return</p>
                <p className={`text-2xl font-bold ${totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${totalReturn.toLocaleString()}
                </p>
              </div>
              {totalReturn >= 0 ? (
                <TrendingUp className="h-8 w-8 text-green-500" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-500" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Return %</p>
                <p className={`text-2xl font-bold ${totalReturnPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {totalReturnPercent.toFixed(2)}%
                </p>
              </div>
              <Percent className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Positions</p>
                <p className="text-2xl font-bold">{positions.length}</p>
              </div>
              <Activity className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
                <CardDescription>Portfolio vs S&P 500 benchmark</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => [`$${Number(value).toLocaleString()}`, ""]} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="portfolio"
                      stroke="#374151"
                      strokeWidth={2}
                      name="Portfolio"
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
              </CardContent>
            </Card>

            {/* Allocation Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Allocation</CardTitle>
                <CardDescription>Current portfolio allocation</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name} ${(value || 0).toFixed(1)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [`${Number(value).toFixed(1)}%`, "Allocation"]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="positions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Holdings</CardTitle>
              <CardDescription>Current positions in your portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              {positions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No positions found. Try syncing your portfolio.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {positions.map((position, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{position.logo}</div>
                        <div>
                          <h3 className="font-semibold">{position.symbol}</h3>
                          <p className="text-sm text-gray-600">{position.shares.toFixed(6)} shares</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold">${position.value.toLocaleString()}</p>
                        <div className="flex items-center gap-1">
                          {position.change >= 0 ? (
                            <ArrowUpRight className="h-4 w-4 text-green-500" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-red-500" />
                          )}
                          <span className={`text-sm ${position.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {position.changePercent.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Allocation</p>
                        <p className="font-semibold">{position.allocation.toFixed(1)}%</p>
                                                 <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                           <div 
                             className="bg-blue-600 h-2 rounded-full" 
                             style={{ width: `${Math.min(100, position.allocation || 0)}%` }}
                           ></div>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div>
                  <p className="text-sm font-medium text-gray-600">Volatility</p>
                  <p className="text-2xl font-bold">{metrics.volatility}%</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sharpe Ratio</p>
                  <p className="text-2xl font-bold">{metrics.sharpeRatio}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div>
                  <p className="text-sm font-medium text-gray-600">Beta</p>
                  <p className="text-2xl font-bold">{metrics.beta}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
