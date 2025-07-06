"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Navigation } from "./Navigation"
import {
  Target,
  TrendingUp,
  TrendingDown,
  Shield,
  AlertTriangle,
  CheckCircle,
  Brain,
  Lightbulb,
  BookOpen,
  ArrowRight,
} from "lucide-react"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts"
import type { OnboardingData } from "./OnboardingFlow"

interface AnalyticsProps {
  onboardingData: OnboardingData
  onNavigate: (page: "landing" | "dashboard" | "markets" | "portfolio" | "analytics" | "history" | "settings") => void
  onLogout: () => void
}

// Mock data for analytics
const riskProfileData = [
  { subject: "Volatility Tolerance", A: 8, fullMark: 10 },
  { subject: "Growth Focus", A: 7, fullMark: 10 },
  { subject: "Diversification", A: 9, fullMark: 10 },
  { subject: "Time Horizon", A: 8, fullMark: 10 },
  { subject: "Risk Capacity", A: 6, fullMark: 10 },
  { subject: "Experience", A: 7, fullMark: 10 },
]

const correlationData = [
  { name: "xTSLA", xTSLA: 1.0, xAAPL: 0.65, xMSFT: 0.72, xGOOGL: 0.68, xAMZN: 0.71 },
  { name: "xAAPL", xTSLA: 0.65, xAAPL: 1.0, xMSFT: 0.78, xGOOGL: 0.74, xAMZN: 0.69 },
  { name: "xMSFT", xTSLA: 0.72, xAAPL: 0.78, xMSFT: 1.0, xGOOGL: 0.81, xAMZN: 0.73 },
  { name: "xGOOGL", xTSLA: 0.68, xAAPL: 0.74, xMSFT: 0.81, xGOOGL: 1.0, xAMZN: 0.76 },
  { name: "xAMZN", xTSLA: 0.71, xAAPL: 0.69, xMSFT: 0.73, xGOOGL: 0.76, xAMZN: 1.0 },
]

const recommendations = [
  {
    symbol: "xNVDA",
    name: "NVIDIA Corporation",
    reason: "Strong AI growth potential aligns with your risk profile",
    riskLevel: "Moderate-High",
    expectedReturn: "+15-25%",
    confidence: 85,
    logo: "🎮",
  },
  {
    symbol: "xJPM",
    name: "JPMorgan Chase",
    reason: "Adds financial sector diversification to reduce tech concentration",
    riskLevel: "Moderate",
    expectedReturn: "+8-15%",
    confidence: 78,
    logo: "🏦",
  },
  {
    symbol: "xJNJ",
    name: "Johnson & Johnson",
    reason: "Defensive healthcare play for portfolio stability",
    riskLevel: "Low-Moderate",
    expectedReturn: "+5-12%",
    confidence: 72,
    logo: "🏥",
  },
]

const marketInsights = [
  {
    title: "Tech Sector Momentum",
    description: "Technology stocks showing strong momentum with AI adoption driving growth",
    impact: "Positive",
    confidence: 82,
  },
  {
    title: "Interest Rate Environment",
    description: "Current rate environment favors growth stocks over value",
    impact: "Positive",
    confidence: 75,
  },
  {
    title: "Market Volatility",
    description: "Increased volatility expected due to geopolitical tensions",
    impact: "Neutral",
    confidence: 68,
  },
]

const educationalContent = [
  {
    title: "Understanding Portfolio Beta",
    description: "Learn how beta measures your portfolio's sensitivity to market movements",
    category: "Risk Management",
    readTime: "5 min",
  },
  {
    title: "Diversification Strategies",
    description: "Effective ways to spread risk across different asset classes and sectors",
    category: "Portfolio Theory",
    readTime: "8 min",
  },
  {
    title: "xStocks vs Traditional Stocks",
    description: "Key differences between tokenized stocks and traditional equity trading",
    category: "DeFi Education",
    readTime: "6 min",
  },
]

export function Analytics({ onboardingData, onNavigate, onLogout }: AnalyticsProps) {
  const [selectedTab, setSelectedTab] = useState("risk")

  const riskScore = onboardingData.riskLevel
  const riskLabel = riskScore <= 3 ? "Conservative" : riskScore <= 7 ? "Moderate" : "Aggressive"

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="analytics" onNavigate={onNavigate} onLogout={onLogout} />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 tracking-tight">AI ANALYTICS & INSIGHTS</h1>
          <p className="text-gray-600 text-lg">Advanced portfolio analysis and personalized recommendations</p>
        </div>

        {/* Risk Assessment Overview */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="minimal-card">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                RISK PROFILE
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">{riskScore}/10</div>
              <Badge
                className={`mb-4 rounded-none ${
                  riskScore <= 3
                    ? "bg-green-100 text-green-800"
                    : riskScore <= 7
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {riskLabel.toUpperCase()}
              </Badge>
              <p className="text-sm text-gray-600">
                Your risk tolerance indicates a {riskLabel.toLowerCase()} investment approach
              </p>
            </CardContent>
          </Card>

          <Card className="minimal-card">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                AI CONFIDENCE
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">87%</div>
              <Badge className="bg-purple-100 text-purple-800 mb-4 rounded-none">HIGH CONFIDENCE</Badge>
              <p className="text-sm text-gray-600">AI model confidence in portfolio recommendations</p>
            </CardContent>
          </Card>

          <Card className="minimal-card">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                OPTIMIZATION SCORE
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">8.4/10</div>
              <Badge className="bg-green-100 text-green-800 mb-4 rounded-none">WELL OPTIMIZED</Badge>
              <p className="text-sm text-gray-600">Current portfolio alignment with your goals</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200 rounded-none">
            <TabsTrigger
              value="risk"
              className="data-[state=active]:bg-gray-900 data-[state=active]:text-white rounded-none"
            >
              RISK ANALYSIS
            </TabsTrigger>
            <TabsTrigger
              value="recommendations"
              className="data-[state=active]:bg-gray-900 data-[state=active]:text-white rounded-none"
            >
              RECOMMENDATIONS
            </TabsTrigger>
            <TabsTrigger
              value="insights"
              className="data-[state=active]:bg-gray-900 data-[state=active]:text-white rounded-none"
            >
              MARKET INSIGHTS
            </TabsTrigger>
            <TabsTrigger
              value="education"
              className="data-[state=active]:bg-gray-900 data-[state=active]:text-white rounded-none"
            >
              EDUCATION
            </TabsTrigger>
          </TabsList>

          {/* Risk Analysis Tab */}
          <TabsContent value="risk" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="minimal-card">
                <CardHeader className="border-b border-gray-200">
                  <CardTitle className="heading-md">RISK PROFILE RADAR</CardTitle>
                  <CardDescription>Multi-dimensional risk assessment</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={riskProfileData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={90} domain={[0, 10]} />
                        <Radar
                          name="Risk Profile"
                          dataKey="A"
                          stroke="#374151"
                          fill="#374151"
                          fillOpacity={0.1}
                          strokeWidth={2}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="minimal-card">
                <CardHeader className="border-b border-gray-200">
                  <CardTitle className="heading-md">PORTFOLIO OPTIMIZATION</CardTitle>
                  <CardDescription>Areas for improvement</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Diversification</span>
                      <span className="text-green-700 font-semibold">85%</span>
                    </div>
                    <Progress value={85} className="h-3 bg-gray-200" />
                    <p className="text-sm text-gray-600 mt-1">
                      Good sector spread, consider adding international exposure
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Risk-Return Balance</span>
                      <span className="text-yellow-600 font-semibold">72%</span>
                    </div>
                    <Progress value={72} className="h-3 bg-gray-200" />
                    <p className="text-sm text-gray-600 mt-1">Moderate efficiency, rebalancing could improve returns</p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Volatility Management</span>
                      <span className="text-green-700 font-semibold">90%</span>
                    </div>
                    <Progress value={90} className="h-3 bg-gray-200" />
                    <p className="text-sm text-gray-600 mt-1">Excellent volatility control for your risk level</p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Cost Efficiency</span>
                      <span className="text-green-700 font-semibold">95%</span>
                    </div>
                    <Progress value={95} className="h-3 bg-gray-200" />
                    <p className="text-sm text-gray-600 mt-1">Very low fees thanks to DeFi infrastructure</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Correlation Matrix */}
            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="heading-md">CORRELATION MATRIX</CardTitle>
                <CardDescription>How your holdings move together</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left p-2"></th>
                        <th className="text-center p-2 font-semibold">xTSLA</th>
                        <th className="text-center p-2 font-semibold">xAAPL</th>
                        <th className="text-center p-2 font-semibold">xMSFT</th>
                        <th className="text-center p-2 font-semibold">xGOOGL</th>
                        <th className="text-center p-2 font-semibold">xAMZN</th>
                      </tr>
                    </thead>
                    <tbody>
                      {correlationData.map((row) => (
                        <tr key={row.name}>
                          <td className="p-2 font-semibold">{row.name}</td>
                          <td
                            className={`text-center p-2 ${row.xTSLA >= 0.8 ? "bg-red-100" : row.xTSLA >= 0.6 ? "bg-yellow-100" : "bg-green-100"}`}
                          >
                            {row.xTSLA.toFixed(2)}
                          </td>
                          <td
                            className={`text-center p-2 ${row.xAAPL >= 0.8 ? "bg-red-100" : row.xAAPL >= 0.6 ? "bg-yellow-100" : "bg-green-100"}`}
                          >
                            {row.xAAPL.toFixed(2)}
                          </td>
                          <td
                            className={`text-center p-2 ${row.xMSFT >= 0.8 ? "bg-red-100" : row.xMSFT >= 0.6 ? "bg-yellow-100" : "bg-green-100"}`}
                          >
                            {row.xMSFT.toFixed(2)}
                          </td>
                          <td
                            className={`text-center p-2 ${row.xGOOGL >= 0.8 ? "bg-red-100" : row.xGOOGL >= 0.6 ? "bg-yellow-100" : "bg-green-100"}`}
                          >
                            {row.xGOOGL.toFixed(2)}
                          </td>
                          <td
                            className={`text-center p-2 ${row.xAMZN >= 0.8 ? "bg-red-100" : row.xAMZN >= 0.6 ? "bg-yellow-100" : "bg-green-100"}`}
                          >
                            {row.xAMZN.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center gap-6 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100"></div>
                    <span>Low Correlation (&lt;0.6)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-100"></div>
                    <span>Medium Correlation (0.6-0.8)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-100"></div>
                    <span>High Correlation (&gt;0.8)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="flex items-center gap-2 heading-md">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  AI-POWERED RECOMMENDATIONS
                </CardTitle>
                <CardDescription>
                  Personalized stock suggestions based on your portfolio and risk profile
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {recommendations.map((rec, index) => (
                    <div key={rec.symbol} className="border border-gray-200 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <span className="text-3xl">{rec.logo}</span>
                          <div>
                            <h3 className="text-xl font-bold">{rec.symbol}</h3>
                            <p className="text-gray-600">{rec.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-blue-100 text-blue-800 mb-2 rounded-none">
                            {rec.confidence}% CONFIDENCE
                          </Badge>
                          <div className="text-sm text-gray-600">Expected Return</div>
                          <div className="font-semibold text-green-700">{rec.expectedReturn}</div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Why this recommendation?</h4>
                        <p className="text-gray-700">{rec.reason}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Badge
                            variant="secondary"
                            className={`rounded-none ${
                              rec.riskLevel.includes("Low")
                                ? "bg-green-100 text-green-800"
                                : rec.riskLevel.includes("High")
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {rec.riskLevel} Risk
                          </Badge>
                          <div className="text-sm text-gray-600">Confidence: {rec.confidence}%</div>
                        </div>
                        <Button className="btn-primary" onClick={() => onNavigate("markets")}>
                          VIEW IN MARKETS
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Portfolio Optimization Suggestions */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="minimal-card">
                <CardHeader className="border-b border-gray-200">
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    REDUCE RISK
                  </CardTitle>
                  <CardDescription>Suggestions to lower portfolio volatility</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold">Add Defensive Stocks</h4>
                      <p className="text-sm text-gray-600">Consider utilities or consumer staples for stability</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold">Reduce Tech Concentration</h4>
                      <p className="text-sm text-gray-600">Currently 65% tech - consider reducing to 50%</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold">Add International Exposure</h4>
                      <p className="text-sm text-gray-600">Diversify with European or Asian markets</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="minimal-card">
                <CardHeader className="border-b border-gray-200">
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <TrendingUp className="h-5 w-5" />
                    INCREASE RETURNS
                  </CardTitle>
                  <CardDescription>Opportunities to enhance portfolio performance</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold">Growth Stock Allocation</h4>
                      <p className="text-sm text-gray-600">Increase exposure to high-growth companies</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold">Emerging Sectors</h4>
                      <p className="text-sm text-gray-600">Consider AI, clean energy, or biotech exposure</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold">Rebalancing Frequency</h4>
                      <p className="text-sm text-gray-600">Increase rebalancing to monthly for better returns</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Market Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="minimal-card">
                <CardHeader className="border-b border-gray-200">
                  <CardTitle className="heading-md">MARKET SENTIMENT</CardTitle>
                  <CardDescription>Current market conditions and outlook</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-green-700 mb-2">BULLISH</div>
                    <Badge className="bg-green-100 text-green-800 rounded-none">FAVORABLE CONDITIONS</Badge>
                  </div>
                  <div className="space-y-4">
                    {marketInsights.map((insight, index) => (
                      <div key={index} className="border-l-4 border-gray-300 pl-4">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold">{insight.title}</h4>
                          <Badge
                            variant="secondary"
                            className={`text-xs rounded-none ${
                              insight.impact === "Positive"
                                ? "bg-green-100 text-green-800"
                                : insight.impact === "Negative"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {insight.impact}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                        <div className="text-xs text-gray-500">Confidence: {insight.confidence}%</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="minimal-card">
                <CardHeader className="border-b border-gray-200">
                  <CardTitle className="heading-md">SECTOR PERFORMANCE</CardTitle>
                  <CardDescription>30-day sector returns</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Technology</span>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-green-700 font-semibold">+8.2%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Healthcare</span>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-green-700 font-semibold">+3.1%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Finance</span>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-green-700 font-semibold">+1.8%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Energy</span>
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-red-600" />
                        <span className="text-red-600 font-semibold">-2.4%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Consumer Discretionary</span>
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-red-600" />
                        <span className="text-red-600 font-semibold">-0.9%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Market Alerts */}
            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="flex items-center gap-2 heading-md">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  MARKET ALERTS
                </CardTitle>
                <CardDescription>Important market events affecting your portfolio</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-blue-50 border-l-4 border-blue-500">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-blue-900">Fed Interest Rate Decision</h4>
                      <p className="text-blue-800 text-sm">FOMC meeting next week may impact tech stock valuations</p>
                      <div className="text-xs text-blue-600 mt-1">Impact: Medium • Confidence: 85%</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-green-50 border-l-4 border-green-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-green-900">Earnings Season</h4>
                      <p className="text-green-800 text-sm">Strong Q4 earnings expected for your tech holdings</p>
                      <div className="text-xs text-green-600 mt-1">Impact: Positive • Confidence: 78%</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-amber-50 border-l-4 border-amber-500">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-amber-900">Geopolitical Tensions</h4>
                      <p className="text-amber-800 text-sm">Trade discussions may create short-term volatility</p>
                      <div className="text-xs text-amber-600 mt-1">Impact: Neutral • Confidence: 65%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education" className="space-y-6">
            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="flex items-center gap-2 heading-md">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                  EDUCATIONAL RESOURCES
                </CardTitle>
                <CardDescription>Learn about investing, risk management, and DeFi</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {educationalContent.map((content, index) => (
                    <div key={index} className="border border-gray-200 p-6 hover:shadow-md transition-shadow">
                      <Badge variant="secondary" className="mb-3 bg-purple-100 text-purple-800 rounded-none">
                        {content.category}
                      </Badge>
                      <h3 className="font-bold mb-2">{content.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{content.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{content.readTime} read</span>
                        <Button variant="outline" size="sm" className="btn-secondary bg-transparent">
                          READ MORE
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="minimal-card">
                <CardHeader className="border-b border-gray-200">
                  <CardTitle className="heading-md">PORTFOLIO TIPS</CardTitle>
                  <CardDescription>Quick tips for better investing</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Diversify Across Sectors</h4>
                      <p className="text-sm text-gray-600">
                        Don't put all your eggs in one basket - spread risk across different industries
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Regular Rebalancing</h4>
                      <p className="text-sm text-gray-600">
                        Maintain your target allocation by rebalancing quarterly or when drift exceeds 5%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Think Long-Term</h4>
                      <p className="text-sm text-gray-600">
                        Don't panic during short-term volatility - stick to your investment plan
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="minimal-card">
                <CardHeader className="border-b border-gray-200">
                  <CardTitle className="heading-md">RISK MANAGEMENT</CardTitle>
                  <CardDescription>Protect your investments</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Position Sizing</h4>
                      <p className="text-sm text-gray-600">
                        Never invest more than 10% in a single stock to limit concentration risk
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Stop-Loss Strategy</h4>
                      <p className="text-sm text-gray-600">
                        Consider setting stop-losses at 15-20% below purchase price
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Emergency Fund</h4>
                      <p className="text-sm text-gray-600">Keep 3-6 months of expenses in cash before investing</p>
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
