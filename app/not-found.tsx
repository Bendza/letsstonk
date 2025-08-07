"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, ArrowLeft, Home, Search, FileText } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <nav className="border-b border-border/30 sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/image.webp" 
                alt="LetsStonk" 
                className="w-10 h-10 object-contain rounded-lg"
              />
              <div className="flex flex-col">
                <span className="font-bold text-xl leading-none tracking-tight">LETSSTONK</span>
                <span className="text-xs text-gray-500 leading-none uppercase tracking-wide">TOKENIZED STOCKS</span>
              </div>
            </div>
            <Link href="/">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* 404 Content */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="text-[8rem] lg:text-[10rem] font-bold text-primary/10 leading-none mb-4">404</div>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-8 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 tracking-tight">What Can You Do?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Here are some suggestions to help you find what you're looking for.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="p-6 text-center bg-card border-border/40 hover:border-primary/20 transition-colors">
              <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mx-auto mb-4 rounded-lg">
                <Home className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-3">Go to Homepage</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start fresh from our homepage and explore our tokenized stock trading platform.
              </p>
              <Link href="/">
                <Button className="w-full">
                  Visit Homepage
                </Button>
              </Link>
            </Card>

            <Card className="p-6 text-center bg-card border-border/40 hover:border-primary/20 transition-colors">
              <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mx-auto mb-4 rounded-lg">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-3">Search Marketplace</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Browse our marketplace to find specific tokenized stocks and trading opportunities.
              </p>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Browse Stocks
                </Button>
              </Link>
            </Card>

            <Card className="p-6 text-center bg-card border-border/40 hover:border-primary/20 transition-colors">
              <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mx-auto mb-4 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-3">Learn More</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Learn about xStocks, PreStocks, and how our platform works.
              </p>
              <div className="flex gap-2">
                <a href="https://xstocks.com" target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    xStocks
                  </Button>
                </a>
                <a href="https://prestocks.com" target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    PreStocks
                  </Button>
                </a>
              </div>
            </Card>
          </div>
        </div>
      </section>

    </div>
  )
}