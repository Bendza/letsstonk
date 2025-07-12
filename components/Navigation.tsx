"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, History, Settings, Home, ShoppingCart, LogOut, Wallet } from "lucide-react"
import { Logo } from "./Logo"
import { WalletConnectButton } from "./WalletConnectButton"
import { useWallet } from '@solana/wallet-adapter-react'

type NavigationProps = {
  currentPage: "landing" | "onboarding" | "dashboard" | "markets" | "portfolio" | "analytics" | "history" | "settings"
  onNavigate: (page: "landing" | "onboarding" | "dashboard" | "markets" | "portfolio" | "analytics" | "history" | "settings") => void
  onLogout: () => void
}

export function Navigation({ currentPage, onNavigate, onLogout }: NavigationProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showPortfolioDetails, setShowPortfolioDetails] = useState(false)
  
  // Mock portfolio data
  const portfolioValue = 12500
  const portfolioChange = 850
  const portfolioChangePercent = 7.3
  const positions = [
    { symbol: "AAPL", value: 3200, change: 2.1 },
    { symbol: "GOOGL", value: 2800, change: -1.2 },
    { symbol: "MSFT", value: 2500, change: 1.8 },
    { symbol: "TSLA", value: 2000, change: 4.5 },
    { symbol: "NVDA", value: 2000, change: -0.8 },
  ]

  const { connected, publicKey } = useWallet()

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "markets", label: "Markets", icon: ShoppingCart },
    { id: "portfolio", label: "Portfolio", icon: PieChart },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "history", label: "History", icon: History },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
                 <div className="flex items-center justify-between">
           <Logo showText={false} />
           <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="md:hidden"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className={`p-6 border-b border-gray-200 ${isExpanded ? "block" : "hidden md:block"}`}>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Portfolio</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPortfolioDetails(!showPortfolioDetails)}
              >
                {showPortfolioDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">${portfolioValue.toLocaleString()}</span>
                <Badge variant={portfolioChange >= 0 ? "default" : "destructive"}>
                  {portfolioChange >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {portfolioChangePercent >= 0 ? "+" : ""}{portfolioChangePercent}%
                </Badge>
              </div>
              <div className="text-sm text-gray-600">
                {portfolioChange >= 0 ? "+" : ""}${portfolioChange} today
              </div>
            </div>

            {showPortfolioDetails && (
              <div className="mt-4 space-y-2">
                <Separator />
                <div className="text-sm font-medium text-gray-700">Top Positions</div>
                {positions.slice(0, 3).map((position) => (
                  <div key={position.symbol} className="flex items-center justify-between text-sm">
                    <span>{position.symbol}</span>
                    <div className="flex items-center space-x-2">
                      <span>${position.value.toLocaleString()}</span>
                      <span className={position.change >= 0 ? "text-green-600" : "text-red-600"}>
                        {position.change >= 0 ? "+" : ""}{position.change}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className={`flex-1 p-6 ${isExpanded ? "block" : "hidden md:block"}`}>
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => onNavigate(item.id as any)}
              >
                <Icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            )
          })}
        </nav>
      </div>

      {/* Wallet & Logout */}
      <div className={`p-6 border-t border-gray-200 space-y-3 ${isExpanded ? "block" : "hidden md:block"}`}>
        <WalletConnectButton />
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  )
}
