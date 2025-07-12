"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  TrendingUp,
  TrendingDown,
  Filter,
  Grid3X3,
  List,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  StarOff,
} from "lucide-react"
import { LineChart, Line, ResponsiveContainer } from "recharts"

interface MarketsProps {
  onNavigate: (page: "landing" | "dashboard" | "markets" | "portfolio" | "analytics" | "history" | "settings") => void
  onLogout: () => void
  onTradeStock: (symbol: string) => void
}

// Mock stock data
const mockStocks = [
  {
    symbol: "xTSLA",
    name: "Tesla Inc",
    price: 248.5,
    change: 12.3,
    changePercent: 5.2,
    volume: 1250000,
    marketCap: 789000000000,
    sector: "Technology",
    logo: "🚗",
    chartData: [{ value: 236 }, { value: 240 }, { value: 235 }, { value: 245 }, { value: 248.5 }],
    isFavorite: true,
  },
  {
    symbol: "xAAPL",
    name: "Apple Inc",
    price: 195.89,
    change: -2.45,
    changePercent: -1.2,
    volume: 2100000,
    marketCap: 3020000000000,
    sector: "Technology",
    logo: "🍎",
    chartData: [{ value: 200 }, { value: 198 }, { value: 202 }, { value: 197 }, { value: 195.89 }],
    isFavorite: false,
  },
  {
    symbol: "xMSFT",
    name: "Microsoft Corporation",
    price: 428.75,
    change: 8.9,
    changePercent: 2.1,
    volume: 890000,
    marketCap: 3180000000000,
    sector: "Technology",
    logo: "💻",
    chartData: [{ value: 420 }, { value: 425 }, { value: 422 }, { value: 430 }, { value: 428.75 }],
    isFavorite: true,
  },
  {
    symbol: "xGOOGL",
    name: "Alphabet Inc",
    price: 175.25,
    change: 3.15,
    changePercent: 1.8,
    volume: 1450000,
    marketCap: 2150000000000,
    sector: "Technology",
    logo: "🔍",
    chartData: [{ value: 172 }, { value: 174 }, { value: 171 }, { value: 176 }, { value: 175.25 }],
    isFavorite: false,
  },
  {
    symbol: "xAMZN",
    name: "Amazon.com Inc",
    price: 186.43,
    change: -1.87,
    changePercent: -1.0,
    volume: 1680000,
    marketCap: 1920000000000,
    sector: "Consumer Discretionary",
    logo: "📦",
    chartData: [{ value: 188 }, { value: 187 }, { value: 189 }, { value: 185 }, { value: 186.43 }],
    isFavorite: false,
  },
  {
    symbol: "xNVDA",
    name: "NVIDIA Corporation",
    price: 875.3,
    change: 45.2,
    changePercent: 5.4,
    volume: 980000,
    marketCap: 2160000000000,
    sector: "Technology",
    logo: "🎮",
    chartData: [{ value: 830 }, { value: 850 }, { value: 845 }, { value: 870 }, { value: 875.3 }],
    isFavorite: true,
  },
]

export function Markets({ onNavigate, onLogout, onTradeStock }: MarketsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSector, setSelectedSector] = useState("all")
  const [sortBy, setSortBy] = useState("alphabetical")
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")
  const [favorites, setFavorites] = useState<string[]>(["xTSLA", "xMSFT", "xNVDA"])

  const sectors = ["all", "Technology", "Healthcare", "Finance", "Consumer Discretionary", "Energy"]

  const filteredAndSortedStocks = useMemo(() => {
    const filtered = mockStocks.filter((stock) => {
      const matchesSearch =
        stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesSector = selectedSector === "all" || stock.sector === selectedSector
      return matchesSearch && matchesSector
    })

    switch (sortBy) {
      case "price-high":
        return filtered.sort((a, b) => b.price - a.price)
      case "price-low":
        return filtered.sort((a, b) => a.price - b.price)
      case "change-high":
        return filtered.sort((a, b) => b.changePercent - a.changePercent)
      case "change-low":
        return filtered.sort((a, b) => a.changePercent - b.changePercent)
      case "volume":
        return filtered.sort((a, b) => b.volume - a.volume)
      default:
        return filtered.sort((a, b) => a.name.localeCompare(b.name))
    }
  }, [searchQuery, selectedSector, sortBy])

  const toggleFavorite = (symbol: string) => {
    setFavorites((prev) => (prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]))
  }

  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(1)}T`
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`
    return `$${num.toFixed(0)}`
  }

  const topGainers = mockStocks
    .filter((s) => s.changePercent > 0)
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 3)
  const topLosers = mockStocks
    .filter((s) => s.changePercent < 0)
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 3)

  return (
    <div className="w-full">
      <div className="px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 tracking-tight">STOCK MARKETS</h1>
          <p className="text-gray-600 text-lg">Trade tokenized stocks 24/7 on Solana blockchain</p>
        </div>

        {/* Market Movers */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="minimal-card">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="flex items-center gap-2 text-green-700">
                <TrendingUp className="h-5 w-5" />
                TOP GAINERS
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {topGainers.map((stock) => (
                  <div key={stock.symbol} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{stock.logo}</span>
                      <div>
                        <div className="font-semibold">{stock.symbol}</div>
                        <div className="text-sm text-gray-500">${stock.price}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-700 font-semibold">+{stock.changePercent}%</div>
                      <Button size="sm" className="btn-primary mt-1" onClick={() => onTradeStock(stock.symbol)}>
                        BUY
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="minimal-card">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="flex items-center gap-2 text-red-600">
                <TrendingDown className="h-5 w-5" />
                TOP LOSERS
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {topLosers.map((stock) => (
                  <div key={stock.symbol} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{stock.logo}</span>
                      <div>
                        <div className="font-semibold">{stock.symbol}</div>
                        <div className="text-sm text-gray-500">${stock.price}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-red-600 font-semibold">{stock.changePercent}%</div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="btn-secondary bg-transparent mt-1"
                        onClick={() => onTradeStock(stock.symbol)}
                      >
                        BUY DIP
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="minimal-card mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search stocks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 form-input"
                  />
                </div>

                <Select value={selectedSector} onValueChange={setSelectedSector}>
                  <SelectTrigger className="w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All Sectors" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector === "all" ? "All Sectors" : sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alphabetical">Alphabetical</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="change-high">Gainers</SelectItem>
                    <SelectItem value="change-low">Losers</SelectItem>
                    <SelectItem value="volume">Volume</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-gray-900 text-white" : "btn-secondary bg-transparent"}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className={viewMode === "table" ? "bg-gray-900 text-white" : "btn-secondary bg-transparent"}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stocks Display */}
        {viewMode === "grid" ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedStocks.map((stock) => (
              <Card key={stock.symbol} className="minimal-card card-shadow hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{stock.logo}</span>
                      <div>
                        <CardTitle className="text-lg">{stock.symbol}</CardTitle>
                        <CardDescription className="text-sm">{stock.name}</CardDescription>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => toggleFavorite(stock.symbol)} className="p-1">
                      {favorites.includes(stock.symbol) ? (
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <StarOff className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">${stock.price}</div>
                    <div className={`flex items-center gap-1 ${stock.change >= 0 ? "text-green-700" : "text-red-600"}`}>
                      {stock.change >= 0 ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                      <span className="font-semibold">
                        {stock.change >= 0 ? "+" : ""}
                        {stock.changePercent}%
                      </span>
                    </div>
                  </div>

                  <div className="h-16">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stock.chartData}>
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke={stock.change >= 0 ? "#15803d" : "#dc2626"}
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Volume</div>
                      <div className="font-semibold">{formatNumber(stock.volume)}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Market Cap</div>
                      <div className="font-semibold">{formatNumber(stock.marketCap)}</div>
                    </div>
                  </div>

                  <Badge variant="secondary" className="bg-gray-100 text-gray-700 rounded-none">
                    {stock.sector}
                  </Badge>

                  <Button className="btn-primary w-full" onClick={() => onTradeStock(stock.symbol)}>
                    TRADE {stock.symbol}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="minimal-card">
            <CardContent className="p-0">
              <table className="portfolio-table">
                <thead>
                  <tr>
                    <th>STOCK</th>
                    <th>PRICE</th>
                    <th>CHANGE</th>
                    <th>VOLUME</th>
                    <th>MARKET CAP</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedStocks.map((stock) => (
                    <tr key={stock.symbol}>
                      <td>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFavorite(stock.symbol)}
                            className="p-1"
                          >
                            {favorites.includes(stock.symbol) ? (
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ) : (
                              <StarOff className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                          <span className="text-2xl">{stock.logo}</span>
                          <div>
                            <div className="font-semibold">{stock.symbol}</div>
                            <div className="text-sm text-gray-500">{stock.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="font-semibold">${stock.price}</td>
                      <td className={`${stock.change >= 0 ? "text-green-700" : "text-red-600"}`}>
                        <div className="flex items-center">
                          {stock.change >= 0 ? (
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 mr-1" />
                          )}
                          {stock.changePercent}%
                        </div>
                      </td>
                      <td>{formatNumber(stock.volume)}</td>
                      <td>{formatNumber(stock.marketCap)}</td>
                      <td>
                        <Button size="sm" className="btn-primary" onClick={() => onTradeStock(stock.symbol)}>
                          TRADE
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
