"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, ArrowLeft, TrendingUp, Shield, Target, CheckCircle, Loader2, DollarSign, PieChart as PieChartIcon, BarChart3, AlertCircle, Coins } from "lucide-react"
import { WalletConnectButton } from "./WalletConnectButton"
// Removed Solana wallet adapter import - using Privy instead
import { usePrivyAuth } from '@/hooks/usePrivyAuth'
import { useJupiterSwap } from '@/hooks/useJupiterSwap'
import { useJupiterTrading } from '@/hooks/useJupiterTrading'
import { usePortfolio } from '@/hooks/usePortfolio'
import { ResponsiveContainer, Pie, PieChart, Cell, Tooltip } from 'recharts';
import { Connection } from '@solana/web3.js';
import { getTradingRpcUrl } from '@/lib/rpc-config';

export interface OnboardingData {
  riskTolerance: number
  initialInvestment: number
  portfolioName: string
  rebalanceFrequency: "daily" | "weekly" | "monthly"
  autoRebalance: boolean
  walletAddress?: string
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void
  onBack: () => void
}

export function OnboardingFlow({ onComplete, onBack }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState<OnboardingData>({
    riskTolerance: 5,
    initialInvestment: 1000, // Default to $1000 USD
    portfolioName: "My Portfolio",
    rebalanceFrequency: "weekly",
    autoRebalance: true,
  })

  const { isAuthenticated, user, walletInfo } = usePrivyAuth()
  const connected = !!walletInfo?.address
  const walletAddress = walletInfo?.address || null
  const { portfolio } = usePortfolio(walletAddress)
  const { 
    getSwapQuote, 
    calculatePortfolioAllocation, 
    calculatePortfolioAllocationWithPrices,
    getPortfolioQuotes, 
    createPortfolio,
    testXStockAvailability,
    isLoading: isSwapLoading, 
    error: swapError 
  } = useJupiterSwap()

  // Use Jupiter Trading hook for actual portfolio creation (same as TradingModal)
  const { 
    buyXStock: jupiterBuyXStock, 
    loading: jupiterLoading, 
    error: jupiterError 
  } = useJupiterTrading()

  const steps = [
    {
      title: "Connect & Authenticate",
      description: "Connect your Solana wallet and authenticate",
      component: ConnectWalletStep,
    },
    {
      title: "Risk Assessment",
      description: "Set your risk tolerance level",
      component: RiskToleranceStep,
    },
    {
      title: "Investment Amount",
      description: "Choose your initial investment",
      component: InvestmentStep,
    },
    {
      title: "Portfolio Preview",
      description: "Review your portfolio allocation",
      component: PortfolioPreviewStep,
    },
    {
      title: "Portfolio Setup",
      description: "Configure your portfolio settings",
      component: PortfolioSetupStep,
    },
    {
      title: "Execute Trades",
      description: "Create your portfolio with Jupiter",
      component: ExecuteTradesStep,
    },
  ]

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Final step - create user profile and execute trades
      setIsCreating(true)
      try {
        // Create user profile first
        await createUserProfile(formData.riskTolerance, formData.initialInvestment)
        
        // Just proceed to final step - actual trading happens in ExecuteTradesStep
        onComplete(formData)
      } catch (error) {
        console.error('Error creating portfolio:', error)
        // Handle error - maybe show a toast or error message
      } finally {
        setIsCreating(false)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      onBack()
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return connected && isAuthenticated
      case 1:
        return formData.riskTolerance >= 1 && formData.riskTolerance <= 10
      case 2:
        return formData.initialInvestment >= 1
      case 3:
        return true // Portfolio preview step
      case 4:
        return formData.portfolioName.trim().length > 0
      default:
        return true
    }
  }

  const CurrentStepComponent = steps[currentStep].component

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      {/* Header similar to Markets.tsx */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Portfolio Setup</h1>
            <p className="text-gray-600 text-sm md:text-base">Create your personalized stock portfolio</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Step indicator with bigger dots on the right */}
          <div className="flex items-center gap-3">
            <div className="flex items-center space-x-3">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index <= currentStep ? "bg-gray-900" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-base font-medium text-gray-700">
              {currentStep + 1}/{steps.length}
            </span>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <Card className="minimal-card card-shadow">
        <CardHeader className="border-b border-gray-200 pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <span className="bg-gray-900 text-white rounded-full w-10 h-10 flex items-center justify-center text-base font-bold">
              {currentStep + 1}
            </span>
            {steps[currentStep].title}
          </CardTitle>
          <CardDescription className="text-base text-gray-600 ml-11">
            {steps[currentStep].description}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <CurrentStepComponent
            formData={formData}
            setFormData={setFormData}
            connected={connected}
            publicKey={publicKey}
            isAuthenticated={isAuthenticated}
            calculatePortfolioAllocation={calculatePortfolioAllocation}
            calculatePortfolioAllocationWithPrices={calculatePortfolioAllocationWithPrices}
            getPortfolioQuotes={getPortfolioQuotes}
            buyXStock={jupiterBuyXStock}
            jupiterLoading={isSwapLoading || jupiterLoading}
            user={user}
            portfolio={portfolio}
            onComplete={onComplete}
          />
        </CardContent>
      </Card>

      {/* Navigation - Hide main nav on ExecuteTradesStep to force proper execution flow */}
      {currentStep !== steps.length - 1 && (
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={isCreating}
            className="flex items-center px-6 py-2 text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {currentStep === 0 ? "Back to Dashboard" : "Previous"}
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed() || isCreating}
            className="flex items-center px-6 py-2 btn-primary"
          >
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                Next Step
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      )}

      {/* ExecuteTradesStep handles its own completion */}
      {currentStep === steps.length - 1 && (
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center px-6 py-2 text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <div className="text-sm text-gray-600">
            Use the "Execute Portfolio Creation" button above to complete setup
          </div>
        </div>
      )}
    </div>
  )
}

// Step Components
function ConnectWalletStep({ connected, publicKey, isAuthenticated }: any) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Shield className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold mb-2">Secure Wallet Connection</h3>
        <p className="text-gray-600 text-sm">
          Connect your Solana wallet and authenticate to access SolStock's automated trading features
        </p>
      </div>

      {/* Connection Status Cards */}
      <div className="grid gap-4">
        {/* Wallet Connection Card */}
        <Card className="minimal-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  connected ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Shield className={`h-4 w-4 ${
                    connected ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                </div>
                <div>
                  <div className="font-semibold text-sm">
                    {connected ? 'Wallet Connected' : 'Connect Wallet'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {connected && publicKey ? 
                      `${publicKey.toString().slice(0, 8)}...${publicKey.toString().slice(-8)}` : 
                      'Click to connect your Solana wallet'
                    }
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <WalletConnectButton />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Authentication Status */}
        {connected && !isAuthenticated && (
          <Card className="minimal-card">
            <CardContent className="p-4 bg-yellow-50 border-yellow-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Shield className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm text-yellow-800">Authentication Required</div>
                  <div className="text-xs text-yellow-700 mt-1">
                    Please complete authentication to proceed
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Connection Failed */}
        {!connected && (
          <Card className="minimal-card">
            <CardContent className="p-4 bg-red-50 border-red-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm text-red-800">Wallet Not Connected</div>
                  <div className="text-xs text-red-700 mt-1">
                    Please connect your wallet to continue
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

    </div>
  )
}

function RiskToleranceStep({ formData, setFormData }: any) {
  const riskLevels = [
    { level: 1, label: "Very Conservative", description: "Minimal risk, stable returns", color: "bg-green-100 text-green-800" },
    { level: 3, label: "Conservative", description: "Low risk, steady growth", color: "bg-blue-100 text-blue-800" },
    { level: 5, label: "Moderate", description: "Balanced risk and return", color: "bg-yellow-100 text-yellow-800" },
    { level: 7, label: "Aggressive", description: "Higher risk, higher potential returns", color: "bg-orange-100 text-orange-800" },
    { level: 10, label: "Very Aggressive", description: "Maximum risk, maximum potential", color: "bg-red-100 text-red-800" },
  ]

  const currentRisk = riskLevels.find(r => r.level === formData.riskTolerance) || riskLevels[2]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Target className="h-6 w-6 text-orange-600" />
        </div>
        <h3 className="text-xl font-bold mb-2">Risk Assessment</h3>
        <p className="text-gray-600 text-sm">
          Choose your risk tolerance level to optimize your portfolio allocation
        </p>
      </div>

      {/* Current Selection Display */}
      <Card className="minimal-card">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">{formData.riskTolerance}/10</div>
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${currentRisk.color}`}>
              {currentRisk.label}
            </div>
            <p className="text-sm text-gray-600 mt-2">{currentRisk.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Risk Slider */}
      <Card className="minimal-card">
        <CardHeader className="border-b border-gray-200 pb-3">
          <CardTitle className="text-base">Adjust Risk Level</CardTitle>
          <CardDescription className="text-sm">Slide to set your preferred risk tolerance</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            <Slider
              id="risk-slider"
              min={1}
              max={10}
              step={1}
              value={[formData.riskTolerance]}
              onValueChange={(value) => setFormData({ ...formData, riskTolerance: value[0] })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Conservative (1)</span>
              <span>Moderate (5)</span>
              <span>Aggressive (10)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Level Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {riskLevels.map((risk) => (
          <Card
            key={risk.level}
            className={`minimal-card cursor-pointer transition-all duration-200 hover:shadow-md ${
              formData.riskTolerance === risk.level
                ? "ring-2 ring-gray-900 shadow-md"
                : "hover:border-gray-300"
            }`}
            onClick={() => setFormData({ ...formData, riskTolerance: risk.level })}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Badge className={`${risk.color} border-0 text-xs font-semibold`}>
                  Level {risk.level}
                </Badge>
                {formData.riskTolerance === risk.level && (
                  <CheckCircle className="h-4 w-4 text-gray-900" />
                )}
              </div>
              <h4 className="font-semibold text-sm mb-1">{risk.label}</h4>
              <p className="text-xs text-gray-600">{risk.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  )
}

function InvestmentStep({ formData, setFormData }: any) {
  const presetAmounts = [100, 500, 1000, 2500, 5000, 10000] // USD amounts

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <DollarSign className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-xl font-bold mb-2">Initial Investment</h3>
        <p className="text-gray-600 text-sm">
          Set your initial investment amount in USD to start building your portfolio
        </p>
      </div>

      {/* Current Amount Display */}
      <Card className="minimal-card">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {formatCurrency(formData.initialInvestment)}
            </div>
            <div className="text-sm text-gray-600">Initial Investment Amount</div>
            <div className="text-xs text-gray-500 mt-1">
              ≈ {(formData.initialInvestment / 200).toFixed(4)} SOL
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Investment Input */}
      <Card className="minimal-card">
        <CardHeader className="border-b border-gray-200 pb-3">
          <CardTitle className="text-base">Custom Amount</CardTitle>
          <CardDescription className="text-sm">Enter your preferred investment amount in USD</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                id="investment-amount"
                type="number"
                value={formData.initialInvestment}
                onChange={(e) => setFormData({ ...formData, initialInvestment: Number(e.target.value) })}
                placeholder="Enter USD amount"
                className="pl-10 text-lg font-semibold"
                min="1"
                step="1"
              />
            </div>
            <div className="text-xs text-gray-500 text-center">
              Minimum investment: $1 USD
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preset Amounts */}
      <Card className="minimal-card">
        <CardHeader className="border-b border-gray-200 pb-3">
          <CardTitle className="text-base">Quick Select</CardTitle>
          <CardDescription className="text-sm">Choose from common investment amounts</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {presetAmounts.map((amount) => (
              <Button
                key={amount}
                variant={formData.initialInvestment === amount ? "default" : "outline"}
                onClick={() => setFormData({ ...formData, initialInvestment: amount })}
                className={`text-sm font-semibold ${
                  formData.initialInvestment === amount 
                    ? "bg-gray-900 text-white" 
                    : "hover:border-gray-400"
                }`}
              >
                {formatCurrency(amount)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  )
}

function PortfolioPreviewStep({ formData, calculatePortfolioAllocationWithPrices, jupiterLoading }: any) {
  const [allocation, setAllocation] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllocation = async () => {
      try {
        setLoading(true);
        console.log('[PREVIEW] Fetching portfolio allocation with prices...');
        
        const allocationResult = await calculatePortfolioAllocationWithPrices(
          formData.riskTolerance, 
          formData.initialInvestment
        );
        
        setAllocation(allocationResult);
        console.log('[PREVIEW] Portfolio allocation loaded:', allocationResult);
      } catch (err) {
        console.error('[PREVIEW] Error:', err);
        setError('Failed to fetch portfolio allocation.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllocation();
  }, [calculatePortfolioAllocationWithPrices, formData.riskTolerance, formData.initialInvestment]);

  if (loading || jupiterLoading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-12 w-12 text-gray-600 animate-spin mx-auto" />
        <p className="text-lg text-gray-600 mt-4">Calculating portfolio allocation...</p>
        <p className="text-sm text-gray-500 mt-2">Fetching current prices...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!allocation.length) {
    return (
      <div className="text-center py-12 text-gray-600">
        <p>No portfolio allocation available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <PieChartIcon className="h-6 w-6 text-gray-600" />
        </div>
        <h3 className="text-xl font-bold mb-2">Portfolio Preview</h3>
        <p className="text-gray-600 text-sm">
          Review your portfolio allocation based on risk level {formData.riskTolerance}
        </p>
      </div>

      {/* Portfolio Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card className="minimal-card text-center">
          <CardContent className="p-3">
            <div className="text-xl font-bold text-gray-900">${formData.initialInvestment}</div>
            <div className="text-xs text-gray-600 uppercase tracking-wide">Total Investment</div>
          </CardContent>
        </Card>
        <Card className="minimal-card text-center">
          <CardContent className="p-3">
            <div className="text-xl font-bold text-gray-900">{formData.riskTolerance}/10</div>
            <div className="text-xs text-gray-600 uppercase tracking-wide">Risk Level</div>
          </CardContent>
        </Card>
        <Card className="minimal-card text-center">
          <CardContent className="p-3">
            <div className="text-xl font-bold text-gray-900">{allocation.length}</div>
            <div className="text-xs text-gray-600 uppercase tracking-wide">Positions</div>
          </CardContent>
        </Card>
        <Card className="minimal-card text-center">
          <CardContent className="p-3">
            <div className="text-xl font-bold text-green-700">
              {allocation.reduce((sum, item) => sum + item.allocation, 0).toFixed(0)}%
            </div>
            <div className="text-xs text-gray-600 uppercase tracking-wide">Allocated</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Allocation Chart */}
        <Card className="minimal-card">
          <CardHeader className="border-b border-gray-200 pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <PieChartIcon className="h-4 w-4 text-gray-600" />
              PORTFOLIO ALLOCATION
            </CardTitle>
            <CardDescription className="text-sm">Visual breakdown of your investment distribution</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={allocation.map((item, index) => ({
                      name: item.symbol,
                      value: item.allocation,
                      amount: item.usdcAmount,
                      color: `hsl(${(index * 137.508 + 200) % 360}, 45%, 45%)`
                    }))}
                    cx="50%" 
                    cy="50%" 
                    outerRadius={60} 
                    dataKey="value"
                  >
                    {allocation.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${(index * 137.508 + 200) % 360}, 45%, 45%)`} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any, name: any, props: any) => [
                    `${Number(value).toFixed(1)}% ($${props.payload.amount.toFixed(0)})`, 
                    name
                  ]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend */}
            <div className="space-y-1.5">
              {allocation.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded" 
                      style={{ backgroundColor: `hsl(${(index * 137.508 + 200) % 360}, 45%, 45%)` }}
                    />
                    <span className="font-semibold text-sm">{item.symbol}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-sm">{item.allocation}%</div>
                    <div className="text-xs text-gray-500">${item.usdcAmount.toFixed(0)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Holdings */}
        <Card className="minimal-card">
          <CardHeader className="border-b border-gray-200 pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4 text-gray-600" />
              POSITION DETAILS
            </CardTitle>
            <CardDescription className="text-sm">Estimated tokens and current pricing</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {allocation.map((item: any, index: number) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2.5 h-2.5 rounded-full" 
                        style={{ backgroundColor: `hsl(${(index * 137.508 + 200) % 360}, 45%, 45%)` }}
                      />
                      <h4 className="font-bold text-base">{item.symbol}</h4>
                    </div>
                    <Badge className="bg-gray-200 text-gray-900 font-semibold text-xs">
                    <div className="text-gray-500 text-xs uppercase tracking-wide">Current Price</div>
                      <div className="font-semibold text-sm ml-2">
                        {item.currentPrice > 0 ? `$${item.currentPrice.toFixed(2)}` : 'Loading...'}
                      </div>                    </Badge>
                  </div>
                  
                  <div className="flex justify-between">
                    <div>
                      <div className="text-gray-500 text-xs uppercase tracking-wide mb-1">Investment</div>
                      <div className="font-semibold text-sm">${item.usdcAmount.toFixed(0)}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-gray-500 text-xs uppercase tracking-wide mb-1">Estimated Tokens</div>
                      <div className="font-semibold text-sm">
                        {item.estimatedTokens > 0 ? item.estimatedTokens.toFixed(4) : 'Calculating...'}
                      </div>
                    </div>
                    <div>
     
                    </div>
   
                  </div>
                  
                  {/* Progress bar showing allocation */}
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="h-1.5 rounded-full transition-all duration-300" 
                        style={{ 
                          width: `${item.allocation}%`,
                          backgroundColor: `hsl(${(index * 137.508 + 200) % 360}, 45%, 45%)`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}

function PortfolioSetupStep({ formData, setFormData }: any) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Portfolio Configuration</h3>
        <p className="text-gray-600">
          Configure your portfolio name and rebalancing preferences
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="portfolio-name" className="text-base font-medium">
            Portfolio Name
          </Label>
          <Input
            id="portfolio-name"
            value={formData.portfolioName}
            onChange={(e) => setFormData({ ...formData, portfolioName: e.target.value })}
            placeholder="Enter portfolio name"
          />
        </div>

        <div>
          <Label className="text-base font-medium mb-3 block">
            Rebalancing Frequency
          </Label>
          <div className="grid grid-cols-3 gap-3">
            {["daily", "weekly", "monthly"].map((freq) => (
              <Button
                key={freq}
                variant={formData.rebalanceFrequency === freq ? "default" : "outline"}
                onClick={() => setFormData({ ...formData, rebalanceFrequency: freq })}
                className="capitalize"
              >
                {freq}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ExecuteTradesStep({ formData, connected, publicKey, calculatePortfolioAllocation, buyXStock, jupiterLoading, user, portfolio, onComplete }: any) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [status, setStatus] = useState<{
    type: 'idle' | 'progress' | 'success' | 'error';
    title: string;
    message: string;
    details?: string[];
  }>({
    type: 'idle',
    title: 'Ready to Create Portfolio',
    message: 'Click the button below to execute your portfolio creation using real Jupiter swaps.'
  });

  // Create portfolio and positions in Supabase with actual trade results
  const createPortfolioInDatabase = async (
    tradeResults: Array<{symbol: string, success: boolean, signature?: string, error?: string, tokensReceived?: number, solSpent?: number, pricePerToken?: number, actualValue?: number}>, 
    allocation: any[]
  ) => {
    if (!user?.id || !publicKey) {
      throw new Error('User or wallet not available');
    }

    // Supabase removed - portfolio creation is now frontend-only
    console.log('[DB] Portfolio creation skipped - using frontend-only approach');
    console.log('[DB] Trade results logged:', tradeResults);
    
    // Calculate actual total value from successful trades
    const actualTotalValue = tradeResults
      .filter(result => result.success && result.actualValue)
      .reduce((sum, result) => sum + (result.actualValue || 0), 0);

    console.log('[DB] Portfolio would have been created with actual value:', actualTotalValue);
    
    // Mock portfolio ID for compatibility
    const portfolioId = `mock-portfolio-${Date.now()}`;

    // Transaction logging is now handled in useJupiterTrading
    console.log('[DB] Transaction logging skipped - handled by trading hooks');
    
    // Return mock portfolio data for compatibility
    return {
      id: portfolioId,
      user_id: user.id,
      wallet_address: publicKey.toBase58(),
      risk_level: formData.riskTolerance,
      initial_investment: formData.initialInvestment,
      total_value: actualTotalValue,
      is_active: true
    };
  };

  // Helper function to get token address from symbol
  const getTokenAddress = (symbol: string): string => {
    const addressMap: Record<string, string> = {
      'AAPLx': 'XsbEhLAtcf6HdfpFZ5xEMdqW8nfAvcsP5bdudRLJzJp',
      'TSLAx': 'XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB',
      'GOOGLx': 'XsCPL9dNWBMvFtTmwcCA5v3xWPSMEBCszbQdiLLq6aN',
      'AMZNx': 'Xs3eBt7uRfJX8QUs4suhyU8p2M6DoUDrJyWBa8LLZsg',
      'PGx': 'XsYdjDjNUygZ7yGKfQaB6TxLh2gC6RRjzLtLAGJrhzV',
      'UNHx': 'XszvaiXGPwvk2nwb3o9C1CX4K6zH8sez11E6uyup6fe',
      'Vx': 'XsqgsbXwWogGJsNcVZ3TyVouy2MbTkfCFhCGGcQZ2p',
      'WMTx': 'Xs151QeqTCiuKtinzfRATnUESM2xTU6V9Wy8Vy538ci'
    };
    return addressMap[symbol] || '';
  };

  const handleExecuteTrades = async () => {
    setIsExecuting(true);
    setStatus({
      type: 'progress',
      title: 'Creating Portfolio...',
      message: 'Executing Jupiter swaps for your xStock positions',
      details: ['🔄 Initializing portfolio creation...']
    });
    
    try {
      // Check SOL balance first
      if (!publicKey || !connected) {
        throw new Error('Wallet not connected');
      }

      setStatus(prev => ({
        ...prev,
        details: [...(prev.details || []), '💰 Checking SOL balance...']
      }));

      const connection = new Connection(getTradingRpcUrl(), 'confirmed');
      const balance = await connection.getBalance(publicKey);
      const solBalance = balance / 1e9;
      
      console.log(`[PORTFOLIO] SOL Balance: ${solBalance}`);
      
      if (solBalance < 0.05) {
        throw new Error(`Insufficient SOL balance: ${solBalance.toFixed(4)} SOL. Need at least 0.05 SOL for multiple transactions.`);
      }

      const allocation = calculatePortfolioAllocation(formData.riskTolerance, formData.initialInvestment);
      console.log('[EXECUTE] Starting portfolio creation with allocation:', allocation);
      
      setStatus(prev => ({
        ...prev,
        details: [...(prev.details || []), `📊 Processing ${allocation.length} positions...`]
      }));

      let successCount = 0;
      const results: Array<{symbol: string, success: boolean, signature?: string, error?: string, tokensReceived?: number, solSpent?: number, pricePerToken?: number, actualValue?: number}> = [];
      
      // Execute each position using the same buyXStock as TradingModal
      for (let i = 0; i < allocation.length; i++) {
        const position = allocation[i];
        const stockSymbol = position.symbol.replace('x', '') + 'x'; // Ensure correct format
        
        // Convert USDC amount to SOL amount with more realistic conversion
        const solPrice = 200; // You might want to fetch this dynamically
        const solAmount = position.usdcAmount / solPrice;
        
        setStatus(prev => ({
          ...prev,
          details: [...(prev.details || []), `💰 Buying ${stockSymbol}: ${solAmount.toFixed(4)} SOL...`]
        }));

        try {
          console.log(`[PORTFOLIO] Buying ${stockSymbol} with ${solAmount.toFixed(4)} SOL (was ${position.usdcAmount} USDC)`);
          
          const swapResult = await buyXStock(stockSymbol, solAmount, undefined, 'SOL');
          
          if (swapResult && swapResult.signature) {
            successCount++;
            
            // Calculate actual tokens received and price paid
            const tokensReceived = parseFloat(swapResult.outputAmount) / Math.pow(10, 6); // xStocks have 6 decimals
            const solSpent = parseFloat(swapResult.inputAmount) / Math.pow(10, 9); // SOL has 9 decimals
            const pricePerToken = solSpent / tokensReceived * 200; // Convert SOL to USD (approximate)
            
            results.push({ 
              symbol: stockSymbol, 
              success: true, 
              signature: swapResult.signature,
              tokensReceived: tokensReceived,
              solSpent: solSpent,
              pricePerToken: pricePerToken,
              actualValue: tokensReceived * pricePerToken
            });
            
            setStatus(prev => ({
              ...prev,
              details: [...(prev.details || []), `✅ ${stockSymbol}: ${tokensReceived.toFixed(6)} tokens @ $${pricePerToken.toFixed(2)} each`]
            }));
          } else {
            throw new Error('No transaction signature returned');
          }
          
          // Longer delay between trades to avoid rate limits
          if (i < allocation.length - 1) {
            setStatus(prev => ({
              ...prev,
              details: [...(prev.details || []), `⏱️ Waiting 3 seconds before next trade...`]
            }));
            await new Promise(resolve => setTimeout(resolve, 3000));
          }
          
        } catch (error) {
          console.error(`Failed to buy ${stockSymbol}:`, error);
          results.push({ 
            symbol: stockSymbol, 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          });
          
          setStatus(prev => ({
            ...prev,
            details: [...(prev.details || []), `❌ ${stockSymbol} failed: ${error instanceof Error ? error.message : 'Unknown error'}`]
          }));
        }
      }

      // Final status based on results - treat partial success as success
      if (successCount > 0) {
        const isPartialSuccess = successCount < allocation.length;
        
        // Calculate actual total value from successful trades
        const actualTotalValue = results
          .filter(result => result.success && result.actualValue)
          .reduce((sum, result) => sum + (result.actualValue || 0), 0);
        
        setStatus({
          type: 'success',
          title: isPartialSuccess 
            ? `Portfolio Created with ${successCount}/${allocation.length} Positions! 🎉` 
            : 'Portfolio Created Successfully! 🎉',
          message: isPartialSuccess
            ? `${successCount} positions were created successfully. You can add the remaining positions later from the Markets page.`
            : `All ${successCount} positions have been created in your wallet.`,
          details: [
            `💼 ${successCount} xStock positions acquired`,
            `💰 Actual portfolio value: $${actualTotalValue.toFixed(2)} (planned: $${formData.initialInvestment})`,
            `🎯 Risk level: ${formData.riskTolerance}/10`,
            '🔗 All transactions recorded on Solana blockchain',
            isPartialSuccess 
              ? `⚠️ ${allocation.length - successCount} positions failed - you can purchase them manually later`
              : '✅ All positions created successfully',
            '📊 Creating portfolio records in database...'
          ]
        });
        
        // Complete the onboarding flow for ANY successful positions
        setTimeout(() => {
          onComplete(formData);
        }, 2000);
        
        // Create portfolio and positions in Supabase with actual trade data (in background)
        setTimeout(async () => {
          try {
            await createPortfolioInDatabase(results, allocation);
            console.log('[DB] Portfolio records created successfully in background');
          } catch (dbError) {
            console.error('Background database error:', dbError);
          }
        }, 500);
        
      } else {
        // Only show complete failure if NO positions were created
        setStatus({
          type: 'error',
          title: 'Portfolio Creation Failed',
          message: 'No positions were created successfully.',
          details: [
            '❌ All swaps failed',
            '💡 Check your SOL balance and network connection',
            '🔄 Try again with a smaller investment amount',
            '💰 Make sure you have at least 0.05 SOL for transaction fees'
          ]
        });
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('[EXECUTE] Error:', err);
      
      setStatus({
        type: 'error',
        title: 'Portfolio Creation Failed',
        message: errorMessage,
        details: [
          '❌ Unexpected error occurred',
          '💡 Please try again or contact support',
          `🐛 Error: ${errorMessage}`
        ]
      });
    } finally {
      setIsExecuting(false);
    }
  };

  // Consolidated Status Display Component
  const StatusDisplay = () => {
    const getStatusStyles = () => {
      switch (status.type) {
        case 'progress':
          return {
            container: 'bg-blue-50 border-blue-200',
            icon: 'text-blue-600',
            title: 'text-blue-900',
            message: 'text-blue-800'
          };
        case 'success':
          return {
            container: 'bg-green-50 border-green-200',
            icon: 'text-green-600',
            title: 'text-green-900',
            message: 'text-green-800'
          };
        case 'error':
          return {
            container: 'bg-red-50 border-red-200',
            icon: 'text-red-600',
            title: 'text-red-900',
            message: 'text-red-800'
          };
        default:
          return {
            container: 'bg-gray-50 border-gray-200',
            icon: 'text-gray-600',
            title: 'text-gray-900',
            message: 'text-gray-700'
          };
      }
    };

    const styles = getStatusStyles();

    return (
      <Card className="minimal-card">
        <CardContent className={`p-4 border rounded-lg ${styles.container}`}>
          <div className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              status.type === 'progress' ? 'bg-blue-100' : 
              status.type === 'success' ? 'bg-green-100' : 
              status.type === 'error' ? 'bg-red-100' : 'bg-gray-100'
            }`}>
              {status.type === 'progress' ? (
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              ) : status.type === 'success' ? (
                <CheckCircle className={`h-5 w-5 ${styles.icon}`} />
              ) : status.type === 'error' ? (
                <AlertCircle className={`h-5 w-5 ${styles.icon}`} />
              ) : (
                <TrendingUp className={`h-5 w-5 ${styles.icon}`} />
              )}
            </div>
            
            <div className="flex-1">
              <h4 className={`font-semibold text-base mb-1 ${styles.title}`}>{status.title}</h4>
              <p className={`text-sm mb-2 ${styles.message}`}>{status.message}</p>
              
              {status.details && status.details.length > 0 && (
                <div className="space-y-1">
                  {status.details.map((detail, index) => (
                    <div key={index} className={`text-xs ${styles.message}`}>
                      {detail}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-xl font-bold mb-2">Execute Portfolio Creation</h3>
        <p className="text-gray-600 text-sm">
          Create your portfolio using the same proven Jupiter system as individual trades.
        </p>
      </div>

      {/* Portfolio Summary */}
      <Card className="minimal-card">
        <CardHeader className="border-b border-gray-200 pb-3">
          <CardTitle className="text-base">Portfolio Summary</CardTitle>
          <CardDescription className="text-sm">Review your final allocation before execution</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-gray-900">${formData.initialInvestment}</div>
              <div className="text-xs text-gray-600">Total Investment</div>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{formData.riskTolerance}/10</div>
              <div className="text-xs text-gray-600">Risk Level</div>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {calculatePortfolioAllocation(formData.riskTolerance, formData.initialInvestment).length}
              </div>
              <div className="text-xs text-gray-600">xStock Positions</div>
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Wallet Connection Check */}
      {!connected || !publicKey ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-red-200 rounded-full flex items-center justify-center">
              <span className="text-red-800 text-xs font-bold">!</span>
            </div>
            <p className="text-red-800 font-medium text-sm">
              Wallet not connected. Please connect your Solana wallet to proceed.
            </p>
          </div>
        </div>
      ) : null}

      {/* Consolidated Status Display */}
      <StatusDisplay />

      {/* Execute Button - Only show if not already executing and wallet is connected */}
      {connected && publicKey && !isExecuting && status.type !== 'success' && (
        <div className="flex justify-center">
          <Button
            onClick={handleExecuteTrades}
            disabled={isExecuting || jupiterLoading}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-base font-semibold"
          >
            {isExecuting || jupiterLoading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Creating Portfolio...
              </>
            ) : (
              <>
                <TrendingUp className="h-5 w-5 mr-2" />
                Execute Portfolio Creation
              </>
            )}
          </Button>
        </div>
      )}

      {/* Success Actions */}
      {status.type === 'success' && (
        <div className="flex justify-center">
          <div className="text-center">
            <div className="text-green-600 font-semibold mb-2">
              🎉 Portfolio Created Successfully!
            </div>
            <div className="text-sm text-gray-600">
              Redirecting to your portfolio in a few seconds...
            </div>
          </div>
        </div>
      )}

      {/* Error Actions */}
      {status.type === 'error' && (
        <div className="flex justify-center">
          <Button
            onClick={() => {
              setStatus({
                type: 'idle',
                title: 'Ready to Create Portfolio',
                message: 'Click the button below to execute your portfolio creation using real Jupiter swaps.'
              });
            }}
            variant="outline"
            className="px-6 py-2"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Disclaimer */}
      <div className="text-center text-xs text-gray-500 max-w-xl mx-auto">
        By proceeding, you acknowledge that this involves real cryptocurrency transactions on the Solana blockchain. 
        Ensure you have sufficient USDC balance and understand the risks involved.
      </div>
    </div>
  );
}
