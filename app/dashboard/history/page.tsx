"use client"

import { TransactionHistory } from "@/components/TransactionHistory"

export default function HistoryPage() {
  const handleNavigate = (page: "landing" | "dashboard" | "markets" | "portfolio" | "analytics" | "history" | "settings") => {
    // This will be removed when we fully migrate to Next.js routing
  }

  const handleLogout = () => {
    // This will be moved to the layout
  }

  return (
    <TransactionHistory 
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    />
  )
} 