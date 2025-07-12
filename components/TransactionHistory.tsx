"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Filter,
  Download,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Copy,
} from "lucide-react"

interface TransactionHistoryProps {
  onNavigate: (page: "landing" | "dashboard" | "markets" | "portfolio" | "analytics" | "history" | "settings") => void
  onLogout: () => void
}

// Mock transaction data
const mockTransactions = [
  {
    id: "tx_001",
    date: "2024-01-15",
    time: "14:32:15",
    type: "buy",
    symbol: "xTSLA",
    name: "Tesla Inc",
    quantity: 2.5,
    price: 245.8,
    total: 614.5,
    fees: 0.12,
    status: "confirmed",
    signature: "5KJp9X2vN8qR7mL3wE6tY1uI4oP8sA9dF2gH7jK5nM1xC3vB6zQ4rT8yU2wE5tY7uI9oP1sA3dF6gH8jK2nM4xC7vB9z",
    logo: "🚗",
    priceImpact: 0.15,
    slippage: 0.08,
  },
  {
    id: "tx_002",
    date: "2024-01-14",
    time: "09:45:22",
    type: "sell",
    symbol: "xAAPL",
    name: "Apple Inc",
    quantity: 1.0,
    price: 198.45,
    total: 198.45,
    fees: 0.08,
    status: "confirmed",
    signature: "3Hp7Y4wN6qR5mL1xE8tY3uI2oP6sA7dF4gH9jK3nM5xC1vB8zQ2rT6yU4wE7tY5uI1oP3sA5dF8gH1jK4nM6xC9vB2z",
    logo: "🍎",
    priceImpact: 0.12,
    slippage: 0.05,
  },
  {
    id: "tx_003",
    date: "2024-01-12",
    time: "16:18:45",
    type: "buy",
    symbol: "xMSFT",
    name: "Microsoft Corporation",
    quantity: 1.5,
    price: 425.3,
    total: 637.95,
    fees: 0.15,
    status: "confirmed",
    signature: "7Lp1Z8xN4qR9mL5wE2tY7uI6oP4sA1dF8gH3jK7nM9xC5vB2zQ6rT4yU8wE1tY9uI3oP7sA9dF2gH5jK8nM2xC1vB6z",
    logo: "💻",
    priceImpact: 0.18,
    slippage: 0.12,
  },
  {
    id: "tx_004",
    date: "2024-01-10",
    time: "11:22:33",
    type: "buy",
    symbol: "xGOOGL",
    name: "Alphabet Inc",
    quantity: 3.0,
    price: 172.85,
    total: 518.55,
    fees: 0.11,
    status: "confirmed",
    signature: "9Np5X2vN8qR3mL7wE4tY1uI8oP2sA5dF6gH1jK9nM3xC7vB4zQ8rT2yU6wE9tY3uI7oP5sA3dF4gH7jK6nM8xC1vB2z",
    logo: "🔍",
    priceImpact: 0.22,
    slippage: 0.15,
  },
  {
    id: "tx_005",
    date: "2024-01-08",
    time: "13:55:18",
    type: "buy",
    symbol: "xAMZN",
    name: "Amazon.com Inc",
    quantity: 2.0,
    price: 188.9,
    total: 377.8,
    fees: 0.09,
    status: "failed",
    signature: "1Bp3Y6wN2qR7mL9wE6tY5uI4oP8sA1dF2gH5jK1nM7xC9vB6zQ4rT8yU2wE5tY7uI9oP1sA3dF6gH8jK2nM4xC7vB9z",
    logo: "📦",
    priceImpact: 0.28,
    slippage: 0.2,
    failureReason: "Insufficient slippage tolerance",
  },
]

export function TransactionHistory({ onNavigate, onLogout }: TransactionHistoryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredTransactions = mockTransactions.filter((tx) => {
    const matchesSearch =
      tx.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = filterType === "all" || tx.type === filterType
    const matchesStatus = filterStatus === "all" || tx.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="w-full">
      <div className="px-6 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 tracking-tight">TRANSACTION HISTORY</h1>
            <p className="text-gray-600 text-lg">Complete record of all your trading activity</p>
          </div>
          <Button variant="outline" className="btn-secondary bg-transparent mt-4 lg:mt-0">
            <Download className="h-4 w-4 mr-2" />
            EXPORT CSV
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="minimal-card">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">{mockTransactions.length}</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">Total Transactions</div>
            </CardContent>
          </Card>
          <Card className="minimal-card">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-700 mb-2">
                {mockTransactions.filter((tx) => tx.type === "buy").length}
              </div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">Buy Orders</div>
            </CardContent>
          </Card>
          <Card className="minimal-card">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {mockTransactions.filter((tx) => tx.type === "sell").length}
              </div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">Sell Orders</div>
            </CardContent>
          </Card>
          <Card className="minimal-card">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                ${mockTransactions.reduce((sum, tx) => sum + tx.fees, 0).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">Total Fees</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="minimal-card mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 form-input"
                />
              </div>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Transaction Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="buy">Buy Orders</SelectItem>
                  <SelectItem value="sell">Sell Orders</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card className="minimal-card">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="heading-md">TRANSACTION DETAILS</CardTitle>
            <CardDescription>Detailed breakdown of all trading activity</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="portfolio-table">
                <thead>
                  <tr>
                    <th>DATE & TIME</th>
                    <th>TYPE</th>
                    <th>ASSET</th>
                    <th>QUANTITY</th>
                    <th>PRICE</th>
                    <th>TOTAL</th>
                    <th>FEES</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id}>
                      <td>
                        <div>
                          <div className="font-semibold">{tx.date}</div>
                          <div className="text-sm text-gray-500">{tx.time}</div>
                        </div>
                      </td>
                      <td>
                        <Badge
                          className={`rounded-none ${
                            tx.type === "buy" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {tx.type === "buy" ? (
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 mr-1" />
                          )}
                          {tx.type.toUpperCase()}
                        </Badge>
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{tx.logo}</span>
                          <div>
                            <div className="font-semibold">{tx.symbol}</div>
                            <div className="text-sm text-gray-500">{tx.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="font-semibold">{tx.quantity}</td>
                      <td>${tx.price}</td>
                      <td className="font-semibold">${tx.total}</td>
                      <td className="text-gray-600">${tx.fees}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(tx.status)}
                          <Badge className={`rounded-none ${getStatusColor(tx.status)}`}>
                            {tx.status.toUpperCase()}
                          </Badge>
                        </div>
                        {tx.status === "failed" && tx.failureReason && (
                          <div className="text-xs text-red-600 mt-1">{tx.failureReason}</div>
                        )}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(tx.signature)}
                            className="p-1"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`https://solscan.io/tx/${tx.signature}`, "_blank")}
                            className="p-1"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Clock className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Transactions Found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
