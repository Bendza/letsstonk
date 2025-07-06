"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "./Navigation"
import { LegalBanner } from "./LegalBanner"
import { DisclaimerModal } from "./DisclaimerModal"
import { TrendingUp, Shield, Zap, ArrowRight, CheckCircle, FileText, ExternalLink } from "lucide-react"

interface LandingPageProps {
  onGetStarted: () => void
  onNavigate: (page: "landing" | "dashboard") => void
}

export function LandingPage({ onGetStarted, onNavigate }: LandingPageProps) {
  const [showDisclaimer, setShowDisclaimer] = useState(false)

  const handleGetStarted = () => {
    setShowDisclaimer(true)
  }

  const handleDisclaimerAccept = () => {
    setShowDisclaimer(false)
    onGetStarted()
  }

  return (
    <div className="min-h-screen bg-white">
      <LegalBanner />
      <Navigation currentPage="landing" onNavigate={onNavigate} />

      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-24">
          <div className="max-w-4xl">
            <Badge className="mb-8 bg-gray-800 text-gray-200 border-gray-700 text-sm px-4 py-2 rounded-none">
              POWERED BY BACKED FINANCE & SOLANA
            </Badge>
            <h1 className="text-6xl lg:text-7xl font-bold mb-8 tracking-tight leading-tight">
              ON-CHAIN S&P 500
              <br />
              ROBO-ADVISOR
            </h1>
            <p className="text-xl lg:text-2xl mb-12 text-gray-300 leading-relaxed max-w-3xl">
              Select a risk level to automatically diversify your portfolio with tokenized S&P 500 stocks. Professional
              portfolio management on Solana blockchain.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 mb-16">
              <Button size="lg" className="btn-primary text-lg px-8 py-4" onClick={handleGetStarted}>
                SET RISK PROFILE
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="btn-secondary text-lg px-8 py-4 bg-transparent">
                VIEW DOCUMENTATION
                <FileText className="ml-3 h-5 w-5" />
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-8 border-t border-gray-800">
              <div>
                <div className="text-3xl font-bold mb-2">$2.5M+</div>
                <div className="text-gray-400 text-sm uppercase tracking-wide">Assets Managed</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">15.2%</div>
                <div className="text-gray-400 text-sm uppercase tracking-wide">Avg Annual Return</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">2,500+</div>
                <div className="text-gray-400 text-sm uppercase tracking-wide">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">0.1%</div>
                <div className="text-gray-400 text-sm uppercase tracking-wide">Management Fee</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight">AUTOMATED PORTFOLIO MANAGEMENT</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional-grade investment tools powered by blockchain technology and artificial intelligence.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="minimal-card card-shadow p-8">
              <div className="w-16 h-16 bg-gray-900 flex items-center justify-center mb-6">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="heading-md mb-4">REAL STOCK EXPOSURE</CardTitle>
              <CardDescription className="body-md text-gray-600 mb-6">
                Trade tokenized versions of real S&P 500 stocks backed 1:1 by actual shares held in regulated custody.
              </CardDescription>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-gray-900" />
                  1:1 backing with real shares
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-gray-900" />
                  Regulated Swiss custody
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-gray-900" />
                  Real-time price tracking
                </div>
              </div>
            </Card>

            <Card className="minimal-card card-shadow p-8">
              <div className="w-16 h-16 bg-gray-900 flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="heading-md mb-4">AI-POWERED REBALANCING</CardTitle>
              <CardDescription className="body-md text-gray-600 mb-6">
                Advanced algorithms continuously monitor and rebalance your portfolio to maintain optimal allocation.
              </CardDescription>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-gray-900" />
                  24/7 portfolio monitoring
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-gray-900" />
                  Automatic rebalancing
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-gray-900" />
                  Risk-adjusted allocation
                </div>
              </div>
            </Card>

            <Card className="minimal-card card-shadow p-8">
              <div className="w-16 h-16 bg-gray-900 flex items-center justify-center mb-6">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="heading-md mb-4">LIGHTNING EXECUTION</CardTitle>
              <CardDescription className="body-md text-gray-600 mb-6">
                Execute trades in seconds on Solana's high-performance blockchain with minimal fees.
              </CardDescription>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-gray-900" />
                  Sub-second execution
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-gray-900" />
                  Minimal transaction fees
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-gray-900" />
                  Jupiter DEX integration
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight">HOW IT WORKS</h2>
            <p className="text-xl text-gray-600">Three simple steps to automated investing</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-16">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-900 text-white flex items-center justify-center mx-auto mb-8 text-2xl font-bold">
                1
              </div>
              <h3 className="heading-lg mb-6">CONNECT WALLET</h3>
              <p className="body-md text-gray-600 mb-6">
                Connect your Solana wallet securely in one click. No personal data required.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <div>✓ Secure connection</div>
                <div>✓ Multiple wallet support</div>
                <div>✓ Non-custodial</div>
              </div>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gray-900 text-white flex items-center justify-center mx-auto mb-8 text-2xl font-bold">
                2
              </div>
              <h3 className="heading-lg mb-6">SET RISK PROFILE</h3>
              <p className="body-md text-gray-600 mb-6">
                Choose your risk tolerance and let our AI create a personalized portfolio allocation.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <div>✓ 10 risk levels available</div>
                <div>✓ AI-optimized allocation</div>
                <div>✓ Instant preview</div>
              </div>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gray-900 text-white flex items-center justify-center mx-auto mb-8 text-2xl font-bold">
                3
              </div>
              <h3 className="heading-lg mb-6">AUTO-INVEST</h3>
              <p className="body-md text-gray-600 mb-6">
                Deposit USDC and watch your portfolio grow with automated management.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <div>✓ Automated rebalancing</div>
                <div>✓ Real-time monitoring</div>
                <div>✓ Performance tracking</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* xStocks Integration */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-8 bg-gray-200 text-gray-900 border-gray-300 text-sm px-4 py-2 rounded-none">
                BACKED FINANCE PARTNERSHIP
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold mb-8 tracking-tight">
                TRADE REAL STOCKS
                <br />
                AS DIGITAL TOKENS
              </h2>
              <p className="body-lg text-gray-600 mb-12">
                Our platform integrates with Backed Finance's revolutionary xStocks—tokenized representations of real
                stocks. Each token is backed 1:1 by actual shares held in regulated custody.
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-gray-900 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="heading-md mb-3">REAL STOCK OWNERSHIP</h4>
                    <p className="text-gray-600">
                      Each xStock token represents actual shares held in regulated custody by Backed Finance AG.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-gray-900 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="heading-md mb-3">REGULATED CUSTODY</h4>
                    <p className="text-gray-600">
                      Shares are held by regulated custodians in Switzerland, ensuring maximum security.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-gray-900 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="heading-md mb-3">24/7 TRADING</h4>
                    <p className="text-gray-600">
                      Trade anytime, not just during traditional market hours. Access global markets around the clock.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                className="btn-secondary mt-8 bg-transparent"
                onClick={() => window.open("https://backed.fi", "_blank")}
              >
                LEARN MORE ABOUT BACKED FINANCE
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="minimal-card p-8">
              <h3 className="heading-lg mb-8 text-center">AVAILABLE XSTOCKS</h3>
              <div className="space-y-4">
                {[
                  { symbol: "AAPL-SPL", name: "Apple Inc", price: "200.00 USD" },
                  { symbol: "XOM-SPL", name: "Exxon Mobil", price: "75.00 USD" },
                  { symbol: "BRK.B-SPL", name: "Berkshire Hathaway", price: "125.00 USD" },
                  { symbol: "TSLA-SPL", name: "Tesla Inc", price: "248.50 USD" },
                  { symbol: "MSFT-SPL", name: "Microsoft", price: "428.75 USD" },
                ].map((stock) => (
                  <div
                    key={stock.symbol}
                    className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0"
                  >
                    <div>
                      <div className="font-semibold text-gray-900">{stock.symbol}</div>
                      <div className="text-sm text-gray-500">{stock.name}</div>
                    </div>
                    <div className="font-semibold text-gray-900">{stock.price}</div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-6">
                <Badge className="bg-gray-200 text-gray-900 rounded-none">20+ MORE STOCKS AVAILABLE</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-8 tracking-tight">READY TO START INVESTING?</h2>
          <p className="text-xl mb-12 text-gray-300 max-w-3xl mx-auto">
            Join thousands of smart investors already using our automated portfolio management. Start with as little as
            $1 USDC.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              className="bg-white hover:bg-gray-100 text-gray-900 font-semibold px-8 py-4 text-lg rounded-none"
              onClick={handleGetStarted}
            >
              GET STARTED NOW
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg bg-transparent rounded-none"
            >
              READ DOCUMENTATION
              <FileText className="ml-3 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-16 border-t border-gray-200">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-4 gap-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gray-900 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-xl">SOLSTOCK AI</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wide">ROBO-ADVISOR</div>
                </div>
              </div>
              <p className="text-gray-600 mb-6 max-w-md">
                AI-powered stock investing on Solana. Trade real stocks as tokens with automated portfolio management.
              </p>
              <div className="text-sm text-gray-500">
                <p className="mb-2">© 2024 SolStock AI. All rights reserved.</p>
                <p>Not available to US persons. Please read our terms of service.</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-sm uppercase tracking-wide">PRODUCT</h4>
              <div className="space-y-3 text-gray-600">
                <div className="hover:text-gray-900 cursor-pointer">Dashboard</div>
                <div className="hover:text-gray-900 cursor-pointer">Portfolio Analytics</div>
                <div className="hover:text-gray-900 cursor-pointer">Auto-Rebalancing</div>
                <div className="hover:text-gray-900 cursor-pointer">Risk Management</div>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-sm uppercase tracking-wide">SUPPORT</h4>
              <div className="space-y-3 text-gray-600">
                <div className="hover:text-gray-900 cursor-pointer">Help Center</div>
                <div className="hover:text-gray-900 cursor-pointer">Contact Us</div>
                <div className="hover:text-gray-900 cursor-pointer">API Documentation</div>
                <div className="hover:text-gray-900 cursor-pointer">Status Page</div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <DisclaimerModal
        isOpen={showDisclaimer}
        onClose={() => setShowDisclaimer(false)}
        onAccept={handleDisclaimerAccept}
      />
    </div>
  )
}
