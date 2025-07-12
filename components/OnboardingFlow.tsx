"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, ArrowLeft, TrendingUp, Shield, Target, CheckCircle, Loader2 } from "lucide-react"
import { WalletConnectButton } from "./WalletConnectButton"
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletAuth } from '@/hooks/useWalletAuth'

export interface OnboardingData {
  riskTolerance: number
  initialInvestment: number
  portfolioName: string
  rebalanceFrequency: "daily" | "weekly" | "monthly"
  autoRebalance: boolean
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
      title: "Portfolio Setup",
      description: "Configure your portfolio settings",
      component: PortfolioSetupStep,
    },
    {
      title: "Review & Confirm",
      description: "Review your settings and confirm",
      component: ReviewStep,
    },
  ]

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Final step - create user profile and portfolio
      setIsCreating(true)
      try {
        await createUserProfile(formData.riskTolerance, formData.initialInvestment)
        onComplete(formData)
      } catch (error) {
        console.error('Error creating user profile:', error)
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
        return formData.portfolioName.trim().length > 0
      default:
        return true
    }
  }

  const CurrentStepComponent = steps[currentStep].component

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          {/* Progress Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Portfolio Setup
            </h1>
            <div className="flex items-center justify-center space-x-2 mb-4">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index <= currentStep ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
            <Progress value={((currentStep + 1) / steps.length) * 100} className="w-full" />
            <p className="text-sm text-gray-600 mt-2">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>

          {/* Step Content */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  {currentStep + 1}
                </span>
                {steps[currentStep].title}
              </CardTitle>
              <CardDescription>
                {steps[currentStep].description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CurrentStepComponent
                formData={formData}
                setFormData={setFormData}
                connected={connected}
                publicKey={publicKey}
                isAuthenticated={isAuthenticated}
              />
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center"
              disabled={isCreating}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed() || isCreating}
              className="flex items-center"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Profile...
                </>
              ) : (
                <>
                  {currentStep === steps.length - 1 ? "Complete Setup" : "Next"}
                  <ArrowRight className="ml-2 h-4 w-4" />
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

function ReviewStep({ formData, connected, publicKey }: any) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Review Your Settings</h3>
        <p className="text-gray-600">
          Please review your portfolio configuration before proceeding
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium mb-3">Portfolio Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Portfolio Name:</span>
              <span className="font-medium">{formData.portfolioName}</span>
            </div>
            <div className="flex justify-between">
              <span>Risk Level:</span>
              <span className="font-medium">{formData.riskTolerance}/10</span>
            </div>
            <div className="flex justify-between">
              <span>Initial Investment:</span>
              <span className="font-medium">${formData.initialInvestment} USDC</span>
            </div>
            <div className="flex justify-between">
              <span>Rebalancing:</span>
              <span className="font-medium capitalize">{formData.rebalanceFrequency}</span>
            </div>
            <div className="flex justify-between">
              <span>Wallet:</span>
              <span className="font-medium font-mono">
                {publicKey ? `${publicKey.toString().slice(0, 8)}...${publicKey.toString().slice(-8)}` : 'Not connected'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            <strong>Ready to start!</strong> Your portfolio will be created with these settings. 
            You can modify them later in the settings page.
          </p>
        </div>
      </div>
    </div>
  )
}
