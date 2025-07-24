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
import { useWallet } from '@solana/wallet-adapter-react'
import { useTransactions } from "@/hooks/useTransactions"
import { format } from "date-fns"

interface TransactionHistoryProps {
  onNavigate: (page: "landing" | "dashboard" | "markets" | "portfolio" | "analytics" | "history" | "settings") => void
  onLogout: () => void
}

export function TransactionHistory({ onNavigate, onLogout }: TransactionHistoryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const { publicKey } = useWallet()
  const walletAddress = publicKey?.toBase58() || null
  const { transactions, loading, error } = useTransactions(walletAddress)

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.output_token.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.input_token.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = filterType === "all" || tx.transaction_type === filterType
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
              <div className="text-3xl font-bold text-gray-900 mb-2">{transactions.length}</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">Total Transactions</div>
            </CardContent>
          </Card>
          <Card className="minimal-card">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-700 mb-2">
                {transactions.filter((tx) => tx.transaction_type === "buy").length}
              </div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">Buy Orders</div>
            </CardContent>
          </Card>
          <Card className="minimal-card">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {transactions.filter((tx) => tx.transaction_type === "sell").length}
              </div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">Sell Orders</div>
            </CardContent>
          </Card>
          <Card className="minimal-card">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                ${transactions.length}
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
                          <div className="font-semibold">{format(new Date(tx.timestamp), "MM/dd/yyyy")}</div>
                          <div className="text-sm text-gray-500">{format(new Date(tx.timestamp), "HH:mm:ss")}</div>
                        </div>
                      </td>
                      <td>
                        <Badge
                          className={`rounded-none ${
                            tx.transaction_type === "buy" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {tx.transaction_type === "buy" ? (
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 mr-1" />
                          )}
                          {tx.transaction_type.toUpperCase()}
                        </Badge>
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{tx.output_token.symbol}</span>
                          <div>
                            <div className="font-semibold">{tx.output_token.symbol}</div>
                            <div className="text-sm text-gray-500">{tx.output_token.name}</div>
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
