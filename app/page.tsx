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
import { AppLayout } from "../components/AppLayout"
import { TestPortfolio } from "../components/TestPortfolio"
import { WalletAuth } from "../components/WalletAuth"

type AppState = "landing" | "onboarding" | "dashboard" | "markets" | "portfolio" | "analytics" | "history" | "settings" | "test" | "auth-test"

export default function Page() {
  const [appState, setAppState] = useState<AppState>("landing") // Start with landing page
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

  const handleGoToApp = () => {
    setAppState("landing")
  }

  return (
    <div>
      {appState === "auth-test" && (
        <div className="min-h-screen bg-gray-100 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                🔐 SolStock Wallet Authentication Test
              </h1>
              <p className="text-gray-600 mb-6">
                Test your Solana wallet authentication integration. This will verify that your wallet can connect and authenticate with Supabase.
              </p>
              
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => setAppState("test")}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Portfolio Test
                </button>
                <button
                  onClick={handleGoToApp}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Go to Landing
                </button>
              </div>
            </div>
            
            <WalletAuth />
          </div>
        </div>
      )}
      
      {appState === "test" && <TestPortfolio onGoToApp={handleGoToApp} />}
      
      {/* Landing Page - NO AppLayout wrapper */}
      {appState === "landing" && <LandingPage onGetStarted={handleGetStarted} onNavigate={handleNavigate} />}

      {/* Onboarding - NO AppLayout wrapper */}
      {appState === "onboarding" && (
        <OnboardingFlow onComplete={handleOnboardingComplete} onBack={handleBackToLanding} />
      )}

      {/* App Pages - WITH AppLayout wrapper */}
      {appState !== "test" && appState !== "auth-test" && appState !== "landing" && appState !== "onboarding" && (
        <AppLayout currentPage={appState as any} onNavigate={handleNavigate} onLogout={handleLogout}>
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
        </AppLayout>
      )}
    </div>
  )
}
