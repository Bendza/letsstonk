"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowUpRight, ArrowDownRight, Zap, AlertTriangle, CheckCircle, Loader2, X } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface TradingModalProps {
  symbol: string
  isOpen: boolean
  onClose: () => void
}

// Mock stock data
const mockStockData: Record<string, any> = {
  xTSLA: {
    name: "Tesla Inc",
    price: 248.5,
    change: 12.3,
    changePercent: 5.2,
    logo: "🚗",
    chartData: [
      { time: "09:30", price: 236 },
      { time: "10:00", price: 240 },
      { time: "10:30", price: 235 },
      { time: "11:00", price: 245 },
      { time: "11:30", price: 248.5 },
    ],
  },
  xAAPL: {
    name: "Apple Inc",
    price: 195.89,
    change: -2.45,
    changePercent: -1.2,
    logo: "🍎",
    chartData: [
      { time: "09:30", price: 200 },
      { time: "10:00", price: 198 },
      { time: "10:30", price: 202 },
      { time: "11:00", price: 197 },
      { time: "11:30", price: 195.89 },
    ],
  },
  // Add more stocks as needed
}

export function TradingModal({ symbol, isOpen, onClose }: TradingModalProps) {
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy")
  const [amountType, setAmountType] = useState<"usd" | "shares">("usd")
  const [amount, setAmount] = useState("")
  const [slippage, setSlippage] = useState([0.5])
  const [isExecuting, setIsExecuting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)

  const stock = mockStockData[symbol] || mockStockData.xTSLA
  const usdcBalance = 5000 // Mock USDC balance
  const stockBalance = 10 // Mock stock balance

  const amountValue = Number.parseFloat(amount) || 0
  const estimatedShares = amountType === "usd" ? amountValue / stock.price : amountValue
  const estimatedUSD = amountType === "shares" ? amountValue * stock.price : amountValue
  const priceImpact = estimatedUSD > 1000 ? (estimatedUSD / 10000) * 100 : 0.1
  const networkFee = 0.0001
  const totalCost = orderType === "buy" ? estimatedUSD + networkFee : estimatedUSD - networkFee

  useEffect(() => {
    if (!isOpen) {
      setAmount("")
      setShowConfirmation(false)
      setOrderComplete(false)
      setIsExecuting(false)
    }
  }, [isOpen])

  const handleExecuteOrder = async () => {
    setIsExecuting(true)

    // Simulate order execution
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setIsExecuting(false)
    setShowConfirmation(false)
    setOrderComplete(true)

    // Auto close after success
    setTimeout(() => {
      onClose()
    }, 2000)
  }

  const canExecuteOrder = () => {
    if (!amountValue || amountValue <= 0) return false
    if (orderType === "buy" && totalCost > usdcBalance) return false
    if (orderType === "sell" && estimatedShares > stockBalance) return false
    return true
  }

  if (orderComplete) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">ORDER EXECUTED!</h3>
            <p className="text-gray-600 mb-4">
              Successfully {orderType === "buy" ? "bought" : "sold"} {estimatedShares.toFixed(4)} shares of {symbol}
            </p>
            <Badge className="bg-green-100 text-green-800 rounded-none">Transaction ID: 0x1234...5678</Badge>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{stock.logo}</span>
              <div>
                <DialogTitle className="text-2xl">{symbol}</DialogTitle>
                <DialogDescription className="text-lg">{stock.name}</DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Stock Info & Chart */}
          <div className="space-y-6">
            <Card className="minimal-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">${stock.price}</div>
                  <div className={`flex items-center gap-1 ${stock.change >= 0 ? "text-green-700" : "text-red-600"}`}>
                    {stock.change >= 0 ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                    <span className="font-semibold text-lg">
                      {stock.change >= 0 ? "+" : ""}
                      {stock.changePercent}%
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stock.chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke={stock.change >= 0 ? "#15803d" : "#dc2626"}
                        strokeWidth={3}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="minimal-card">
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-wide">Your Balances</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>USDC Balance:</span>
                  <span className="font-semibold">${usdcBalance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{symbol} Balance:</span>
                  <span className="font-semibold">{stockBalance} shares</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trading Panel */}
          <div className="space-y-6">
            {!showConfirmation ? (
              <>
                <Tabs value={orderType} onValueChange={(value) => setOrderType(value as "buy" | "sell")}>
                  <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200 rounded-none">
                    <TabsTrigger
                      value="buy"
                      className="data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-none"
                    >
                      BUY
                    </TabsTrigger>
                    <TabsTrigger
                      value="sell"
                      className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none"
                    >
                      SELL
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="buy" className="space-y-6 mt-6">
                    <Card className="minimal-card">
                      <CardHeader>
                        <CardTitle className="text-green-700">BUY {symbol}</CardTitle>
                        <CardDescription>Purchase tokenized shares</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                          <Button
                            variant={amountType === "usd" ? "default" : "outline"}
                            onClick={() => setAmountType("usd")}
                            className={amountType === "usd" ? "bg-gray-900 text-white" : "btn-secondary bg-transparent"}
                          >
                            USD Amount
                          </Button>
                          <Button
                            variant={amountType === "shares" ? "default" : "outline"}
                            onClick={() => setAmountType("shares")}
                            className={
                              amountType === "shares" ? "bg-gray-900 text-white" : "btn-secondary bg-transparent"
                            }
                          >
                            Share Count
                          </Button>
                        </div>

                        <div>
                          <Label htmlFor="amount">{amountType === "usd" ? "USD Amount" : "Number of Shares"}</Label>
                          <Input
                            id="amount"
                            type="number"
                            placeholder={amountType === "usd" ? "100.00" : "0.5"}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="form-input text-lg font-semibold"
                          />
                        </div>

                        <div>
                          <Label>Slippage Tolerance: {slippage[0]}%</Label>
                          <Slider
                            value={slippage}
                            onValueChange={setSlippage}
                            max={5}
                            min={0.1}
                            step={0.1}
                            className="mt-2"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="sell" className="space-y-6 mt-6">
                    <Card className="minimal-card">
                      <CardHeader>
                        <CardTitle className="text-red-600">SELL {symbol}</CardTitle>
                        <CardDescription>Sell your tokenized shares</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                          <Button
                            variant={amountType === "usd" ? "default" : "outline"}
                            onClick={() => setAmountType("usd")}
                            className={amountType === "usd" ? "bg-gray-900 text-white" : "btn-secondary bg-transparent"}
                          >
                            USD Amount
                          </Button>
                          <Button
                            variant={amountType === "shares" ? "default" : "outline"}
                            onClick={() => setAmountType("shares")}
                            className={
                              amountType === "shares" ? "bg-gray-900 text-white" : "btn-secondary bg-transparent"
                            }
                          >
                            Share Count
                          </Button>
                        </div>

                        <div>
                          <Label htmlFor="amount">{amountType === "usd" ? "USD Amount" : "Number of Shares"}</Label>
                          <Input
                            id="amount"
                            type="number"
                            placeholder={amountType === "usd" ? "100.00" : "0.5"}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="form-input text-lg font-semibold"
                          />
                        </div>

                        <div>
                          <Label>Slippage Tolerance: {slippage[0]}%</Label>
                          <Slider
                            value={slippage}
                            onValueChange={setSlippage}
                            max={5}
                            min={0.1}
                            step={0.1}
                            className="mt-2"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                {/* Order Preview */}
                {amountValue > 0 && (
                  <Card className="minimal-card">
                    <CardHeader>
                      <CardTitle className="text-sm uppercase tracking-wide">Order Preview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span>Estimated Shares:</span>
                        <span className="font-semibold">{estimatedShares.toFixed(4)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated USD:</span>
                        <span className="font-semibold">${estimatedUSD.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Price Impact:</span>
                        <span className={`font-semibold ${priceImpact > 1 ? "text-red-600" : "text-gray-900"}`}>
                          {priceImpact.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Network Fee:</span>
                        <span className="font-semibold">${networkFee.toFixed(4)}</span>
                      </div>
                      <div className="border-t pt-3 flex justify-between text-lg font-bold">
                        <span>Total {orderType === "buy" ? "Cost" : "Receive"}:</span>
                        <span>${totalCost.toFixed(2)}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {priceImpact > 1 && (
                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800">
                      High price impact detected ({priceImpact.toFixed(2)}%). Consider reducing order size.
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={() => setShowConfirmation(true)}
                  disabled={!canExecuteOrder()}
                  className={`w-full text-lg py-6 ${
                    orderType === "buy"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  PREVIEW {orderType.toUpperCase()} ORDER
                </Button>
              </>
            ) : (
              /* Confirmation Screen */
              <Card className="minimal-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    CONFIRM ORDER
                  </CardTitle>
                  <CardDescription>Review and confirm your trade</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gray-50 p-4 space-y-3">
                    <div className="flex justify-between text-lg">
                      <span className="font-semibold">
                        {orderType.toUpperCase()} {symbol}
                      </span>
                      <span className="font-bold">{estimatedShares.toFixed(4)} shares</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Price per share:</span>
                      <span>${stock.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Slippage tolerance:</span>
                      <span>{slippage[0]}%</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-3">
                      <span>Total {orderType === "buy" ? "Cost" : "Receive"}:</span>
                      <span>${totalCost.toFixed(2)}</span>
                    </div>
                  </div>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      This transaction will be executed on Solana blockchain and cannot be reversed.
                    </AlertDescription>
                  </Alert>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowConfirmation(false)}
                      className="flex-1 btn-secondary bg-transparent"
                    >
                      BACK
                    </Button>
                    <Button
                      onClick={handleExecuteOrder}
                      disabled={isExecuting}
                      className={`flex-1 ${
                        orderType === "buy" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                      } text-white`}
                    >
                      {isExecuting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          EXECUTING...
                        </>
                      ) : (
                        `CONFIRM ${orderType.toUpperCase()}`
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
