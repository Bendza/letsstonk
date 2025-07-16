"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LandingPage } from "../components/LandingPage"
import { OnboardingFlow, type OnboardingData } from "../components/OnboardingFlow"
import { TradingModal } from "../components/TradingModal"
import { DisclaimerModal } from "@/components/DisclaimerModal"
import { useWalletAuth } from "@/hooks/useWalletAuth"

export default function Page() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [selectedStock, setSelectedStock] = useState<any>(null)
  const [showTradingModal, setShowTradingModal] = useState(false)
  const [showDisclaimer, setShowDisclaimer] = useState(true)
  const router = useRouter()
  
  const { isAuthenticated, hasProfile, hasPortfolio, user } = useWalletAuth()

  // Auto-navigate users with existing portfolios to markets page
  useEffect(() => {
    if (isAuthenticated && hasProfile && hasPortfolio) {
      console.log('🚀 User has existing portfolio, redirecting to markets')
      router.push('/dashboard/markets')
    }
  }, [isAuthenticated, hasProfile, hasPortfolio, router])

  const handleGetStarted = () => {
    setShowOnboarding(true)
  }

  const handleOnboardingComplete = (data: OnboardingData) => {
    router.push('/dashboard/markets')
  }

  const handleBackToLanding = () => {
    setShowOnboarding(false)
  }

  const handleTradeStock = (stock: any) => {
    setSelectedStock(stock)
    setShowTradingModal(true)
  }

  const handleCloseTradingModal = () => {
    setShowTradingModal(false)
    setSelectedStock(null)
  }

  const handleNavigate = (page: string) => {
    if (page === "dashboard") {
      router.push('/dashboard/markets')
    } else {
      console.log("Navigate to:", page)
    }
  }

  const handleCloseDisclaimer = () => {
    setShowDisclaimer(false)
  }

  const handleAcceptDisclaimer = () => {
    setShowDisclaimer(false)
  }

  if (showOnboarding) {
    return (
      <OnboardingFlow 
        onComplete={handleOnboardingComplete}
        onBack={handleBackToLanding}
      />
    )
  }

  return (
    <div>
      <DisclaimerModal 
        isOpen={showDisclaimer}
        onClose={handleCloseDisclaimer}
        onAccept={handleAcceptDisclaimer}
      />
      <LandingPage 
        onGetStarted={handleGetStarted} 
        onNavigate={handleNavigate}
      />
      
      {showTradingModal && selectedStock && (
        <TradingModal
          open={showTradingModal}
          onOpenChange={setShowTradingModal}
          stock={selectedStock}
        />
      )}
    </div>
  )
}
