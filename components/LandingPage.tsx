"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DisclaimerModal } from "./DisclaimerModal"
import { Logo } from "./Logo"
import { WalletConnectButton } from "./WalletConnectButton"
import { useWalletAuth } from "@/hooks/useWalletAuth"
import { useWallet } from '@solana/wallet-adapter-react'
import { ClientOnly } from "./ClientOnly"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { TrendingUp, Shield, Zap, ArrowRight, CheckCircle, FileText, ExternalLink, Menu, LogOut, BarChart3, Users, DollarSign, Clock } from "lucide-react"
import { fetchXStocks, fetchPrices } from "@/lib/fetchXStocks"
import { XStock } from "@/lib/types"
import { getSolscanLink } from "@/lib/solana-utils"
import Link from "next/link"

interface LandingPageProps {
  onGetStarted: () => void
  onNavigate: (page: "landing" | "dashboard") => void
}

interface XStockWithPrice extends XStock {
  price?: number
}

export function LandingPage({ onGetStarted, onNavigate }: LandingPageProps) {
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [featuredXStocks, setFeaturedXStocks] = useState<XStockWithPrice[]>([])
  const [pricesLoading, setPricesLoading] = useState(true)
  const { connected } = useWallet()
  const { isAuthenticated, user, hasProfile, hasPortfolio, signOut, manualAuth } = useWalletAuth()

  // Fetch featured xStocks for display
  useEffect(() => {
    const loadFeaturedXStocks = async () => {
      try {
        const xStocks = await fetchXStocks()
        // Show first 6 xStocks for the landing page
        const featured = xStocks.slice(0, 6)
        setFeaturedXStocks(featured)
        
        // Fetch prices for these stocks
        setPricesLoading(true)
        const addresses = featured.map(stock => stock.address)
        const prices = await fetchPrices(addresses)
        
        // Update stocks with prices
        const stocksWithPrices = featured.map(stock => ({
          ...stock,
          price: prices[stock.address] || undefined
        }))
        
        setFeaturedXStocks(stocksWithPrices)
        setPricesLoading(false)
      } catch (error) {
        console.error('Failed to load xStocks:', error)
        setPricesLoading(false)
      }
    }
    loadFeaturedXStocks()
  }, [])

  // Auto-navigate when user gets authenticated and has profile
  useEffect(() => {
    if (isAuthenticated && hasProfile && hasPortfolio) {
      console.log('🚀 User authenticated with portfolio, checking onboarding status...', { 
        user: user?.id,
        hasProfile,
        hasPortfolio
      })
      
      // Wait a bit then navigate to markets
      setTimeout(() => {
        console.log('✅ User has completed onboarding, going to markets')
        onNavigate("dashboard")
      }, 1500)
    }
  }, [isAuthenticated, hasProfile, hasPortfolio, onNavigate])

  const handleGetStarted = async () => {
    if (isAuthenticated) {
      if (hasProfile && hasPortfolio) {
        // User has completed onboarding, go to dashboard
        onNavigate("dashboard")
      } else {
        // User needs onboarding, show terms modal
        setShowDisclaimer(true)
      }
    } else if (connected) {
      // Wallet is connected but not authenticated, trigger authentication
      console.log('🔐 Wallet connected, triggering authentication...')
      await manualAuth()
    } else {
      // User needs to connect wallet first, show disclaimer
      setShowDisclaimer(true)
    }
  }

  const handleDisclaimerAccept = () => {
    setShowDisclaimer(false)
    // After accepting disclaimer, proceed to onboarding
    onGetStarted()
  }

  const handleSignOut = async () => {
    await signOut()
    setMobileMenuOpen(false)
  }

  const formatPrice = (price: number | undefined) => {
    if (!price) return "Loading..."
    return `$${price.toFixed(2)}`
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo />
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Show Login button when wallet is connected but not authenticated */}
              {connected && !isAuthenticated && (
                <Button 
                  onClick={manualAuth}
                  variant="outline"
                  className="text-gray-700 hover:text-gray-900"
                >
                  Login
                </Button>
              )}
              
              {/* Show Dashboard if user has completed onboarding */}
              {isAuthenticated && hasProfile && hasPortfolio && (
                <Button 
                  onClick={() => onNavigate("dashboard")}
                  variant="ghost" 
                  className="text-gray-700 hover:text-gray-900"
                >
                  Dashboard
                </Button>
              )}
              
              {/* Show Get Started if user needs onboarding */}
              {isAuthenticated && (!hasProfile || !hasPortfolio) && (
                <Button 
                  onClick={handleGetStarted}
                  variant="ghost"
                  className="text-gray-700 hover:text-gray-900"
                >
                  Get Started
                </Button>
              )}
              
              {/* Always show wallet connect button */}
              <ClientOnly fallback={<div className="w-32 h-10 bg-gray-200 animate-pulse rounded"></div>}>
                <WalletConnectButton />
              </ClientOnly>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col space-y-4 mt-8">
                    {/* Always show wallet connection */}
                    <div className="pb-4 border-b border-gray-200">
                      <div className="text-sm font-medium text-gray-900 mb-3">Wallet Connection</div>
                      <ClientOnly fallback={<div className="w-full h-10 bg-gray-200 animate-pulse rounded"></div>}>
                        <WalletConnectButton />
                      </ClientOnly>
                    </div>
                    
                    {/* Show Login button when wallet is connected but not authenticated */}
                    {connected && !isAuthenticated && (
                      <Button 
                        onClick={() => {
                          manualAuth()
                          setMobileMenuOpen(false)
                        }}
                        variant="outline"
                        className="justify-start"
                      >
                        Login
                      </Button>
                    )}
                    
                    {/* Show navigation when authenticated */}
                    {isAuthenticated && (
                      <>
                        {/* Show Dashboard if user has completed onboarding */}
                        {hasProfile && hasPortfolio && (
                          <Button 
                            onClick={() => {
                              onNavigate("dashboard")
                              setMobileMenuOpen(false)
                            }}
                            variant="ghost"
                            className="justify-start"
                          >
                            Dashboard
                          </Button>
                        )}
                        
                        {/* Show Get Started if user needs onboarding */}
                        {(!hasProfile || !hasPortfolio) && (
                          <Button 
                            onClick={() => {
                              handleGetStarted()
                              setMobileMenuOpen(false)
                            }}
                            variant="ghost"
                            className="justify-start"
                          >
                            Get Started
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-5 gap-8 items-center">
            {/* Left side - Content (smaller) */}
            <div className="lg:col-span-2">
              <Badge className="mb-6 bg-gray-800 text-gray-200 border-gray-700 text-sm px-4 py-2 rounded-none">
                POWERED BY BACKED FINANCE & SOLANA
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight leading-tight">
                ON-CHAIN S&P 500
                <br />
                ROBO-ADVISOR
              </h1>
              <p className="text-lg lg:text-xl mb-8 text-gray-300 leading-relaxed">
                Select a risk level to automatically diversify your portfolio with tokenized S&P 500 stocks. Professional
                portfolio management on Solana blockchain.
              </p>
              
              {/* Show wallet connection status */}
              {connected && !isAuthenticated && (
                <div className="mb-6 p-3 bg-amber-900/20 border border-amber-600/30 rounded-lg">
                  <div className="flex items-center gap-3 text-amber-200">
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">Wallet connected, authenticating...</span>
                  </div>
                </div>
              )}
              
              {isAuthenticated && !hasProfile && (
                <div className="mb-6 p-3 bg-green-900/20 border border-green-600/30 rounded-lg">
                  <div className="flex items-center gap-3 text-green-200">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm">Authenticated! Ready to get started.</span>
                  </div>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button 
                  size="lg" 
                  className="btn-primary text-lg px-8 py-4 font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105" 
                  onClick={handleGetStarted}
                >
                  {isAuthenticated 
                    ? (hasProfile && hasPortfolio ? "GO TO DASHBOARD" : "START TRADING")
                    : "GET STARTED NOW"
                  }
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="btn-secondary text-lg px-8 py-4 bg-transparent border-2 border-gray-300 hover:border-gray-400 transition-all duration-200"
                >
                  LEARN MORE
                  <FileText className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Right side - Hero Image (bigger) */}
            <div className="lg:col-span-3 flex justify-center lg:justify-end">
              <div className="relative">
                <img 
                  src="/hero-solstock.webp" 
                  alt="SolStock Trading Platform Dashboard" 
                  className="w-full max-w-2xl h-auto rounded-lg shadow-2xl border border-gray-700"
                />
                {/* Optional overlay for better integration */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent rounded-lg pointer-events-none"></div>
              </div>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-16 mt-16 border-t border-gray-800">
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
                  Instant settlement
                </div>
              </div>
            </Card>

            <Card className="minimal-card card-shadow p-8">
              <div className="w-16 h-16 bg-gray-900 flex items-center justify-center mb-6">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="heading-md mb-4">AI-POWERED OPTIMIZATION</CardTitle>
              <CardDescription className="body-md text-gray-600 mb-6">
                Advanced algorithms continuously optimize your portfolio based on your risk tolerance and market conditions.
              </CardDescription>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-gray-900" />
                  Dynamic rebalancing
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-gray-900" />
                  Risk-adjusted returns
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-gray-900" />
                  Real-time monitoring
                </div>
              </div>
            </Card>

            <Card className="minimal-card card-shadow p-8">
              <div className="w-16 h-16 bg-gray-900 flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="heading-md mb-4">SECURE & TRANSPARENT</CardTitle>
              <CardDescription className="body-md text-gray-600 mb-6">
                Built on Solana blockchain with institutional-grade security and full transparency of all transactions.
              </CardDescription>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-gray-900" />
                  Blockchain transparency
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-gray-900" />
                  Audited smart contracts
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-gray-900" />
                  Non-custodial design
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
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three simple steps to start your automated investment journey
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-900 text-white flex items-center justify-center mx-auto mb-8 text-2xl font-bold">
                1
              </div>
              <h3 className="heading-lg mb-6">CONNECT WALLET</h3>
              <p className="body-md text-gray-600 mb-6">
                Connect your Solana wallet and complete the quick onboarding process.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <div>✓ Phantom, Solflare, or other wallets</div>
                <div>✓ Secure authentication</div>
                <div>✓ No personal information required</div>
              </div>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gray-900 text-white flex items-center justify-center mx-auto mb-8 text-2xl font-bold">
                2
              </div>
              <h3 className="heading-lg mb-6">SET RISK LEVEL</h3>
              <p className="body-md text-gray-600 mb-6">
                Choose your risk tolerance from 1-10 to customize your portfolio allocation.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <div>✓ Conservative to aggressive options</div>
                <div>✓ Personalized allocation</div>
                <div>✓ Adjustable anytime</div>
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
                {featuredXStocks.length > 0 ? (
                  featuredXStocks.map((stock) => (
                    <div
                      key={stock.symbol}
                      className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        {stock.logoURI && (
                          <img 
                            src={stock.logoURI} 
                            alt={stock.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <div className="font-semibold text-gray-900">{stock.symbol}</div>
                          <div className="text-sm text-gray-500">{stock.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {pricesLoading ? (
                            <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                          ) : (
                            formatPrice(stock.price)
                          )}
                        </div>
                        <button
                          onClick={() => window.open(getSolscanLink(stock.address), "_blank")}
                          className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          View on Solscan
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  // Fallback while loading
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex justify-between items-center py-3 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                        <div>
                          <div className="w-16 h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                          <div className="w-24 h-3 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="w-16 h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                        <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="text-center mt-6">
                <Badge className="bg-gray-200 text-gray-900 rounded-none">
                  {featuredXStocks.length > 0 ? `${featuredXStocks.length}+ STOCKS AVAILABLE` : 'LOADING STOCKS...'}
                </Badge>
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
                <p>Not available to US persons. Please read our <Link href="/terms" className="text-gray-700 hover:text-gray-900 underline">terms of service</Link>.</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-sm uppercase tracking-wide">PRODUCT</h4>
              <div className="space-y-3 text-gray-600">
                <Link href="/how-it-works" className="block hover:text-gray-900 cursor-pointer">How It Works</Link>
                <div className="hover:text-gray-900 cursor-pointer">Portfolio Analytics</div>
                <div className="hover:text-gray-900 cursor-pointer">Auto-Rebalancing</div>
                <div className="hover:text-gray-900 cursor-pointer">Risk Management</div>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-sm uppercase tracking-wide">LEGAL</h4>
              <div className="space-y-3 text-gray-600">
                <Link href="/terms" className="block hover:text-gray-900 cursor-pointer">Terms of Service</Link>
                <Link href="/privacy" className="block hover:text-gray-900 cursor-pointer">Privacy Policy</Link>
                <Link href="/risk" className="block hover:text-gray-900 cursor-pointer">Risk Disclosure</Link>
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
