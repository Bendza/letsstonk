"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Navigation } from "./Navigation"
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Target,
  Clock,
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
} from "recharts"
import type { OnboardingData } from "./OnboardingFlow"
import { getAllocationForRisk } from "../lib/risk-engine"

interface DashboardProps {
  onboardingData: OnboardingData
  onNavigate: (page: "landing" | "dashboard") => void
  onLogout: () => void
}

// Mock data for charts
const performanceData = [
  { date: "Jan", value: 1000, benchmark: 1000 },
  { date: "Feb", value: 1050, benchmark: 1020 },
  { date: "Mar", value: 1120, benchmark: 1080 },
  { date: "Apr", value: 1080, benchmark: 1100 },
  { date: "May", value: 1200, benchmark: 1150 },
  { date: "Jun", value: 1180, benchmark: 1140 },
  { date: "Jul", value: 1250, benchmark: 1200 },
]

const COLORS = ["#374151", "#4B5563", "#6B7280", "#9CA3AF", "#D1D5DB"]

export function Dashboard({ onboardingData, onNavigate, onLogout }: DashboardProps) {
  const [currentValue, setCurrentValue] = useState(onboardingData.initialInvestment)
  const [isRebalancing, setIsRebalancing] = useState(false)

  const allocation = getAllocationForRisk(onboardingData.riskLevel)
  const totalReturn = currentValue - onboardingData.initialInvestment
  const totalReturnPercent = (totalReturn / onboardingData.initialInvestment) * 100

  // Mock positions based on allocation
  const positions = allocation.map((item, index) => ({
    symbol: item.symbol,
    name: item.symbol.replace("x", ""),
    amount: (currentValue * item.percentage) / 100,
    shares: Math.floor((currentValue * item.percentage) / 100 / (200 + index * 50)),
    price: 200 + index * 50,
    change: (Math.random() - 0.5) * 10,
    changePercent: (Math.random() - 0.5) * 5,
  }))

  // Pie chart data
  const pieData = allocation.map((item, index) => ({
    name: item.symbol,
    value: item.percentage,
    amount: (currentValue * item.percentage) / 100,
    color: COLORS[index % COLORS.length],
  }))

  // Simulate price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentValue((prev) => prev + (Math.random() - 0.5) * 20)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleRebalance = async () => {
    setIsRebalancing(true)
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsRebalancing(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="dashboard" onNavigate={onNavigate} onLogout={onLogout} />

      <div className="container mx-auto px-6 py-8">
        {/* Portfolio Overview Cards */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <Card className="minimal-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Total Portfolio Value
                </CardTitle>
                <DollarSign className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">${currentValue.toFixed(2)}</div>
              <div className={`flex items-center text-sm mt-2 ${totalReturn >= 0 ? "text-gray-900" : "text-gray-600"}`}>
                {totalReturn >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                ${Math.abs(totalReturn).toFixed(2)} ({totalReturnPercent.toFixed(2)}%)
              </div>
            </CardContent>
          </Card>

          <Card className="minimal-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Initial Investment
                </CardTitle>
                <Target className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">${onboardingData.initialInvestment.toFixed(2)}</div>
              <div className="text-sm text-gray-600 mt-2">USDC DEPOSITED</div>
            </CardContent>
          </Card>

          <Card className="minimal-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Risk Level
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{onboardingData.riskLevel}/10</div>
              <div className="text-sm text-gray-600 mt-2">
                {onboardingData.riskLevel <= 3
                  ? "CONSERVATIVE"
                  : onboardingData.riskLevel <= 7
                    ? "MODERATE"
                    : "AGGRESSIVE"}
              </div>
            </CardContent>
          </Card>

          <Card className="minimal-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Last Rebalanced
                </CardTitle>
                <Clock className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">2d</div>
              <div className="text-sm text-gray-600 mt-2">AGO</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="portfolio" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200 rounded-none">
            <TabsTrigger
              value="portfolio"
              className="data-[state=active]:bg-gray-900 data-[state=active]:text-white rounded-none"
            >
              PORTFOLIO
            </TabsTrigger>
            <TabsTrigger
              value="positions"
              className="data-[state=active]:bg-gray-900 data-[state=active]:text-white rounded-none"
            >
              POSITIONS
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="data-[state=active]:bg-gray-900 data-[state=active]:text-white rounded-none"
            >
              PERFORMANCE
            </TabsTrigger>
            <TabsTrigger
              value="rebalance"
              className="data-[state=active]:bg-gray-900 data-[state=active]:text-white rounded-none"
            >
              REBALANCE
            </TabsTrigger>
          </TabsList>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Portfolio Allocation Chart */}
              <Card className="minimal-card">
                <CardHeader className="border-b border-gray-200">
                  <CardTitle className="flex items-center gap-2 heading-md">
                    <PieChart className="h-5 w-5 text-gray-600" />
                    PORTFOLIO ALLOCATION
                  </CardTitle>
                  <CardDescription>Current distribution across xStocks</CardDescription>
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

              {/* Performance Chart */}
              <Card className="minimal-card">
                <CardHeader className="border-b border-gray-200">
                  <CardTitle className="flex items-center gap-2 heading-md">
                    <BarChart3 className="h-5 w-5 text-gray-600" />
                    PERFORMANCE VS S&P 500
                  </CardTitle>
                  <CardDescription>7-month performance comparison</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#374151" strokeWidth={3} name="Your Portfolio" />
                        <Line
                          type="monotone"
                          dataKey="benchmark"
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

          {/* Positions Tab */}
          <TabsContent value="positions">
            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="heading-md">CURRENT HOLDINGS</CardTitle>
                <CardDescription>Your individual stock positions and performance</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <table className="portfolio-table">
                  <thead>
                    <tr>
                      <th>SYMBOL</th>
                      <th>SHARES</th>
                      <th>PRICE</th>
                      <th>VALUE</th>
                      <th>CHANGE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {positions.map((position) => (
                      <tr key={position.symbol}>
                        <td>
                          <div className="font-semibold">{position.symbol}</div>
                          <div className="text-sm text-gray-500">{position.name}</div>
                        </td>
                        <td>{position.shares}</td>
                        <td>${position.price}</td>
                        <td className="font-semibold">${position.amount.toFixed(2)}</td>
                        <td className={`${position.change >= 0 ? "text-gray-900" : "text-gray-600"}`}>
                          <div className="flex items-center">
                            {position.change >= 0 ? (
                              <TrendingUp className="h-4 w-4 mr-1" />
                            ) : (
                              <TrendingDown className="h-4 w-4 mr-1" />
                            )}
                            {position.changePercent.toFixed(2)}%
                          </div>
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
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="minimal-card text-center">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-gray-900 mb-2">+12.5%</div>
                    <div className="text-sm text-gray-600 uppercase tracking-wide">Total Return</div>
                  </CardContent>
                </Card>
                <Card className="minimal-card text-center">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-gray-900 mb-2">0.85</div>
                    <div className="text-sm text-gray-600 uppercase tracking-wide">Sharpe Ratio</div>
                  </CardContent>
                </Card>
                <Card className="minimal-card text-center">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-gray-900 mb-2">8.2%</div>
                    <div className="text-sm text-gray-600 uppercase tracking-wide">Volatility</div>
                  </CardContent>
                </Card>
              </div>

              <Card className="minimal-card">
                <CardHeader className="border-b border-gray-200">
                  <CardTitle className="heading-md">PORTFOLIO GROWTH</CardTitle>
                  <CardDescription>Historical performance over time</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#374151" strokeWidth={4} name="Portfolio Value" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Rebalance Tab */}
          <TabsContent value="rebalance">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="minimal-card">
                <CardHeader className="border-b border-gray-200">
                  <CardTitle className="flex items-center gap-2 heading-md">
                    <RefreshCw className="h-5 w-5 text-gray-600" />
                    REBALANCING CONTROLS
                  </CardTitle>
                  <CardDescription>
                    Manage your portfolio rebalancing settings and trigger manual rebalancing
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50">
                      <span className="font-semibold">AUTO-REBALANCING</span>
                      <Badge
                        variant={onboardingData.autoRebalance ? "default" : "secondary"}
                        className="bg-gray-900 text-white rounded-none"
                      >
                        {onboardingData.autoRebalance ? "ENABLED" : "DISABLED"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50">
                      <span className="font-semibold">LAST REBALANCED</span>
                      <span className="text-gray-600">2 DAYS AGO</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50">
                      <span className="font-semibold">NEXT SCHEDULED</span>
                      <span className="text-gray-600">IN 5 DAYS</span>
                    </div>
                  </div>

                  <Button onClick={handleRebalance} disabled={isRebalancing} className="btn-primary w-full" size="lg">
                    {isRebalancing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        REBALANCING...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        REBALANCE NOW
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card className="minimal-card">
                <CardHeader className="border-b border-gray-200">
                  <CardTitle className="heading-md">ALLOCATION DRIFT ANALYSIS</CardTitle>
                  <CardDescription>Current vs target allocation comparison</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {allocation.map((item, index) => {
                      const currentPercent = (positions[index]?.amount / currentValue) * 100
                      const drift = Math.abs(currentPercent - item.percentage)

                      return (
                        <div key={item.symbol} className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">{item.symbol}</span>
                            <div className="text-right">
                              <div className="text-sm font-semibold">
                                {currentPercent.toFixed(1)}% / {item.percentage}%
                              </div>
                              <div className="text-xs text-gray-500">CURRENT / TARGET</div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="relative">
                              <Progress value={currentPercent} className="h-3 bg-gray-200" />
                              <div
                                className="absolute top-0 h-3 bg-gray-400 opacity-50"
                                style={{ width: `${item.percentage}%` }}
                              />
                            </div>
                          </div>
                          {drift > 2 && (
                            <div className="text-xs text-gray-600 bg-gray-100 p-2">
                              ⚠️ Drift: {drift.toFixed(1)}% - Consider rebalancing
                            </div>
                          )}
                        </div>
                      )
                    })}
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
