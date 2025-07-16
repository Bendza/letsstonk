"use client"

import { Analytics } from "@/components/Analytics"

export default function AnalyticsPage() {
  // Mock onboarding data for now - this should come from user context/auth
  const mockOnboardingData = {
    riskTolerance: 5,
    initialInvestment: 1000,
    portfolioName: "My Portfolio",
    rebalanceFrequency: "monthly" as const,
    autoRebalance: true
  }

  const handleNavigate = (page: "landing" | "dashboard" | "markets" | "portfolio" | "analytics" | "history" | "settings") => {
    // This will be removed when we fully migrate to Next.js routing
    console.log("Navigate to:", page)
  }

  const handleLogout = () => {
    // This will be moved to the layout
    console.log("Logout")
  }

  return (
    <Analytics 
      onboardingData={mockOnboardingData}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    />
  )
} 