"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Logo } from "./Logo"
import { MockWalletButton } from "./MockWalletButton"
import { useMockWallet } from "./MockWalletProvider"
import {
  Menu,
  Home,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  ChevronDown,
  TrendingUp,
  PieChart,
  History,
  Target,
} from "lucide-react"

interface NavigationProps {
  currentPage: "landing" | "dashboard" | "markets" | "portfolio" | "analytics" | "history" | "settings" | "onboarding"
  onNavigate: (page: "landing" | "dashboard" | "markets" | "portfolio" | "analytics" | "history" | "settings") => void
  onLogout?: () => void
}

export function Navigation({ currentPage, onNavigate, onLogout }: NavigationProps) {
  const { connected, publicKey } = useMockWallet()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { label: "HOME", href: "landing", icon: Home },
    { label: "DASHBOARD", href: "dashboard", icon: BarChart3, requiresAuth: true },
    { label: "MARKETS", href: "markets", icon: TrendingUp, requiresAuth: true },
    { label: "PORTFOLIO", href: "portfolio", icon: PieChart, requiresAuth: true },
    { label: "ANALYTICS", href: "analytics", icon: Target, requiresAuth: true },
    { label: "HISTORY", href: "history", icon: History, requiresAuth: true },
    { label: "SETTINGS", href: "settings", icon: Settings, requiresAuth: true },
    { label: "HELP", href: "#", icon: HelpCircle },
  ]

  const handleNavClick = (href: string) => {
    if (
      href === "landing" ||
      href === "dashboard" ||
      href === "markets" ||
      href === "portfolio" ||
      href === "analytics" ||
      href === "history" ||
      href === "settings"
    ) {
      onNavigate(href as any)
    }
    setMobileMenuOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <button onClick={() => onNavigate("landing")} className="flex items-center">
              <Logo />
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {navItems.map((item) => {
                if (item.requiresAuth && !connected) return null
                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.href)}
                    className={`text-sm font-semibold transition-colors hover:text-gray-900 uppercase tracking-wide ${
                      currentPage === item.href ? "text-gray-900" : "text-gray-600"
                    }`}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Notifications (when connected) */}
            {connected && (
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-gray-900 text-white rounded-full">
                  3
                </Badge>
              </Button>
            )}

            {/* Wallet Connection */}
            <div className="hidden sm:block">
              <MockWalletButton />
            </div>

            {/* User Menu (when connected) */}
            {connected && publicKey && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-900 text-white flex items-center justify-center text-sm font-bold">
                      {publicKey.toString().slice(0, 2).toUpperCase()}
                    </div>
                    <div className="hidden lg:block text-left">
                      <div className="text-sm font-semibold">PORTFOLIO</div>
                      <div className="text-xs text-gray-500">
                        {publicKey.toString().slice(0, 6)}...{publicKey.toString().slice(-4)}
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 rounded-none">
                  <DropdownMenuItem onClick={() => onNavigate("dashboard")} className="hover:bg-gray-50">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    DASHBOARD
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate("portfolio")} className="hover:bg-gray-50">
                    <PieChart className="mr-2 h-4 w-4" />
                    PORTFOLIO
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate("settings")} className="hover:bg-gray-50">
                    <Settings className="mr-2 h-4 w-4" />
                    SETTINGS
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="text-gray-600 hover:bg-gray-50">
                    <LogOut className="mr-2 h-4 w-4" />
                    DISCONNECT
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-white">
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="pb-4 border-b border-gray-200">
                    <MockWalletButton />
                  </div>

                  {navItems.map((item) => {
                    if (item.requiresAuth && !connected) return null
                    return (
                      <button
                        key={item.label}
                        onClick={() => handleNavClick(item.href)}
                        className={`flex items-center gap-3 px-3 py-2 text-left transition-colors font-semibold uppercase tracking-wide ${
                          currentPage === item.href ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                      </button>
                    )
                  })}

                  {connected && (
                    <>
                      <div className="pt-4 border-t border-gray-200">
                        <div className="text-sm font-semibold mb-2 uppercase tracking-wide">ACCOUNT</div>
                        <div className="text-xs text-gray-500 mb-4">
                          {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}
                        </div>
                        <Button
                          variant="outline"
                          onClick={onLogout}
                          className="w-full text-gray-600 bg-transparent border-gray-300 rounded-none"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          DISCONNECT WALLET
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
