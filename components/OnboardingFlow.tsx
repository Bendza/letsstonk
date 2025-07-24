"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, ArrowLeft, TrendingUp, Shield, Target, CheckCircle, Loader2, DollarSign, PieChart } from "lucide-react"
import { WalletConnectButton } from "./WalletConnectButton"
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletAuth } from '@/hooks/useWalletAuth'
import { useJupiterSwap } from '@/hooks/useJupiterSwap'

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
    getPortfolioQuotes, 
    createPortfolio,
    testXStockAvailability,
    isLoading: isSwapLoading, 
    error: swapError 
  } = useJupiterSwap()

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
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Progress Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              PORTFOLIO SETUP
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Let's create your personalized stock portfolio
            </p>
            <div className="flex items-center justify-center space-x-3 mb-6">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index <= currentStep ? "bg-gray-900" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
            <Progress value={((currentStep + 1) / steps.length) * 100} className="w-full max-w-md mx-auto" />
            <p className="text-sm text-gray-500 mt-3 uppercase tracking-wide">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>

          {/* Step Content */}
          <Card className="minimal-card card-shadow mb-8">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center text-2xl">
                <span className="bg-gray-900 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold mr-4">
                  {currentStep + 1}
                </span>
                {steps[currentStep].title}
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 ml-16">
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
                getPortfolioQuotes={getPortfolioQuotes}
                createPortfolio={createPortfolio}
                jupiterLoading={isSwapLoading}
              />
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center px-8 py-3 text-base"
              disabled={isCreating}
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed() || isCreating || isSwapLoading}
              className="flex items-center px-8 py-3 text-base bg-gray-900 hover:bg-gray-800"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating Portfolio...
                </>
              ) : (
                <>
                  {currentStep === steps.length - 1 ? "Complete Setup" : "Next"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
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

function PortfolioPreviewStep({ formData, calculatePortfolioAllocation, getPortfolioQuotes, jupiterLoading }: any) {
  const [allocation, setAllocation] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllocationAndQuotes = async () => {
      try {
        const allocationResult = calculatePortfolioAllocation(formData.riskTolerance, formData.initialInvestment);
        setAllocation(allocationResult);

        const quotesResult = await getPortfolioQuotes(allocationResult);
        setQuotes(quotesResult);
      } catch (err) {
        setError('Failed to fetch portfolio allocation or quotes.');
        console.error(err);
      }
    };

    fetchAllocationAndQuotes();
  }, [calculatePortfolioAllocation, getPortfolioQuotes, formData.riskTolerance, formData.initialInvestment]);

  if (jupiterLoading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-12 w-12 text-gray-600 animate-spin mx-auto" />
        <p className="text-lg text-gray-600 mt-4">Calculating portfolio allocation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        <p>{error}</p>
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
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <PieChart className="h-8 w-8 text-gray-600" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Portfolio Preview</h3>
        <p className="text-gray-600">
          Review your portfolio allocation based on risk level {formData.riskTolerance}
        </p>
        
        {/* Test xStock availability button */}
        <div className="mt-4">
          <Button
            onClick={async () => {
              // This will be available once we pass the test function down
            }}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            Test xStock Availability
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allocation.map((item: any, index: number) => (
          <div key={index} className="bg-gray-50 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-bold text-lg">{item.symbol}</h4>
              <Badge className="bg-gray-200 text-gray-900">{item.allocation}%</Badge>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>USDC Amount:</span>
                <span className="font-medium">${item.usdcAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Est. Tokens:</span>
                <span className="font-medium">{item.estimatedTokens || 'Loading...'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-blue-800 text-sm font-bold">i</span>
          </div>
          <div>
            <p className="text-blue-800 font-medium mb-1">Portfolio Summary</p>
            <p className="text-blue-700 text-sm">
              Total Investment: <strong>${formData.initialInvestment} USDC</strong><br/>
              Risk Level: <strong>{formData.riskTolerance}/10</strong><br/>
              Stocks: <strong>{allocation.length} different companies</strong>
            </p>
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

function ExecuteTradesStep({ formData, connected, publicKey, createPortfolio, jupiterLoading, calculatePortfolioAllocation }: any) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleExecuteTrades = async () => {
    setIsExecuting(true);
    setError(null);
    setSuccess(null);
    try {
      const allocation = calculatePortfolioAllocation(formData.riskTolerance, formData.initialInvestment);
      const result = await createPortfolio(allocation);

      if (result.success) {
        setSuccess('Portfolio created successfully!');
        // Optionally, redirect to dashboard or show a success message
      } else {
        throw new Error(result.error || 'Failed to create portfolio');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError('Failed to execute trades: ' + errorMessage);
      console.error(err);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Execute Trades</h3>
        <p className="text-gray-600">
          Create your portfolio with the settings you've chosen.
        </p>
      </div>

      {/* Demo Mode Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-blue-800 text-sm font-bold">ℹ</span>
          </div>
          <div>
            <p className="text-blue-800 font-medium mb-1">Demo Mode</p>
            <p className="text-blue-700 text-sm">
              This demo uses <strong>mock portfolio creation</strong> since real xStock tokens from Backed Finance 
              may not be available on Jupiter DEX yet. In production, this would execute actual swaps to purchase 
              tokenized stocks.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={handleExecuteTrades}
          disabled={!connected || !publicKey || isExecuting || jupiterLoading}
          className="flex items-center px-8 py-3 text-base bg-green-600 hover:bg-green-700"
        >
          {isExecuting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Creating Portfolio...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-5 w-5" />
              Create Demo Portfolio
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
          <p>{success}</p>
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-amber-800 text-sm">
          <strong>Note:</strong> This is a demonstration of the portfolio creation flow. 
          In production, you would need sufficient USDC balance and the xStock tokens would 
          need to be available on Jupiter DEX for actual trading.
        </p>
      </div>
    </div>
  );
}
