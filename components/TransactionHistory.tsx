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
  Clock
} from "lucide-react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useTransactions } from "@/hooks/useTransactions"

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
      transaction.input_token.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.output_token.toLowerCase().includes(searchQuery.toLowerCase())
    
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

  const getTokenSymbol = (address: string) => {
    // Map common token addresses to symbols
    const tokenMap: Record<string, string> = {
      'So11111111111111111111111111111111111111112': 'SOL',
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': 'USDC',
    }
    
    // Check if it's an xStock (starts with Xs)
    if (address.startsWith('Xs')) {
      return 'xStock'
    }
    
    return tokenMap[address] || `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  const getSolscanUrl = (signature: string) => {
    return `https://solscan.io/tx/${signature}`
  }

  if (!publicKey) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Transaction History</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Wallet Not Connected</h3>
              <p className="text-gray-600">Please connect your wallet to view transaction history.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Transaction History</h1>
          <Button disabled>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Loading...
          </Button>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Transaction History</h1>
          <Button onClick={refetch}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span>Error: {error}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Transaction History</h1>
          <p className="text-gray-600">{transactions.length} total transactions</p>
        </div>
        <Button onClick={refetch}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by signature or token..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="buy">Buy</SelectItem>
                <SelectItem value="sell">Sell</SelectItem>
                <SelectItem value="rebalance">Rebalance</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
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

      {/* Transaction List */}
      <div className="space-y-4">
        {sortedTransactions.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Transactions Found</h3>
                <p className="text-gray-600">
                  {searchQuery || filterType !== "all" 
                    ? "No transactions match your current filters." 
                    : "No transactions found for this wallet. Start trading to see your history here."}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          sortedTransactions.map((transaction) => (
            <Card key={transaction.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {transaction.transaction_type === 'buy' ? (
                        <ArrowUpRight className="h-5 w-5 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-5 w-5 text-red-500" />
                      )}
                      <Badge 
                        variant={transaction.transaction_type === 'buy' ? 'default' : 'secondary'}
                        className={transaction.transaction_type === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                      >
                        {transaction.transaction_type.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          {transaction.input_amount.toLocaleString()} {getTokenSymbol(transaction.input_token)}
                        </span>
                        <span className="text-gray-400">→</span>
                        <span className="font-semibold">
                          {transaction.output_amount.toLocaleString()} {getTokenSymbol(transaction.output_token)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(transaction.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <Badge 
                        variant={transaction.status === 'confirmed' ? 'default' : 'secondary'}
                        className={
                          transaction.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : transaction.status === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }
                      >
                        {transaction.status.toUpperCase()}
                      </Badge>
                                             {transaction.price_impact && (
                         <div className="text-sm text-gray-600 mt-1">
                           Impact: {transaction.price_impact.toFixed(2)}%
                         </div>
                       )}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(getSolscanUrl(transaction.transaction_signature), '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Signature:</span>
                      <div className="font-mono text-xs">
                        {transaction.transaction_signature.slice(0, 8)}...{transaction.transaction_signature.slice(-8)}
                      </div>
                    </div>
                                         {transaction.fees && transaction.fees > 0 && (
                       <div>
                         <span className="text-gray-600">Fees:</span>
                         <div>{transaction.fees.toFixed(6)} SOL</div>
                       </div>
                     )}
                     {transaction.slippage && (
                       <div>
                         <span className="text-gray-600">Slippage:</span>
                         <div>{transaction.slippage.toFixed(2)}%</div>
                       </div>
                     )}
                    {transaction.block_time && (
                      <div>
                        <span className="text-gray-600">Block Time:</span>
                        <div>{new Date(transaction.block_time).toLocaleString()}</div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
