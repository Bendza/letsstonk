"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/Logo"
import { TrendingUp, ArrowLeft, Home, Search, FileText } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo />
            <Link href="/">
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* 404 Content */}
      <section className="relative bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-8 bg-gray-800 text-gray-200 border-gray-700 text-sm px-4 py-2 rounded-none">
              ERROR 404
            </Badge>
            <h1 className="text-6xl lg:text-7xl font-bold mb-8 tracking-tight leading-tight">
              PAGE NOT FOUND
            </h1>
            <p className="text-xl lg:text-2xl mb-12 text-gray-300 leading-relaxed max-w-3xl mx-auto">
              The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link href="/">
                <Button 
                  size="lg" 
                  className="btn-primary text-xl px-12 py-6 font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105" 
                >
                  <ArrowLeft className="mr-3 h-6 w-6" />
                  GO HOME
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="btn-secondary text-xl px-12 py-6 bg-transparent border-2 border-gray-300 hover:border-gray-400 transition-all duration-200"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="mr-3 h-6 w-6" />
                GO BACK
              </Button>
            </div>

            {/* Error Code Display */}
            <div className="text-center pt-8 border-t border-gray-800">
              <div className="text-9xl font-bold text-gray-800 mb-4">404</div>
              <div className="text-gray-400 text-sm uppercase tracking-wide">Page Not Found</div>
            </div>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight">WHAT CAN YOU DO?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Here are some suggestions to help you find what you're looking for.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="minimal-card card-shadow p-8 text-center">
              <div className="w-16 h-16 bg-gray-900 flex items-center justify-center mx-auto mb-6">
                <Home className="h-8 w-8 text-white" />
              </div>
              <h3 className="heading-md mb-4">GO TO HOMEPAGE</h3>
              <p className="body-md text-gray-600 mb-6">
                Start fresh from our homepage and explore our AI-powered investment platform.
              </p>
              <Link href="/">
                <Button className="btn-primary">
                  Visit Homepage
                </Button>
              </Link>
            </Card>

            <Card className="minimal-card card-shadow p-8 text-center">
              <div className="w-16 h-16 bg-gray-900 flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="heading-md mb-4">SEARCH SITE</h3>
              <p className="body-md text-gray-600 mb-6">
                Use our search function to find specific information about our services.
              </p>
              <Button variant="outline" className="btn-secondary">
                Search Now
              </Button>
            </Card>

            <Card className="minimal-card card-shadow p-8 text-center">
              <div className="w-16 h-16 bg-gray-900 flex items-center justify-center mx-auto mb-6">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="heading-md mb-4">READ DOCS</h3>
              <p className="body-md text-gray-600 mb-6">
                Check our documentation for detailed information about our platform.
              </p>
              <Button variant="outline" className="btn-secondary">
                View Documentation
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-16 border-t border-gray-200">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-4 gap-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gray-900 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-xl">SOLSTOCK AI</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wide">ROBO-ADVISOR</div>
                </div>
              </div>
              <p className="text-gray-600 mb-6 max-w-md">
                AI-powered stock investing on Solana. Trade real stocks as tokens with automated portfolio management.
              </p>
              <div className="text-sm text-gray-500">
                <p className="mb-2">© 2024 SolStock AI. All rights reserved.</p>
                <p>Not available to US persons. Please read our terms of service.</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-sm uppercase tracking-wide">PRODUCT</h4>
              <div className="space-y-3 text-gray-600">
                <Link href="/" className="block hover:text-gray-900 cursor-pointer">Dashboard</Link>
                <Link href="/" className="block hover:text-gray-900 cursor-pointer">Portfolio Analytics</Link>
                <Link href="/" className="block hover:text-gray-900 cursor-pointer">Auto-Rebalancing</Link>
                <Link href="/" className="block hover:text-gray-900 cursor-pointer">Risk Management</Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-sm uppercase tracking-wide">SUPPORT</h4>
              <div className="space-y-3 text-gray-600">
                <div className="hover:text-gray-900 cursor-pointer">Help Center</div>
                <div className="hover:text-gray-900 cursor-pointer">Contact Us</div>
                <div className="hover:text-gray-900 cursor-pointer">API Documentation</div>
                <div className="hover:text-gray-900 cursor-pointer">Status Page</div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 