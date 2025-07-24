"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, 
  RefreshCw, 
  ArrowUpRight, 
  ArrowDownRight, 
  ExternalLink,
  AlertCircle,
  Clock,
  Download,
  Copy
} from "lucide-react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useTransactions } from "@/hooks/useTransactions"
import { SolscanLogo } from "@/components/SolscanLogo"

export function TransactionHistory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  
  const { publicKey } = useWallet()
  const { transactions, loading, error, refetch } = useTransactions(publicKey?.toString() || null)

  // Filter and search transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = !searchQuery || 
      transaction.transaction_signature.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getTokenInfo(transaction.input_token).symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getTokenInfo(transaction.output_token).symbol.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesType = filterType === "all" || transaction.transaction_type === filterType
    
    return matchesSearch && matchesType
  })

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case "amount":
        return b.input_amount - a.input_amount
      case "type":
        return a.transaction_type.localeCompare(b.transaction_type)
      default:
        return 0
    }
  })

  // Enhanced token info mapping with proper decimals
  const getTokenInfo = (address: string) => {
    const tokenMap: Record<string, { symbol: string; name: string; logo: string; decimals: number }> = {
      'So11111111111111111111111111111111111111112': { symbol: 'SOL', name: 'Solana', logo: '◎', decimals: 9 },
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': { symbol: 'USDC', name: 'USD Coin', logo: '💵', decimals: 6 },
      
      // xStock tokens - most use 6 decimals
      'XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB': { symbol: 'TSLAx', name: 'Tesla xStock', logo: '🚗', decimals: 6 },
      'XsbEhLAtcf6HdfpFZ5xEMdqW8nfAvcsP5bdudRLJzJp': { symbol: 'AAPLx', name: 'Apple xStock', logo: '🍎', decimals: 6 },
      'XsCPL9dNWBMvFtTmwcCA5v3xWPSMEBCszbQdiLLq6aN': { symbol: 'GOOGLx', name: 'Google xStock', logo: '🔍', decimals: 6 },
      'Xs3eBt7uRfJX8QUs4suhyU8p2M6DoUDrJyWBa8LLZsg': { symbol: 'AMZNx', name: 'Amazon xStock', logo: '📦', decimals: 6 },
      'Xs8S1uUs1zvS2p7iwtsG3b6fkhpvmwz4GYU3gWAmWHZ': { symbol: 'NVDAx', name: 'NVIDIA xStock', logo: '🎮', decimals: 6 },
      'Xs151QeqTCiuKtinzfRATnUESM2xTU6V9Vy538ci': { symbol: 'WMTx', name: 'Walmart xStock', logo: '🛒', decimals: 6 },
      'Xsa62P5mvPszXL1krVUnU5ar38bBSVcWAB6fmPCo5Zu': { symbol: 'PGx', name: 'P&G xStock', logo: '🧴', decimals: 6 },
      
      // QQQ xStock from the actual transaction
      'QQQQj3HGQp3mKpJYr0FKJE5iWsJDBRBRnXmEMp1JaTE': { symbol: 'QQQx', name: 'QQQ xStock', logo: '📊', decimals: 6 },
    }
    
    if (tokenMap[address]) {
      return tokenMap[address]
    }
    
    // Check if it's an xStock by address pattern
    if (address.startsWith('Xs') || address.startsWith('QQQQ')) {
      return { symbol: 'xStock', name: 'Tokenized Stock', logo: '📈', decimals: 6 }
    }
    
    return { 
      symbol: `${address.slice(0, 4)}...${address.slice(-4)}`, 
      name: 'Unknown Token',
      logo: '❓',
      decimals: 6
    }
  }

  const getSolscanUrl = (signature: string) => {
    return `https://solscan.io/tx/${signature}`
  }

  const formatAmount = (amount: number, decimals: number) => {
    // Convert from smallest unit to display unit
    const displayAmount = amount / Math.pow(10, decimals)
    
    if (displayAmount >= 1000000) {
      return `${(displayAmount / 1000000).toFixed(3)}M`
    } else if (displayAmount >= 1000) {
      return `${(displayAmount / 1000).toFixed(3)}K`
    } else if (displayAmount >= 1) {
      return displayAmount.toFixed(6)
    } else {
      return displayAmount.toFixed(8)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (!publicKey) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Wallet Not Connected</h2>
            <p className="text-gray-600">Please connect your wallet to view transaction history.</p>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Transaction History</h1>
            <p className="text-gray-600">Complete record of all your trading activity</p>
          </div>
        </div>
        
        {/* Loading State */}
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Transaction History</h2>
            <p className="text-gray-600 mb-4">Fetching your trading activity...</p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-gray-800 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-800 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-gray-800 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Transaction History Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={refetch} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2 tracking-tight">TRANSACTION HISTORY</h1>
          <p className="text-gray-600 text-lg">Complete record of all your trading activity</p>
        </div>
        <div className="flex items-center gap-3 mt-4 lg:mt-0">
          <Button onClick={refetch} variant="outline" className="btn-secondary bg-transparent">
            <RefreshCw className="h-4 w-4 mr-2" />
            REFRESH
          </Button>
          <Button variant="outline" className="btn-secondary bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            EXPORT CSV
          </Button>
        </div>
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
              {transactions.filter((tx) => tx.status === 'confirmed').length}
            </div>
            <div className="text-sm text-gray-600 uppercase tracking-wide">Confirmed</div>
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
                <SelectValue placeholder="Transaction Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="buy">Buy Orders</SelectItem>
                <SelectItem value="sell">Sell Orders</SelectItem>
                <SelectItem value="rebalance">Rebalance</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="amount">Amount</SelectItem>
                <SelectItem value="type">Type</SelectItem>
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
          {sortedTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Clock className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Transactions Found</h3>
              <p className="text-gray-500">
                {searchQuery || filterType !== "all" 
                  ? "Try adjusting your search criteria or filters" 
                  : "Start trading to see your transaction history here"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="portfolio-table">
                <thead>
                  <tr>
                    <th>DATE & TIME</th>
                    <th>TYPE</th>
                    <th>FROM</th>
                    <th>TO</th>
                    <th>AMOUNT IN</th>
                    <th>AMOUNT OUT</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTransactions.map((transaction) => {
                    const inputToken = getTokenInfo(transaction.input_token)
                    const outputToken = getTokenInfo(transaction.output_token)
                    
                    return (
                      <tr key={transaction.id}>
                        <td>
                          <div>
                            <div className="font-semibold">{new Date(transaction.created_at).toLocaleDateString()}</div>
                            <div className="text-sm text-gray-500">{new Date(transaction.created_at).toLocaleTimeString()}</div>
                          </div>
                        </td>
                        <td>
                          <Badge 
                            className={`rounded-none ${
                              transaction.transaction_type === "buy" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {transaction.transaction_type === "buy" ? (
                              <ArrowUpRight className="h-3 w-3 mr-1" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3 mr-1" />
                            )}
                            {transaction.transaction_type.toUpperCase()}
                          </Badge>
                        </td>
                        <td>
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{inputToken.logo}</span>
                            <div>
                              <div className="font-semibold">{inputToken.symbol}</div>
                              <div className="text-sm text-gray-500">{inputToken.name}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{outputToken.logo}</span>
                            <div>
                              <div className="font-semibold">{outputToken.symbol}</div>
                              <div className="text-sm text-gray-500">{outputToken.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="font-semibold">
                          {formatAmount(transaction.input_amount, inputToken.decimals)}
                        </td>
                        <td className="font-semibold">
                          {formatAmount(transaction.output_amount, outputToken.decimals)}
                        </td>
                        <td>
                          <Badge 
                            className={`rounded-none ${
                              transaction.status === 'confirmed' 
                                ? 'bg-green-100 text-green-800' 
                                : transaction.status === 'failed'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {transaction.status.toUpperCase()}
                          </Badge>
                          {transaction.price_impact && (
                            <div className="text-xs text-gray-500 mt-1">
                              Impact: {transaction.price_impact.toFixed(2)}%
                            </div>
                          )}
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(transaction.transaction_signature)}
                              className="p-1"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(getSolscanUrl(transaction.transaction_signature), "_blank")}
                              className="p-1 flex items-center gap-1"
                            >
                              <SolscanLogo className="h-4 w-4" />
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
