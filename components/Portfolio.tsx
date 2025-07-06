"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navigation } from "./Navigation"
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
} from "lucide-react"
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

interface PortfolioProps {
  onboardingData: OnboardingData
  onNavigate: (page: "landing" | "dashboard" | "markets" | "portfolio" | "analytics" | "history" | "settings") => void
  onLogout: () => void
}

const COLORS = ["#374151", "#4B5563", "#6B7280", "#9CA3AF", "#D1D5DB"]

// Mock performance data
const performanceData = [
  { date: "Jan", portfolio: 1000, sp500: 1000 },
  { date: "Feb", portfolio: 1050, sp500: 1020 },
  { date: "Mar", portfolio: 1120, sp500: 1080 },
  { date: "Apr", portfolio: 1080, sp500: 1100 },
  { date: "May", portfolio: 1200, sp500: 1150 },
  { date: "Jun", portfolio: 1180, sp500: 1140 },
  { date: "Jul", portfolio: 1250, sp500: 1200 },
  { date: "Aug", portfolio: 1320, sp500: 1240 },
  { date: "Sep", portfolio: 1280, sp500: 1220 },
  { date: "Oct", portfolio: 1350, sp500: 1280 },
  { date: "Nov", portfolio: 1420, sp500: 1320 },
  { date: "Dec", portfolio: 1480, sp500: 1380 },
]

const sectorData = [
  { name: "Technology", value: 65, amount: 962.5, color: "#374151" },
  { name: "Healthcare", value: 15, amount: 222, color: "#4B5563" },
  { name: "Finance", value: 10, amount: 148, color: "#6B7280" },
  { name: "Consumer", value: 7, amount: 103.6, color: "#9CA3AF" },
  { name: "Energy", value: 3, amount: 44.4, color: "#D1D5DB" },
]

export function Portfolio({ onboardingData, onNavigate, onLogout }: PortfolioProps) {
  const [timeframe, setTimeframe] = useState("1Y")
  const [currentValue] = useState(1480)

  const allocation = getAllocationForRisk(onboardingData.riskLevel)
  const totalReturn = currentValue - onboardingData.initialInvestment
  const totalReturnPercent = (totalReturn / onboardingData.initialInvestment) * 100

  // Mock positions based on allocation
  const positions = allocation.map((item, index) => ({
    symbol: item.symbol,
    name: item.symbol.replace("x", ""),
    shares: Math.floor((currentValue * item.percentage) / 100 / (200 + index * 50)),
    avgPrice: 180 + index * 40,
    currentPrice: 200 + index * 50,
    value: (currentValue * item.percentage) / 100,
    change: (Math.random() - 0.5) * 20,
    changePercent: (Math.random() - 0.5) * 8,
    allocation: item.percentage,
    logo: ["🚗", "🍎", "💻", "🔍", "📦"][index] || "📈",
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="portfolio" onNavigate={onNavigate} onLogout={onLogout} />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 tracking-tight">PORTFOLIO ANALYSIS</h1>
            <p className="text-gray-600 text-lg">Detailed performance metrics and holdings breakdown</p>
          </div>
          <div className="flex items-center gap-4 mt-4 lg:mt-0">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7D">7 Days</SelectItem>
                <SelectItem value="30D">30 Days</SelectItem>
                <SelectItem value="90D">90 Days</SelectItem>
                <SelectItem value="1Y">1 Year</SelectItem>
                <SelectItem value="ALL">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="btn-secondary bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              EXPORT
            </Button>
          </div>
        </div>

        {/* Portfolio Summary Cards */}
        <div className="grid lg:grid-cols-5 gap-6 mb-8">
          <Card className="minimal-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Total Value
                </CardTitle>
                <DollarSign className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">${currentValue.toFixed(0)}</div>
              <div className={`flex items-center text-sm mt-2 ${totalReturn >= 0 ? "text-green-700" : "text-red-600"}`}>
                {totalReturn >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                +${Math.abs(totalReturn).toFixed(0)} ({totalReturnPercent.toFixed(1)}%)
              </div>
            </CardContent>
          </Card>

          <Card className="minimal-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Volatility
                </CardTitle>
                <Activity className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{metrics.volatility}%</div>
              <div className="text-sm text-gray-600 mt-2">ANNUALIZED</div>
            </CardContent>
          </Card>

          <Card className="minimal-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Sharpe Ratio
                </CardTitle>
                <Target className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{metrics.sharpeRatio}</div>
              <div className="text-sm text-gray-600 mt-2">RISK-ADJUSTED</div>
            </CardContent>
          </Card>

          <Card className="minimal-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Beta</CardTitle>
                <BarChart3 className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{metrics.beta}</div>
              <div className="text-sm text-gray-600 mt-2">VS S&P 500</div>
            </CardContent>
          </Card>

          <Card className="minimal-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Win Rate</CardTitle>
                <Percent className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{metrics.winRate}%</div>
              <div className="text-sm text-gray-600 mt-2">PROFITABLE TRADES</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200 rounded-none">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-gray-900 data-[state=active]:text-white rounded-none"
            >
              OVERVIEW
            </TabsTrigger>
            <TabsTrigger
              value="holdings"
              className="data-[state=active]:bg-gray-900 data-[state=active]:text-white rounded-none"
            >
              HOLDINGS
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="data-[state=active]:bg-gray-900 data-[state=active]:text-white rounded-none"
            >
              PERFORMANCE
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-gray-900 data-[state=active]:text-white rounded-none"
            >
              ANALYTICS
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
                          <div className="font-semibold">${item.amount.toFixed(0)}</div>
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
                        <td className="font-semibold">${position.value.toFixed(0)}</td>
                        <td className={`${position.change >= 0 ? "text-green-700" : "text-red-600"}`}>
                          <div className="flex items-center">
                            {position.change >= 0 ? (
                              <TrendingUp className="h-4 w-4 mr-1" />
                            ) : (
                              <TrendingDown className="h-4 w-4 mr-1" />
                            )}
                            <div>
                              <div>${Math.abs(position.change).toFixed(0)}</div>
                              <div className="text-xs">({position.changePercent.toFixed(1)}%)</div>
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
        </Tabs>
      </div>
    </div>
  )
}
