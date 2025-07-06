"use client"

import { useState } from "react"
import { LandingPage } from "../components/LandingPage"
import { OnboardingFlow, type OnboardingData } from "../components/OnboardingFlow"
import { Dashboard } from "../components/Dashboard"
import { Markets } from "../components/Markets"
import { Portfolio } from "../components/Portfolio"
import { Analytics } from "../components/Analytics"
import { TransactionHistory } from "../components/TransactionHistory"
import { Settings } from "../components/Settings"
import { TradingModal } from "../components/TradingModal"

type AppState = "landing" | "onboarding" | "dashboard" | "markets" | "portfolio" | "analytics" | "history" | "settings"

export default function Page() {
  const [appState, setAppState] = useState<AppState>("landing")
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null)
  const [selectedStock, setSelectedStock] = useState<string | null>(null)
  const [showTradingModal, setShowTradingModal] = useState(false)

  const handleGetStarted = () => {
    setAppState("onboarding")
  }

  const handleOnboardingComplete = (data: OnboardingData) => {
    setOnboardingData(data)
    setAppState("dashboard")
  }

  const handleNavigate = (page: AppState) => {
    if (page !== "landing" && page !== "onboarding" && !onboardingData) {
      setAppState("onboarding")
    } else {
      setAppState(page)
    }
  }

  const handleBackToLanding = () => {
    setAppState("landing")
  }

  const handleLogout = () => {
    setOnboardingData(null)
    setAppState("landing")
  }

  const handleTradeStock = (symbol: string) => {
    setSelectedStock(symbol)
    setShowTradingModal(true)
  }

  const handleCloseTradingModal = () => {
    setShowTradingModal(false)
    setSelectedStock(null)
  }

  return (
    <>
      {appState === "landing" && <LandingPage onGetStarted={handleGetStarted} onNavigate={handleNavigate} />}

      {appState === "onboarding" && (
        <OnboardingFlow onComplete={handleOnboardingComplete} onBack={handleBackToLanding} />
      )}

      {appState === "dashboard" && onboardingData && (
        <Dashboard onboardingData={onboardingData} onNavigate={handleNavigate} onLogout={handleLogout} />
      )}

      {appState === "markets" && onboardingData && (
        <Markets onNavigate={handleNavigate} onLogout={handleLogout} onTradeStock={handleTradeStock} />
      )}

      {appState === "portfolio" && onboardingData && (
        <Portfolio onboardingData={onboardingData} onNavigate={handleNavigate} onLogout={handleLogout} />
      )}

      {appState === "analytics" && onboardingData && (
        <Analytics onboardingData={onboardingData} onNavigate={handleNavigate} onLogout={handleLogout} />
      )}

      {appState === "history" && onboardingData && (
        <TransactionHistory onNavigate={handleNavigate} onLogout={handleLogout} />
      )}

      {appState === "settings" && onboardingData && <Settings onNavigate={handleNavigate} onLogout={handleLogout} />}

      {showTradingModal && selectedStock && (
        <TradingModal symbol={selectedStock} isOpen={showTradingModal} onClose={handleCloseTradingModal} />
      )}
    </>
  )
}
