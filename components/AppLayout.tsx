"use client"

import { AppSidebar } from "./AppSidebar"

interface AppLayoutProps {
  currentPage: "landing" | "dashboard" | "markets" | "portfolio" | "analytics" | "history" | "settings" | "onboarding"
  onNavigate: (page: "landing" | "dashboard" | "markets" | "portfolio" | "analytics" | "history" | "settings") => void
  onLogout?: () => void
  children: React.ReactNode
}

export function AppLayout({ currentPage, onNavigate, onLogout, children }: AppLayoutProps) {
  if (currentPage === "landing" || currentPage === "onboarding") {
    return (
      <div className="w-full">
        {children}
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <AppSidebar currentPage={currentPage} onNavigate={onNavigate} onLogout={onLogout} />
      </div>
      
      {/* Content */}
      <div className="flex-1 bg-gray-50 overflow-auto">
        {children}
      </div>
    </div>
  )
}