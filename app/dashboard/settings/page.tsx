"use client"

import { Settings } from "@/components/Settings"

export default function SettingsPage() {
  const handleNavigate = (page: "landing" | "dashboard" | "markets" | "portfolio" | "analytics" | "history" | "settings") => {
    // This will be removed when we fully migrate to Next.js routing
  }

  const handleLogout = () => {
    // This will be moved to the layout
  }

  return (
    <Settings 
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    />
  )
} 