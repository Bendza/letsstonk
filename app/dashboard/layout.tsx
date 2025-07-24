"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { 
  TrendingUp, 
  Wallet, 
  History, 
  Menu, 
  LogOut,
  DollarSign
} from "lucide-react"
import { Logo } from "@/components/Logo"
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletAuth } from '@/hooks/useWalletAuth'
import { usePortfolio } from '@/hooks/usePortfolio'

const navigation = [
  { name: "Markets", href: "/dashboard/markets", icon: TrendingUp },
  { name: "Portfolio", href: "/dashboard/portfolio", icon: Wallet },
  { name: "History", href: "/dashboard/history", icon: History },
]

function NavigationItems({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname()
  
  return (
    <nav className="flex flex-col space-y-2">
      {navigation.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={onItemClick}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "bg-gray-900 text-white"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}

function WalletSection() {
  const { publicKey } = useWallet()
  const { isAuthenticated } = useWalletAuth()
  const { portfolio } = usePortfolio(publicKey?.toString() || null)
  
  const walletAddress = publicKey?.toString() || ''
  const shortAddress = walletAddress ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : ''
  
  const portfolioValue = portfolio?.total_value || 0
  const portfolioChange = portfolio?.current_pnl || 0
  const positions = portfolio?.positions || []
  
  return (
    <div className="space-y-3">
      {/* Wallet Address */}
      {isAuthenticated && walletAddress && (
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500 mb-1">Wallet Address</div>
          <div className="text-sm font-mono text-gray-800">{shortAddress}</div>
        </div>
      )}
      
      {/* Portfolio Summary */}
      {portfolio && (
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500 mb-1">Portfolio Value</div>
          <div className="text-lg font-bold text-gray-900">${portfolioValue.toLocaleString()}</div>
          <div className={`text-sm ${portfolioChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {portfolioChange >= 0 ? '+' : ''}${portfolioChange.toFixed(2)}
          </div>
          {positions.length > 0 && (
            <div className="mt-2 text-xs text-gray-600">
              {positions.length} position{positions.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function LogoutButton({ onLogout }: { onLogout: () => void }) {
  return (
    <Button
      variant="ghost"
      onClick={onLogout}
      className="flex items-center gap-3 px-3 py-2 w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { signOut } = useWalletAuth()
  
  const handleLogout = async () => {
    try {
      await signOut()
      // Optionally redirect to home page after logout
      window.location.href = '/'
    } catch (error) {
      console.error('Logout failed:', error)
      // Even if logout fails, redirect to home page
      window.location.href = '/'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 shadow-sm">
          <div className="flex h-16 shrink-0 items-center">
            <Logo />
          </div>
          <div className="flex flex-1 flex-col">
            <NavigationItems />
            <div className="mt-auto space-y-4">
              <WalletSection />
              <div className="pt-4 border-t border-gray-200">
                <LogoutButton onLogout={handleLogout} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6">
          {/* Logo on the left */}
          <div className="flex items-center">
            <Logo />
          </div>
          
          {/* Menu button on the right */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open sidebar</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <div className="flex h-full flex-col">
                <div className="flex h-16 shrink-0 items-center px-6">
                  <Logo />
                </div>
                <div className="flex flex-1 flex-col px-6 pb-4">
                  <NavigationItems onItemClick={() => setMobileMenuOpen(false)} />
                  <div className="mt-auto space-y-4">
                    <WalletSection />
                    <div className="pt-4 border-t border-gray-200">
                      <LogoutButton onLogout={handleLogout} />
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-72">
        <main className="py-6 lg:py-8">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 