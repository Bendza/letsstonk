"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, ArrowLeft, TrendingUp, Shield, Target, CheckCircle, Loader2, DollarSign, PieChart as PieChartIcon, BarChart3, AlertCircle } from "lucide-react"
import { WalletConnectButton } from "./WalletConnectButton"
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletAuth } from '@/hooks/useWalletAuth'
import { useJupiterSwap } from '@/hooks/useJupiterSwap'
import { useJupiterTrading } from '@/hooks/useJupiterTrading'
import { ResponsiveContainer, Pie, PieChart, Cell, Tooltip } from 'recharts';

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
    initialInvestment: 1000,
    portfolioName: "My Portfolio",
    rebalanceFrequency: "weekly",
    autoRebalance: true,
  })

  const { connected, publicKey } = useWallet()
  const { isAuthenticated, createUserProfile } = useWalletAuth()
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
    buyXStock, 
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
        
        // Calculate portfolio allocation
        const allocation = calculatePortfolioAllocation(formData.riskTolerance, formData.initialInvestment)
        
        // Execute trades via Jupiter
        const result = await createPortfolio(allocation)
        
        if (result.success) {
          onComplete(formData)
        } else {
          throw new Error(result.error || 'Failed to create portfolio')
        }
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
    <div className="bg-white">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Progress Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 tracking-tight">
            PORTFOLIO SETUP
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Let's create your personalized stock portfolio
          </p>
          <div className="flex items-center justify-center space-x-2 mb-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index <= currentStep ? "bg-gray-900" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
          <Progress value={((currentStep + 1) / steps.length) * 100} className="w-full max-w-sm mx-auto mb-2" />
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        {/* Step Content */}
        <Card className="minimal-card card-shadow mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-xl">
              <span className="bg-gray-900 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold mr-3">
                {currentStep + 1}
              </span>
              {steps[currentStep].title}
            </CardTitle>
            <CardDescription className="text-base text-gray-600 ml-13">
              {steps[currentStep].description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <CurrentStepComponent
              formData={formData}
              setFormData={setFormData}
              connected={connected}
              publicKey={publicKey}
              isAuthenticated={isAuthenticated}
              calculatePortfolioAllocation={calculatePortfolioAllocation}
              calculatePortfolioAllocationWithPrices={calculatePortfolioAllocationWithPrices}
              getPortfolioQuotes={getPortfolioQuotes}
              buyXStock={buyXStock}
              jupiterLoading={isSwapLoading || jupiterLoading}
            />
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={isCreating}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {currentStep === 0 ? "Back to Dashboard" : "Previous"}
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed() || isCreating}
            className="flex items-center btn-primary"
          >
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : currentStep === steps.length - 1 ? (
              <>
                Complete Setup
                <CheckCircle className="h-4 w-4 ml-2" />
              </>
            ) : (
              <>
                Next Step
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

// Step Components
function ConnectWalletStep({ connected, publicKey, isAuthenticated }: any) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Secure Wallet Connection</h3>
        <p className="text-gray-600 mb-6">
          Connect your Solana wallet and authenticate to access SolStock's automated trading features
        </p>
      </div>

      <div className="flex justify-center">
        <WalletConnectButton />
      </div>

      {connected && !isAuthenticated && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-yellow-600 mr-2" />
            <span className="text-yellow-800 font-medium">Wallet Connected - Please Authenticate</span>
          </div>
          <p className="text-yellow-700 text-sm mt-1">
            Click the "Authenticate" button above to complete the connection
          </p>
        </div>
      )}

      {connected && isAuthenticated && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-800 font-medium">Wallet Connected & Authenticated</span>
          </div>
          <p className="text-green-700 text-sm mt-1">
            {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}
          </p>
        </div>
      )}
    </div>
  )
}

function RiskToleranceStep({ formData, setFormData }: any) {
  const riskLevels = [
    { level: 1, label: "Very Conservative", description: "Minimal risk, stable returns" },
    { level: 3, label: "Conservative", description: "Low risk, steady growth" },
    { level: 5, label: "Moderate", description: "Balanced risk and return" },
    { level: 7, label: "Aggressive", description: "Higher risk, higher potential returns" },
    { level: 10, label: "Very Aggressive", description: "Maximum risk, maximum potential" },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="h-8 w-8 text-orange-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Risk Assessment</h3>
        <p className="text-gray-600">
          Choose your risk tolerance level to optimize your portfolio allocation
        </p>
      </div>

      <div className="space-y-4">
        <Label htmlFor="risk-slider" className="text-base font-medium">
          Risk Level: {formData.riskTolerance}
        </Label>
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
          <span>Conservative</span>
          <span>Aggressive</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {riskLevels.map((risk) => (
          <div
            key={risk.level}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              formData.riskTolerance === risk.level
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setFormData({ ...formData, riskTolerance: risk.level })}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{risk.label}</span>
              <Badge variant={formData.riskTolerance === risk.level ? "default" : "secondary"}>
                {risk.level}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">{risk.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function InvestmentStep({ formData, setFormData }: any) {
  const presetAmounts = [100, 500, 1000, 5000, 10000]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Initial Investment</h3>
        <p className="text-gray-600">
          Set your initial investment amount in USDC
        </p>
      </div>

      <div className="space-y-4">
        <Label htmlFor="investment-amount" className="text-base font-medium">
          Investment Amount (USDC)
        </Label>
        <Input
          id="investment-amount"
          type="number"
          value={formData.initialInvestment}
          onChange={(e) => setFormData({ ...formData, initialInvestment: Number(e.target.value) })}
          placeholder="Enter amount"
          className="text-lg"
        />
      </div>

      <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
        {presetAmounts.map((amount) => (
          <Button
            key={amount}
            variant={formData.initialInvestment === amount ? "default" : "outline"}
            onClick={() => setFormData({ ...formData, initialInvestment: amount })}
            className="text-sm"
          >
            ${amount}
          </Button>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          <strong>Note:</strong> You can add more funds to your portfolio at any time after setup.
        </p>
      </div>
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
                      {item.allocation}%
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="text-gray-500 text-xs uppercase tracking-wide mb-1">Investment</div>
                      <div className="font-semibold text-sm">${item.usdcAmount.toFixed(0)}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs uppercase tracking-wide mb-1">Current Price</div>
                      <div className="font-semibold text-sm">
                        {item.currentPrice > 0 ? `$${item.currentPrice.toFixed(2)}` : 'Loading...'}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-gray-500 text-xs uppercase tracking-wide mb-1">Estimated Tokens</div>
                      <div className="font-semibold text-sm">
                        {item.estimatedTokens > 0 ? item.estimatedTokens.toFixed(4) : 'Calculating...'}
                      </div>
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

      {/* Portfolio Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-blue-900 font-semibold text-base mb-2">Portfolio Summary</h4>
            <div className="grid md:grid-cols-3 gap-3 text-sm">
              <div>
                <div className="text-blue-700 font-medium">Total Investment</div>
                <div className="text-blue-900 text-base font-bold">${formData.initialInvestment} USDC</div>
              </div>
              <div>
                <div className="text-blue-700 font-medium">Risk Profile</div>
                <div className="text-blue-900 text-base font-bold">
                  {formData.riskTolerance <= 3 ? 'Conservative' : 
                   formData.riskTolerance <= 6 ? 'Moderate' : 
                   formData.riskTolerance <= 8 ? 'Aggressive' : 'Very Aggressive'}
                </div>
              </div>
              <div>
                <div className="text-blue-700 font-medium">Diversification</div>
                <div className="text-blue-900 text-base font-bold">{allocation.length} Stocks</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-blue-200">
              <div className="text-blue-700 text-xs">
                This allocation is designed for your risk level with focus on 
                <strong> {allocation[0]?.symbol}</strong> ({allocation[0]?.allocation}% allocation) as the primary holding.
              </div>
            </div>
          </div>
        </div>
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

function ExecuteTradesStep({ formData, connected, publicKey, calculatePortfolioAllocation, buyXStock, jupiterLoading }: any) {
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

  const handleExecuteTrades = async () => {
    setIsExecuting(true);
    setStatus({
      type: 'progress',
      title: 'Creating Portfolio...',
      message: 'Executing Jupiter swaps for your xStock positions',
      details: ['🔄 Initiating Jupiter swaps...']
    });
    
    try {
      const allocation = calculatePortfolioAllocation(formData.riskTolerance, formData.initialInvestment);
      console.log('[EXECUTE] Starting portfolio creation with allocation:', allocation);
      
      setStatus(prev => ({
        ...prev,
        details: [...(prev.details || []), `📊 Processing ${allocation.length} positions...`]
      }));

      let successCount = 0;
      const results = [];
      
      // Execute each position using the same buyXStock as TradingModal
      for (let i = 0; i < allocation.length; i++) {
        const position = allocation[i];
        const stockSymbol = position.symbol.replace('x', '') + 'x'; // Ensure correct format
        
        setStatus(prev => ({
          ...prev,
          details: [...(prev.details || []), `💰 Buying ${stockSymbol}: $${position.usdcAmount.toFixed(0)} USDC...`]
        }));

        try {
          // Use the exact same function as TradingModal!
          const signature = await buyXStock(stockSymbol, position.usdcAmount, undefined, 'USDC');
          
          if (signature) {
            successCount++;
            results.push({ symbol: stockSymbol, success: true, signature });
            setStatus(prev => ({
              ...prev,
              details: [...(prev.details || []), `✅ ${stockSymbol} purchased successfully!`]
            }));
          } else {
            throw new Error('No transaction signature returned');
          }
          
          // Small delay between trades
          if (i < allocation.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
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

      // Final status based on results
      if (successCount === allocation.length) {
        setStatus({
          type: 'success',
          title: 'Portfolio Created Successfully! 🎉',
          message: `All ${successCount} positions have been created in your wallet.`,
          details: [
            `💼 ${successCount} xStock positions acquired`,
            `💰 Total investment: $${formData.initialInvestment} USDC`,
            `🎯 Risk level: ${formData.riskTolerance}/10`,
            '🔗 All transactions recorded on Solana blockchain'
          ]
        });
      } else if (successCount > 0) {
        setStatus({
          type: 'error',
          title: 'Partial Portfolio Creation',
          message: `${successCount}/${allocation.length} positions created successfully.`,
          details: [
            `✅ Successful: ${successCount} positions`,
            `❌ Failed: ${allocation.length - successCount} positions`,
            '⚠️ Some positions may be missing from your portfolio'
          ]
        });
      } else {
        setStatus({
          type: 'error',
          title: 'Portfolio Creation Failed',
          message: 'No positions were created successfully.',
          details: [
            '❌ All swaps failed',
            '💡 Check your USDC balance and network connection',
            '🔄 Try again with a smaller investment amount'
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

      {/* Jupiter Trading Notice */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-green-900 font-semibold mb-2 text-sm">Same Trading Engine as Markets</p>
            <p className="text-green-800 text-xs mb-2">
              This uses the <strong>identical buyXStock() function</strong> as individual trades on the Markets page. 
              Each position will be purchased separately using proven Jupiter swaps.
            </p>
            <div className="text-green-700 text-xs space-y-1">
              <div>• Exact same code path as Markets → TradingModal</div>
              <div>• Each xStock purchased individually for reliability</div>
              <div>• No simulation issues - direct API integration</div>
            </div>
          </div>
        </div>
      </div>

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

      {/* Execute Button */}
      <div className="flex justify-center pt-2">
        <Button
          onClick={handleExecuteTrades}
          disabled={!connected || !publicKey || isExecuting || jupiterLoading}
          className="flex items-center px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
        >
          {isExecuting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Portfolio...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Execute Portfolio Creation
            </>
          )}
        </Button>
      </div>

      {/* Disclaimer */}
      <div className="text-center text-xs text-gray-500 max-w-xl mx-auto">
        By proceeding, you acknowledge that this involves real cryptocurrency transactions on the Solana blockchain. 
        Ensure you have sufficient USDC balance and understand the risks involved.
      </div>
    </div>
  );
}
