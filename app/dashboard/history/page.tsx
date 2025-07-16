"use client"

import { TransactionHistory } from "@/components/TransactionHistory"

export default function HistoryPage() {
  const handleNavigate = (page: "landing" | "dashboard" | "markets" | "portfolio" | "analytics" | "history" | "settings") => {
    // This will be removed when we fully migrate to Next.js routing
    console.log("Navigate to:", page)
  }

  const handleLogout = () => {
    // This will be moved to the layout
    console.log("Logout")
  }

  return (
    <TransactionHistory 
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    />
  )
} 