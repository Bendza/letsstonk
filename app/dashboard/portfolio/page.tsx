"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Portfolio } from "@/components/Portfolio"
import { OnboardingFlow, type OnboardingData } from "@/components/OnboardingFlow"
import { useWalletAuth } from "@/hooks/useWalletAuth"
import { usePortfolio } from "@/hooks/usePortfolio"
import { useWallet } from '@solana/wallet-adapter-react'

export default function PortfolioPage() {
  const router = useRouter()
  const { publicKey } = useWallet()
  const { isAuthenticated, hasProfile, hasPortfolio, user, loading: authLoading } = useWalletAuth()
  const walletAddress = publicKey?.toBase58() || null
  const { portfolio, loading: portfolioLoading } = usePortfolio(walletAddress)

  const handleOnboardingComplete = (data: OnboardingData) => {
    // After onboarding is complete, redirect to markets
    router.push('/dashboard/markets')
  }

  const handleBackToMarkets = () => {
    router.push('/dashboard/markets')
  }

  // Show loading while checking auth state or portfolio data
  if (authLoading || portfolioLoading) {
    return null // Let Portfolio component handle its own loading state
  }

  // Show message if not authenticated instead of redirecting
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please connect your wallet to access your portfolio.</p>
          <button 
            onClick={() => router.push('/dashboard/markets')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go to Markets
          </button>
        </div>
      </div>
    )
  }

  // Show onboarding flow if user doesn't have a portfolio
  if (!hasPortfolio || !portfolio) {
    return (
      <OnboardingFlow 
        onComplete={handleOnboardingComplete}
        onBack={handleBackToMarkets}
      />
    )
  }

  // Mock onboarding data based on user profile
  const mockOnboardingData = {
    riskTolerance: portfolio.risk_level || 5,
    initialInvestment: portfolio.initial_investment || 1000,
    portfolioName: "My Portfolio",
    rebalanceFrequency: "monthly" as const,
    autoRebalance: true,
    walletAddress: walletAddress || undefined
  }

  const handleNavigate = (page: "landing" | "dashboard" | "markets" | "portfolio" | "analytics" | "history" | "settings") => {
    switch (page) {
      case "markets":
        router.push('/dashboard/markets')
        break
      case "portfolio":
        router.push('/dashboard/portfolio')
        break
      case "analytics":
        router.push('/dashboard/analytics')
        break
      case "history":
        router.push('/dashboard/history')
        break
      case "settings":
        router.push('/dashboard/settings')
        break
      default:
        console.log("Navigate to:", page)
    }
  }

  const handleLogout = () => {
    // This will be handled by the layout component
    console.log("Logout")
  }

  return (
    <Portfolio 
      onboardingData={mockOnboardingData}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    />
  )
} 