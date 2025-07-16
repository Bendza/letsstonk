"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import {
  Shield,
  Target,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  Zap,
} from "lucide-react"
import { useRiskAssessment, RiskAssessment as RiskAssessmentType } from "@/hooks/useRiskAssessment"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface RiskAssessmentProps {
  walletAddress: string | null
  userRiskTolerance: number
  onRiskToleranceChange?: (newTolerance: number) => void
}

const RISK_COLORS = {
  low: "#10b981",
  medium: "#f59e0b", 
  high: "#ef4444"
}

const DIVERSIFICATION_COLORS = ["#374151", "#4B5563", "#6B7280", "#9CA3AF", "#D1D5DB"]

export function RiskAssessment({ walletAddress, userRiskTolerance, onRiskToleranceChange }: RiskAssessmentProps) {
  const { riskAssessment, loading, error, fetchRiskAssessment, generateRiskAssessment } = useRiskAssessment(walletAddress)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showGenerator, setShowGenerator] = useState(false)
  const [newRiskTolerance, setNewRiskTolerance] = useState(userRiskTolerance)

  const handleGenerateAssessment = async () => {
    setIsGenerating(true)
    try {
      await generateRiskAssessment(newRiskTolerance)
      setShowGenerator(false)
      if (onRiskToleranceChange) {
        onRiskToleranceChange(newRiskTolerance)
      }
    } catch (err) {
      console.error('Failed to generate risk assessment:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const getRiskLabel = (score: number) => {
    if (score <= 3) return { label: "Conservative", color: "bg-green-100 text-green-800" }
    if (score <= 7) return { label: "Moderate", color: "bg-yellow-100 text-yellow-800" }
    return { label: "Aggressive", color: "bg-red-100 text-red-800" }
  }

  const getRiskLevelColor = (level: 'low' | 'medium' | 'high') => {
    return RISK_COLORS[level]
  }

  // Show generator if no assessment exists
  if (!riskAssessment && !loading && !error) {
    return (
      <Card className="minimal-card">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            RISK ASSESSMENT
          </CardTitle>
          <CardDescription>Generate your personalized risk analysis</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Target className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">No Risk Assessment Found</h3>
              <p className="text-gray-600 mb-6">
                Generate a comprehensive risk analysis for your portfolio to get personalized recommendations.
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="risk-slider" className="text-base font-medium">
                  Risk Tolerance: {newRiskTolerance}/10
                </Label>
                <Slider
                  id="risk-slider"
                  min={1}
                  max={10}
                  step={1}
                  value={[newRiskTolerance]}
                  onValueChange={(value) => setNewRiskTolerance(value[0])}
                  className="w-full mt-2"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Conservative</span>
                  <span>Aggressive</span>
                </div>
              </div>
              <Button 
                onClick={handleGenerateAssessment}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating Assessment...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Generate Risk Assessment
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Loading state
  if (loading) {
    return (
      <Card className="minimal-card">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            RISK ASSESSMENT
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Analyzing portfolio risk...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Error state
  if (error) {
    return (
      <Card className="minimal-card">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-600" />
            RISK ASSESSMENT
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
          <Button 
            onClick={fetchRiskAssessment}
            variant="outline"
            className="w-full mt-4"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!riskAssessment) return null

  const { riskMetrics, stockRiskData, recommendations } = riskAssessment
  const riskLabel = getRiskLabel(riskMetrics.riskScore)

  // Prepare data for stock risk distribution chart
  const stockRiskDistribution = stockRiskData.reduce((acc, stock) => {
    acc[stock.riskLevel] = (acc[stock.riskLevel] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const riskDistributionData = Object.entries(stockRiskDistribution).map(([level, count]) => ({
    name: level.charAt(0).toUpperCase() + level.slice(1),
    value: count,
    color: getRiskLevelColor(level as 'low' | 'medium' | 'high')
  }))

  return (
    <div className="space-y-6">
      {/* Risk Overview */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="minimal-card">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              RISK SCORE
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">{riskMetrics.riskScore}/10</div>
            <Badge className={`mb-4 rounded-none ${riskLabel.color}`}>
              {riskLabel.label.toUpperCase()}
            </Badge>
            <p className="text-sm text-gray-600">{riskMetrics.recommendation}</p>
          </CardContent>
        </Card>

        <Card className="minimal-card">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-orange-600" />
              VOLATILITY
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">{riskMetrics.portfolioVolatility}%</div>
            <Progress value={Math.min(riskMetrics.portfolioVolatility, 100)} className="mb-4" />
            <p className="text-sm text-gray-600">Portfolio volatility</p>
          </CardContent>
        </Card>

        <Card className="minimal-card">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              DIVERSIFICATION
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {Math.round(riskMetrics.diversificationScore * 100)}%
            </div>
            <Progress value={riskMetrics.diversificationScore * 100} className="mb-4" />
            <p className="text-sm text-gray-600">Diversification score</p>
          </CardContent>
        </Card>
      </div>

      {/* Risk Metrics Details */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="minimal-card">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="heading-md">STOCK RISK BREAKDOWN</CardTitle>
            <CardDescription>Risk distribution across your holdings</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {stockRiskData.map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{stock.symbol}</span>
                    <Badge 
                      variant="secondary" 
                      className="rounded-none"
                      style={{ backgroundColor: getRiskLevelColor(stock.riskLevel) + '20', color: getRiskLevelColor(stock.riskLevel) }}
                    >
                      {stock.riskLevel.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">β: {stock.beta}</div>
                    <div className="text-xs text-gray-500">{stock.volatility30d}% vol</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="minimal-card">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="heading-md">RISK DISTRIBUTION</CardTitle>
            <CardDescription>Holdings by risk level</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                  >
                    {riskDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [value, "Holdings"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {riskDistributionData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4" style={{ backgroundColor: item.color }} />
                    <span className="font-semibold">{item.name} Risk</span>
                  </div>
                  <span className="text-sm text-gray-600">{item.value} stocks</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="minimal-card">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="heading-md">RECOMMENDATIONS</CardTitle>
          <CardDescription>AI-powered suggestions for your portfolio</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                recommendations.rebalanceNeeded ? 'bg-yellow-100' : 'bg-green-100'
              }`}>
                {recommendations.rebalanceNeeded ? (
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                )}
              </div>
              <div>
                <h4 className="font-semibold mb-1">Overall Assessment</h4>
                <p className="text-gray-600">{recommendations.overall}</p>
              </div>
            </div>

            {recommendations.actions.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Suggested Actions</h4>
                <div className="space-y-2">
                  {recommendations.actions.map((action, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recommendations.riskAdjustments.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Risk Adjustments</h4>
                <div className="space-y-2">
                  {recommendations.riskAdjustments.map((adjustment, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{adjustment}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <Button 
          onClick={() => setShowGenerator(true)}
          variant="outline"
        >
          <Target className="h-4 w-4 mr-2" />
          Update Risk Tolerance
        </Button>
        <Button 
          onClick={fetchRiskAssessment}
          variant="outline"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Analysis
        </Button>
      </div>

      {/* Risk Tolerance Generator Modal */}
      {showGenerator && (
        <Card className="minimal-card">
          <CardHeader className="border-b border-gray-200">
            <CardTitle>Update Risk Assessment</CardTitle>
            <CardDescription>Adjust your risk tolerance and regenerate analysis</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="new-risk-slider" className="text-base font-medium">
                  New Risk Tolerance: {newRiskTolerance}/10
                </Label>
                <Slider
                  id="new-risk-slider"
                  min={1}
                  max={10}
                  step={1}
                  value={[newRiskTolerance]}
                  onValueChange={(value) => setNewRiskTolerance(value[0])}
                  className="w-full mt-2"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Conservative</span>
                  <span>Aggressive</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleGenerateAssessment}
                  disabled={isGenerating}
                  className="flex-1"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Generate New Assessment
                    </>
                  )}
                </Button>
                <Button 
                  onClick={() => setShowGenerator(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 