"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
// Removed Solana wallet adapter import - using Privy instead
import { Shield, Bell, Wallet, RefreshCw, AlertTriangle, CheckCircle, Download, Trash2 } from "lucide-react"
import { useWallets } from '@privy-io/react-auth'

interface SettingsProps {
  onNavigate: (page: "landing" | "dashboard" | "markets" | "portfolio" | "analytics" | "history" | "settings") => void
  onLogout: () => void
}

export function Settings({ onNavigate, onLogout }: SettingsProps) {
  const { wallets } = useWallets()
  const connected = wallets.length > 0
  const publicKey = wallets[0]?.address

  // Portfolio Settings
  const [autoRebalance, setAutoRebalance] = useState(true)
  const [rebalanceThreshold, setRebalanceThreshold] = useState([5])
  const [rebalanceFrequency, setRebalanceFrequency] = useState("weekly")
  const [riskLevel, setRiskLevel] = useState([7])

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [priceAlerts, setPriceAlerts] = useState(true)
  const [rebalanceAlerts, setRebalanceAlerts] = useState(true)
  const [marketAlerts, setMarketAlerts] = useState(false)

  // Security Settings
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [showBalances, setShowBalances] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState("30")

  // Trading Settings
  const [defaultSlippage, setDefaultSlippage] = useState([0.5])
  const [maxSlippage, setMaxSlippage] = useState([2.0])
  const [confirmTrades, setConfirmTrades] = useState(true)

  // Profile Settings
  const [email, setEmail] = useState("user@example.com")
  const [timezone, setTimezone] = useState("UTC")
  const [currency, setCurrency] = useState("USD")

  const handleSaveSettings = () => {
    // Mock save functionality
  }

  const handleExportData = () => {
    // Mock export functionality
  }

  const handleDeleteAccount = () => {
    // Mock delete functionality
  }

  return (
    <div className="w-full">
      <div className="px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 tracking-tight">SETTINGS</h1>
          <p className="text-gray-600 text-lg">Manage your account preferences and trading settings</p>
        </div>

        <Tabs defaultValue="portfolio" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white border border-gray-200 rounded-none">
            <TabsTrigger
              value="portfolio"
              className="data-[state=active]:bg-gray-900 data-[state=active]:text-white rounded-none"
            >
              PORTFOLIO
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-gray-900 data-[state=active]:text-white rounded-none"
            >
              NOTIFICATIONS
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="data-[state=active]:bg-gray-900 data-[state=active]:text-white rounded-none"
            >
              SECURITY
            </TabsTrigger>
            <TabsTrigger
              value="trading"
              className="data-[state=active]:bg-gray-900 data-[state=active]:text-white rounded-none"
            >
              TRADING
            </TabsTrigger>
            <TabsTrigger
              value="account"
              className="data-[state=active]:bg-gray-900 data-[state=active]:text-white rounded-none"
            >
              ACCOUNT
            </TabsTrigger>
          </TabsList>

          {/* Portfolio Settings */}
          <TabsContent value="portfolio" className="space-y-6">
            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-gray-600" />
                  AUTO-REBALANCING
                </CardTitle>
                <CardDescription>Configure automatic portfolio rebalancing</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-semibold">Enable Auto-Rebalancing</Label>
                    <p className="text-sm text-gray-600">Automatically maintain target allocation</p>
                  </div>
                  <Switch checked={autoRebalance} onCheckedChange={setAutoRebalance} />
                </div>

                {autoRebalance && (
                  <>
                    <div>
                      <Label className="font-semibold mb-3 block">Rebalance Threshold: {rebalanceThreshold[0]}%</Label>
                      <Slider
                        value={rebalanceThreshold}
                        onValueChange={setRebalanceThreshold}
                        max={20}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <p className="text-sm text-gray-600 mt-2">Rebalance when allocation drifts by this percentage</p>
                    </div>

                    <div>
                      <Label className="font-semibold mb-3 block">Rebalance Frequency</Label>
                      <Select value={rebalanceFrequency} onValueChange={setRebalanceFrequency}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <CardTitle>RISK PROFILE</CardTitle>
                <CardDescription>Adjust your risk tolerance and investment strategy</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <Label className="font-semibold mb-3 block">Risk Level: {riskLevel[0]}/10</Label>
                  <Slider value={riskLevel} onValueChange={setRiskLevel} max={10} min={1} step={1} className="w-full" />
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>Conservative</span>
                    <span>Aggressive</span>
                  </div>
                </div>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Changing your risk level will trigger a portfolio rebalance on your next investment.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-gray-600" />
                  NOTIFICATION PREFERENCES
                </CardTitle>
                <CardDescription>Choose how you want to be notified about important events</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-semibold">Email Notifications</Label>
                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-semibold">Push Notifications</Label>
                    <p className="text-sm text-gray-600">Browser push notifications</p>
                  </div>
                  <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-semibold">Price Alerts</Label>
                    <p className="text-sm text-gray-600">Notify when stock prices change significantly</p>
                  </div>
                  <Switch checked={priceAlerts} onCheckedChange={setPriceAlerts} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-semibold">Rebalance Alerts</Label>
                    <p className="text-sm text-gray-600">Notify when portfolio is rebalanced</p>
                  </div>
                  <Switch checked={rebalanceAlerts} onCheckedChange={setRebalanceAlerts} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-semibold">Market Alerts</Label>
                    <p className="text-sm text-gray-600">Important market news and events</p>
                  </div>
                  <Switch checked={marketAlerts} onCheckedChange={setMarketAlerts} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="space-y-6">
            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-gray-600" />
                  SECURITY SETTINGS
                </CardTitle>
                <CardDescription>Protect your account and trading activity</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-semibold">Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-600">Add an extra layer of security</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      className={`rounded-none ${
                        twoFactorEnabled ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {twoFactorEnabled ? "ENABLED" : "DISABLED"}
                    </Badge>
                    <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-semibold">Show Portfolio Balances</Label>
                    <p className="text-sm text-gray-600">Display actual dollar amounts</p>
                  </div>
                  <Switch checked={showBalances} onCheckedChange={setShowBalances} />
                </div>

                <div>
                  <Label className="font-semibold mb-3 block">Session Timeout</Label>
                  <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="240">4 hours</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {connected && (
                  <div className="bg-gray-50 p-4">
                    <Label className="font-semibold mb-2 block">Connected Wallet</Label>
                    <div className="flex items-center gap-3">
                      <Wallet className="h-5 w-5 text-gray-600" />
                      <span className="font-mono text-sm">
                        {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}
                      </span>
                      <Button variant="outline" size="sm" onClick={onLogout} className="btn-secondary bg-transparent">
                        DISCONNECT
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trading */}
          <TabsContent value="trading" className="space-y-6">
            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <CardTitle>TRADING PREFERENCES</CardTitle>
                <CardDescription>Configure default trading parameters</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <Label className="font-semibold mb-3 block">Default Slippage Tolerance: {defaultSlippage[0]}%</Label>
                  <Slider
                    value={defaultSlippage}
                    onValueChange={setDefaultSlippage}
                    max={5}
                    min={0.1}
                    step={0.1}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-600 mt-2">Default slippage tolerance for new trades</p>
                </div>

                <div>
                  <Label className="font-semibold mb-3 block">Maximum Slippage: {maxSlippage[0]}%</Label>
                  <Slider
                    value={maxSlippage}
                    onValueChange={setMaxSlippage}
                    max={10}
                    min={0.5}
                    step={0.1}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-600 mt-2">Maximum allowed slippage for any trade</p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-semibold">Trade Confirmations</Label>
                    <p className="text-sm text-gray-600">Require confirmation before executing trades</p>
                  </div>
                  <Switch checked={confirmTrades} onCheckedChange={setConfirmTrades} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account */}
          <TabsContent value="account" className="space-y-6">
            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <CardTitle>PROFILE INFORMATION</CardTitle>
                <CardDescription>Manage your account details and preferences</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <Label htmlFor="email" className="font-semibold">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input mt-2"
                  />
                </div>

                <div>
                  <Label className="font-semibold mb-3 block">Timezone</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time</SelectItem>
                      <SelectItem value="PST">Pacific Time</SelectItem>
                      <SelectItem value="GMT">Greenwich Mean Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="font-semibold mb-3 block">Display Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="JPY">JPY (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="minimal-card">
              <CardHeader className="border-b border-gray-200">
                <CardTitle>DATA & PRIVACY</CardTitle>
                <CardDescription>Manage your data and account</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <Button variant="outline" onClick={handleExportData} className="btn-secondary bg-transparent w-full">
                  <Download className="h-4 w-4 mr-2" />
                  EXPORT MY DATA
                </Button>

                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>Danger Zone:</strong> These actions cannot be undone.
                  </AlertDescription>
                </Alert>

                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  DELETE ACCOUNT
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end pt-6">
          <Button onClick={handleSaveSettings} className="btn-primary px-8">
            <CheckCircle className="h-4 w-4 mr-2" />
            SAVE SETTINGS
          </Button>
        </div>
      </div>
    </div>
  )
}
