"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/Logo"
import { ArrowLeft, ArrowRight, Wallet, Settings, TrendingUp, Shield, Zap, BarChart3, RefreshCw, DollarSign } from "lucide-react"
import Link from "next/link"

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo />
            <Link href="/">
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <BarChart3 className="h-12 w-12 text-white" />
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
              HOW IT WORKS
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A comprehensive guide to automated portfolio management on SolStock AI
          </p>
          <div className="mt-8">
            <Badge className="bg-gray-800 text-gray-200 border-gray-700 text-sm px-4 py-2 rounded-none">
              STEP-BY-STEP GUIDE
            </Badge>
          </div>
        </div>
      </section>

      {/* Quick Overview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">THREE SIMPLE STEPS</h2>
            <p className="text-xl text-gray-600">
              Get started with automated investment management in minutes
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-900 text-white flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold mb-4">CONNECT WALLET</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect your Solana wallet and complete the secure authentication process
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-900 text-white flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold mb-4">SET PREFERENCES</h3>
              <p className="text-gray-600 leading-relaxed">
                Choose your risk tolerance and investment goals to customize your portfolio
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-900 text-white flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold mb-4">START INVESTING</h3>
              <p className="text-gray-600 leading-relaxed">
                Deposit USDC and let our AI algorithms manage your portfolio automatically
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Process */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="space-y-12">
            
            {/* Step 1: Wallet Connection */}
            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Wallet className="h-6 w-6 text-blue-600" />
                  <CardTitle className="text-2xl font-bold text-blue-900">STEP 1: CONNECT YOUR WALLET</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <p className="text-gray-700 leading-relaxed">
                    Start by connecting your Solana wallet to the platform. We support all major Solana wallets 
                    including Phantom, Solflare, and hardware wallets like Ledger.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h4 className="font-semibold text-blue-900 mb-3">Supported Wallets</h4>
                      <ul className="space-y-2 text-blue-800">
                        <li>• Phantom (recommended)</li>
                        <li>• Solflare</li>
                        <li>• Ledger Hardware Wallet</li>
                        <li>• Trezor Hardware Wallet</li>
                        <li>• Other WalletConnect-compatible wallets</li>
                      </ul>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h4 className="font-semibold text-blue-900 mb-3">Security Features</h4>
                      <ul className="space-y-2 text-blue-800">
                        <li>• Non-custodial design</li>
                        <li>• Private keys never leave your device</li>
                        <li>• Secure message signing for authentication</li>
                        <li>• Optional hardware wallet integration</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Authentication Process</h4>
                    <ol className="space-y-2 text-gray-700">
                      <li>1. Click "Connect Wallet" on the homepage</li>
                      <li>2. Select your preferred wallet from the list</li>
                      <li>3. Approve the connection request in your wallet</li>
                      <li>4. Sign a secure message to verify ownership</li>
                      <li>5. Complete the onboarding questionnaire</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Risk Assessment */}
            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Settings className="h-6 w-6 text-green-600" />
                  <CardTitle className="text-2xl font-bold text-green-900">STEP 2: RISK ASSESSMENT & PREFERENCES</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <p className="text-gray-700 leading-relaxed">
                    Our AI needs to understand your investment preferences to create a personalized portfolio. 
                    Complete a brief questionnaire about your risk tolerance and investment goals.
                  </p>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h4 className="font-semibold text-green-900 mb-3">Risk Tolerance Scale (1-10)</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-green-800 font-medium">Conservative (1-3)</span>
                        <span className="text-green-700">Focus on stability and capital preservation</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-green-800 font-medium">Moderate (4-6)</span>
                        <span className="text-green-700">Balanced approach with moderate growth</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-green-800 font-medium">Aggressive (7-10)</span>
                        <span className="text-green-700">Maximum growth potential, higher volatility</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Investment Goals</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Long-term wealth building</li>
                        <li>• Retirement planning</li>
                        <li>• Income generation</li>
                        <li>• Capital preservation</li>
                        <li>• Aggressive growth</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Time Horizon</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Short-term (&lt; 1 year)</li>
                        <li>• Medium-term (1-5 years)</li>
                        <li>• Long-term (5+ years)</li>
                        <li>• Retirement (10+ years)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 3: Portfolio Creation */}
            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                  <CardTitle className="text-2xl font-bold text-purple-900">STEP 3: AUTOMATED PORTFOLIO CREATION</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <p className="text-gray-700 leading-relaxed">
                    Based on your risk tolerance and preferences, our AI algorithms create a personalized portfolio 
                    allocation using tokenized S&P 500 stocks (xStocks).
                  </p>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <h4 className="font-semibold text-purple-900 mb-3">Portfolio Optimization Process</h4>
                    <ol className="space-y-2 text-purple-800">
                      <li>1. <strong>Risk Analysis:</strong> Assess your risk tolerance and constraints</li>
                      <li>2. <strong>Asset Selection:</strong> Choose appropriate xStocks from S&P 500</li>
                      <li>3. <strong>Allocation Calculation:</strong> Determine optimal position sizes</li>
                      <li>4. <strong>Diversification:</strong> Ensure proper sector and stock distribution</li>
                      <li>5. <strong>Backtesting:</strong> Validate strategy against historical data</li>
                    </ol>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Conservative Portfolio</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• 15-20 diversified positions</li>
                        <li>• Focus on large-cap, stable companies</li>
                        <li>• Lower volatility sectors emphasized</li>
                        <li>• Maximum single position: 8%</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Aggressive Portfolio</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• 10-15 concentrated positions</li>
                        <li>• Growth stocks and emerging sectors</li>
                        <li>• Higher volatility tolerance</li>
                        <li>• Maximum single position: 15%</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 4: Funding */}
            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-6 w-6 text-green-600" />
                  <CardTitle className="text-2xl font-bold text-green-900">STEP 4: FUND YOUR PORTFOLIO</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <p className="text-gray-700 leading-relaxed">
                    Deposit USDC into your portfolio to begin investing. Our platform automatically executes 
                    your allocation strategy by purchasing the appropriate xStocks.
                  </p>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h4 className="font-semibold text-green-900 mb-3">Funding Process</h4>
                    <ol className="space-y-2 text-green-800">
                      <li>1. <strong>Deposit USDC:</strong> Transfer USDC from your wallet to the platform</li>
                      <li>2. <strong>Automatic Allocation:</strong> AI calculates optimal purchase amounts</li>
                      <li>3. <strong>Trade Execution:</strong> System executes trades via Jupiter DEX</li>
                      <li>4. <strong>Portfolio Tracking:</strong> Monitor your investments in real-time</li>
                    </ol>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Minimum Investment</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• <strong>Starting amount:</strong> $100 USDC</li>
                        <li>• <strong>Additional deposits:</strong> $50 USDC</li>
                        <li>• <strong>No maximum limit</strong></li>
                        <li>• <strong>Fractional shares:</strong> Supported</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Transaction Fees</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• <strong>Management fee:</strong> 0.1% annually</li>
                        <li>• <strong>Deposit/withdrawal:</strong> Free</li>
                        <li>• <strong>Rebalancing:</strong> Free</li>
                        <li>• <strong>Blockchain fees:</strong> ~$0.01 per transaction</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 5: Automated Management */}
            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-6 w-6 text-orange-600" />
                  <CardTitle className="text-2xl font-bold text-orange-900">STEP 5: AUTOMATED MANAGEMENT</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <p className="text-gray-700 leading-relaxed">
                    Once your portfolio is funded, our AI systems continuously monitor and manage your investments 
                    through automated rebalancing and optimization.
                  </p>
                  
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                    <h4 className="font-semibold text-orange-900 mb-3">Rebalancing Triggers</h4>
                    <ul className="space-y-2 text-orange-800">
                      <li>• <strong>Drift Threshold:</strong> When allocation deviates 5% from target</li>
                      <li>• <strong>Time-based:</strong> Monthly review and rebalancing</li>
                      <li>• <strong>Volatility Events:</strong> Market stress or high volatility periods</li>
                      <li>• <strong>New Deposits:</strong> Automatic allocation of new funds</li>
                    </ul>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Monitoring Features</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Real-time portfolio tracking</li>
                        <li>• Performance analytics</li>
                        <li>• Risk metrics dashboard</li>
                        <li>• Transaction history</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">AI Optimization</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Continuous risk assessment</li>
                        <li>• Market condition adaptation</li>
                        <li>• Tax-loss harvesting</li>
                        <li>• Performance optimization</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology Behind the Platform */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">THE TECHNOLOGY</h2>
            <p className="text-xl text-gray-600">
              Advanced algorithms and blockchain infrastructure powering your investments
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="minimal-card">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="h-8 w-8 text-blue-600" />
                  <h3 className="text-xl font-bold">AI Portfolio Optimization</h3>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Our machine learning algorithms analyze thousands of data points to optimize your portfolio:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>• Modern Portfolio Theory implementation</li>
                  <li>• Risk-adjusted return optimization</li>
                  <li>• Correlation analysis and diversification</li>
                  <li>• Market sentiment integration</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="minimal-card">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-8 w-8 text-green-600" />
                  <h3 className="text-xl font-bold">Blockchain Security</h3>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Built on Solana blockchain with institutional-grade security measures:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>• Smart contract audits by leading firms</li>
                  <li>• Multi-signature wallet architecture</li>
                  <li>• Decentralized execution and transparency</li>
                  <li>• Non-custodial asset management</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="minimal-card">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                  <h3 className="text-xl font-bold">Real-time Analytics</h3>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Comprehensive monitoring and reporting tools for complete transparency:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>• Live portfolio performance tracking</li>
                  <li>• Risk metrics and volatility analysis</li>
                  <li>• Benchmark comparison and attribution</li>
                  <li>• Detailed transaction reporting</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="minimal-card">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                  <h3 className="text-xl font-bold">xStocks Integration</h3>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Seamless integration with Backed Finance's tokenized securities:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>• 1:1 backing by real shares in custody</li>
                  <li>• Regulated Swiss custodian (Backed Finance AG)</li>
                  <li>• 24/7 trading availability</li>
                  <li>• Fractional share ownership</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Getting Started CTA */}
      <section className="py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">READY TO GET STARTED?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of smart investors already using our automated portfolio management. 
            Start with as little as $100 USDC.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" className="btn-primary text-lg px-8 py-4">
                START INVESTING NOW
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/risk">
              <Button size="lg" variant="outline" className="btn-secondary text-lg px-8 py-4">
                READ RISK DISCLOSURE
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <BarChart3 className="h-8 w-8 text-white" />
            <div>
              <div className="font-bold text-xl">SOLSTOCK AI</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">HOW IT WORKS</div>
            </div>
          </div>
          <p className="text-gray-400 mb-6">
            Automated investment management made simple, secure, and transparent
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <Link href="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link>
            <Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link>
            <Link href="/risk" className="text-gray-400 hover:text-white">Risk Disclosure</Link>
          </div>
        </div>
      </footer>
    </div>
  )
} 