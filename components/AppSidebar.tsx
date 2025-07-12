"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, Home, ShoppingCart, PieChart, BarChart3, History, Settings, LogOut } from 'lucide-react'
import { Logo } from './Logo'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletConnectButton } from './WalletConnectButton'

interface AppSidebarProps {
  currentPage: string
  onNavigate: (page: string) => void
  onLogout: () => void
}

export function AppSidebar({ currentPage, onNavigate, onLogout }: AppSidebarProps) {
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
    <Sidebar>
      <SidebarHeader className="p-6">
        <Logo showText={true} />
      </SidebarHeader>
      
      <SidebarContent>
        {/* Portfolio Summary */}
        <div className="p-6 border-b border-gray-200">
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
        <div className="flex-1 p-6">
          <SidebarMenu>
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id
              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onNavigate(item.id)}
                    isActive={isActive}
                    className="w-full justify-start"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </div>

        {/* Wallet & Logout */}
        <div className="p-6 border-t border-gray-200 space-y-3">
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
      </SidebarContent>
    </Sidebar>
  )
}