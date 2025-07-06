"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wallet, Settings, DollarSign, CheckCircle, ArrowRight, ArrowLeft, AlertTriangle } from "lucide-react"
import { MockWalletButton } from "./MockWalletButton"
import { useMockWallet } from "./MockWalletProvider"
import { getAllocationForRisk } from "../lib/risk-engine"

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void
  onBack: () => void
}

export interface OnboardingData {
  walletAddress: string
  riskLevel: number
  initialInvestment: number
  autoRebalance: boolean
}

const steps = [
  { id: 1, title: "Connect Wallet", icon: Wallet },
  { id: 2, title: "Set Risk Profile", icon: Settings },
  { id: 3, title: "Initial Investment", icon: DollarSign },
  { id: 4, title: "Review & Confirm", icon: CheckCircle },
]

export function OnboardingFlow({ onComplete, onBack }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [riskLevel, setRiskLevel] = useState(7)
  const [initialInvestment, setInitialInvestment] = useState("")
  const [autoRebalance, setAutoRebalance] = useState(true)

  const { connected, publicKey } = useMockWallet()

  const progress = (currentStep / steps.length) * 100
  const allocation = getAllocationForRisk(riskLevel)
  const investmentAmount = Number.parseFloat(initialInvestment) || 0

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    if (connected && publicKey) {
      onComplete({
        walletAddress: publicKey.toString(),
        riskLevel,
        initialInvestment: investmentAmount,
        autoRebalance,
      })
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return connected
      case 2:
        return riskLevel >= 1 && riskLevel <= 10
      case 3:
        return investmentAmount >= 1 && investmentAmount <= 1000000
      case 4:
        return true
      default:
        return false
    }
  }

  const currentStepIcon = steps[currentStep - 1].icon
  const currentStepTitle = steps[currentStep - 1].title

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center py-12">
          <Button variant="ghost" onClick={onBack} className="absolute left-6 top-12 btn-secondary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            BACK TO HOME
          </Button>
          <h1 className="text-4xl font-bold mb-4 tracking-tight">SETUP YOUR INVESTMENT ACCOUNT</h1>
          <p className="text-gray-600">Complete these steps to start automated investing</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <Progress value={progress} className="h-1 mb-8 bg-gray-200" />
          <div className="flex justify-between">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center gap-3 ${step.id <= currentStep ? "text-gray-900" : "text-gray-400"}`}
              >
                <div
                  className={`w-10 h-10 flex items-center justify-center font-bold ${
                    step.id <= currentStep ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {step.id < currentStep ? <CheckCircle className="h-5 w-5" /> : step.id}
                </div>
                <span className="hidden sm:block font-semibold uppercase tracking-wide text-sm">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="minimal-card mb-12">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="flex items-center gap-3 heading-lg">
              <currentStepIcon className="h-6 w-6" />
              {currentStepTitle.toUpperCase()}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {/* Step 1: Connect Wallet */}
            {currentStep === 1 && (
              <div className="text-center space-y-8">
                <div>
                  <h3 className="heading-lg mb-4">CONNECT YOUR SOLANA WALLET</h3>
                  <p className="body-md text-gray-600 mb-8">
                    Connect your wallet to securely manage your investments on Solana
                  </p>
                </div>

                <MockWalletButton />

                {connected && (
                  <Alert className="border-gray-900 bg-gray-50 max-w-md mx-auto">
                    <CheckCircle className="h-4 w-4 text-gray-900" />
                    <AlertDescription className="text-gray-900 font-semibold">
                      WALLET CONNECTED SUCCESSFULLY
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {/* Step 2: Risk Profile */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="heading-lg mb-4">SET YOUR RISK PROFILE</h3>
                  <p className="body-md text-gray-600">
                    Choose your risk tolerance to automatically diversify your portfolio
                  </p>
                </div>

                <div className="max-w-2xl mx-auto">
                  <div className="bg-gray-50 p-8 mb-8">
                    <div className="flex items-center justify-between mb-6">
                      <Label className="font-semibold">RISK LEVEL</Label>
                      <div className="text-2xl font-bold">{riskLevel}</div>
                    </div>

                    <div className="relative mb-6">
                      <Slider
                        value={[riskLevel]}
                        onValueChange={(value) => setRiskLevel(value[0])}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>CONSERVATIVE</span>
                        <span>AGGRESSIVE</span>
                      </div>
                    </div>

                    <Button className="btn-primary w-full">SET RISK PROFILE</Button>
                  </div>

                  {/* Portfolio Preview */}
                  <div className="minimal-card p-6">
                    <h4 className="font-semibold mb-4 uppercase tracking-wide">PORTFOLIO ALLOCATION</h4>
                    <div className="space-y-3">
                      {allocation.map((item) => (
                        <div
                          key={item.symbol}
                          className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                        >
                          <span className="font-semibold">{item.symbol}</span>
                          <span className="text-gray-600">{item.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Initial Investment */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="heading-lg mb-4">INITIAL INVESTMENT AMOUNT</h3>
                  <p className="body-md text-gray-600">Enter the amount of USDC you want to invest initially</p>
                </div>

                <div className="max-w-md mx-auto">
                  <div className="bg-gray-50 p-8 mb-8">
                    <Label htmlFor="investment" className="font-semibold mb-4 block">
                      INVESTMENT AMOUNT
                    </Label>
                    <div className="relative mb-6">
                      <Input
                        id="investment"
                        type="number"
                        placeholder="500"
                        value={initialInvestment}
                        onChange={(e) => setInitialInvestment(e.target.value)}
                        min="1"
                        max="1000000"
                        step="0.01"
                        className="form-input text-center text-2xl font-bold py-4"
                      />
                      <div className="text-center text-sm text-gray-500 mt-2">USDC</div>
                    </div>
                    <Button className="btn-primary w-full">INVEST NOW</Button>
                  </div>

                  {investmentAmount > 0 && (
                    <div className="minimal-card p-6">
                      <h4 className="font-semibold mb-4 uppercase tracking-wide">INVESTMENT BREAKDOWN</h4>
                      <div className="space-y-3">
                        {allocation.map((item) => (
                          <div
                            key={item.symbol}
                            className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                          >
                            <span className="font-semibold">{item.symbol}</span>
                            <span className="font-semibold">
                              ${((investmentAmount * item.percentage) / 100).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Review & Confirm */}
            {currentStep === 4 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="heading-lg mb-4">REVIEW YOUR SETUP</h3>
                  <p className="body-md text-gray-600">Please review your investment configuration before proceeding</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  <Card className="minimal-card">
                    <CardHeader className="border-b border-gray-200">
                      <CardTitle className="heading-md">ACCOUNT DETAILS</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Wallet:</span>
                        <span className="font-mono text-sm">
                          {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Risk Level:</span>
                        <span className="font-semibold">{riskLevel}/10</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Investment:</span>
                        <span className="font-semibold">${investmentAmount.toFixed(2)} USDC</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="minimal-card">
                    <CardHeader className="border-b border-gray-200">
                      <CardTitle className="heading-md">PORTFOLIO ALLOCATION</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        {allocation.map((item) => (
                          <div
                            key={item.symbol}
                            className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                          >
                            <span className="font-semibold">{item.symbol}</span>
                            <div className="text-right">
                              <div className="font-semibold">
                                ${((investmentAmount * item.percentage) / 100).toFixed(2)}
                              </div>
                              <div className="text-sm text-gray-500">{item.percentage}%</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Alert className="border-gray-300 bg-gray-50 max-w-4xl mx-auto">
                  <AlertTriangle className="h-4 w-4 text-gray-600" />
                  <AlertDescription className="text-gray-700">
                    <strong>IMPORTANT:</strong> By proceeding, you acknowledge that xStocks are tokenized securities
                    issued by Backed Finance and are subject to regulatory restrictions.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between pb-12">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="btn-secondary bg-transparent"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            PREVIOUS
          </Button>

          {currentStep < steps.length ? (
            <Button onClick={handleNext} disabled={!canProceed()} className="btn-primary">
              NEXT
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleComplete} disabled={!canProceed()} className="btn-primary">
              COMPLETE SETUP
              <CheckCircle className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
