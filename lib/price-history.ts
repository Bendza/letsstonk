export interface PriceHistoryPoint {
  timestamp: string
  price: number
  volume_24h: number
  market_cap: number
}

// Fetch price history from Jupiter API or other sources
export async function getPriceHistory(
  tokenAddress: string,
  symbol: string,
  timeframe: '1h' | '1d' | '7d' | '30d' = '1d'
): Promise<PriceHistoryPoint[]> {
  try {
    // For now, we'll use a mock implementation since Jupiter doesn't provide historical data
    // In a real implementation, you would use APIs like:
    // - CoinGecko API for historical price data
    // - Birdeye API for Solana token history
    // - DexScreener API for DEX price history
    
    
    // Generate mock historical data based on current price patterns
    const mockData = await generateRealisticPriceHistory(symbol, timeframe)
    
    return mockData
  } catch (error) {
    return generateFallbackPriceHistory()
  }
}

// Generate realistic price history based on current market patterns
async function generateRealisticPriceHistory(
  symbol: string,
  timeframe: '1h' | '1d' | '7d' | '30d'
): Promise<PriceHistoryPoint[]> {
  // Get current price from our existing price fetching logic
  const currentPrice = await getCurrentPrice(symbol)
  
  const points = getTimeframePoints(timeframe)
  const data: PriceHistoryPoint[] = []
  
  // Start from a price that's reasonable for the timeframe
  let basePrice = currentPrice * getTimeframeMultiplier(timeframe)
  
  for (let i = 0; i < points; i++) {
    const timestamp = getTimestampForPoint(i, timeframe)
    
    // Add realistic price movement
    const volatility = getVolatilityForTimeframe(timeframe)
    const change = (Math.random() - 0.5) * volatility
    basePrice = basePrice * (1 + change)
    
    // Add trend towards current price
    const trendFactor = (currentPrice - basePrice) / points * 0.1
    basePrice = basePrice + trendFactor
    
    data.push({
      timestamp,
      price: Math.max(0, basePrice),
      volume_24h: Math.random() * 1000000, // Mock volume
      market_cap: basePrice * 1000000 // Mock market cap
    })
  }
  
  // Ensure last point is close to current price
  data[data.length - 1].price = currentPrice
  
  return data
}

async function getCurrentPrice(symbol: string): Promise<number> {
  // This would typically fetch from your existing price API
  // For now, return a mock price based on symbol
  const mockPrices: Record<string, number> = {
    'AAPLx': 228.50,
    'TSLAx': 405.20,
    'GOOGLx': 178.30,
    'AMZNx': 185.40,
    'NVDAx': 165.40,
    'METAx': 716.34,
    'MSFTx': 445.96,
  }
  
  return mockPrices[symbol] || 100 + Math.random() * 500
}

function getTimeframePoints(timeframe: '1h' | '1d' | '7d' | '30d'): number {
  switch (timeframe) {
    case '1h': return 60 // 60 minutes
    case '1d': return 24 // 24 hours
    case '7d': return 168 // 7 days * 24 hours
    case '30d': return 720 // 30 days * 24 hours
    default: return 24
  }
}

function getTimeframeMultiplier(timeframe: '1h' | '1d' | '7d' | '30d'): number {
  switch (timeframe) {
    case '1h': return 0.995 // Very small change over 1 hour
    case '1d': return 0.98 // 2% change over 1 day
    case '7d': return 0.90 // 10% change over 7 days
    case '30d': return 0.80 // 20% change over 30 days
    default: return 0.95
  }
}

function getVolatilityForTimeframe(timeframe: '1h' | '1d' | '7d' | '30d'): number {
  switch (timeframe) {
    case '1h': return 0.001 // 0.1% volatility
    case '1d': return 0.02 // 2% volatility
    case '7d': return 0.05 // 5% volatility
    case '30d': return 0.08 // 8% volatility
    default: return 0.02
  }
}

function getTimestampForPoint(index: number, timeframe: '1h' | '1d' | '7d' | '30d'): string {
  const now = new Date()
  const totalPoints = getTimeframePoints(timeframe)
  
  let millisecondsPerPoint: number
  switch (timeframe) {
    case '1h': millisecondsPerPoint = 60 * 1000 // 1 minute
      break
    case '1d': millisecondsPerPoint = 60 * 60 * 1000 // 1 hour
      break
    case '7d': millisecondsPerPoint = 60 * 60 * 1000 // 1 hour
      break
    case '30d': millisecondsPerPoint = 60 * 60 * 1000 // 1 hour
      break
    default: millisecondsPerPoint = 60 * 60 * 1000
  }
  
  const timestamp = new Date(now.getTime() - (totalPoints - index) * millisecondsPerPoint)
  return timestamp.toISOString()
}

function generateFallbackPriceHistory(): PriceHistoryPoint[] {
  const fallbackData: PriceHistoryPoint[] = []
  const basePrice = 100
  
  for (let i = 0; i < 24; i++) {
    const timestamp = new Date(Date.now() - (24 - i) * 60 * 60 * 1000).toISOString()
    const price = basePrice + (Math.random() - 0.5) * 20
    
    fallbackData.push({
      timestamp,
      price: Math.max(0, price),
      volume_24h: Math.random() * 100000,
      market_cap: price * 100000
    })
  }
  
  return fallbackData
}

export function generateMockChartData(currentPrice: number, points: number = 24): { value: number }[] {
  const data: { value: number }[] = []
  let price = currentPrice * 0.95 // Start 5% below current price
  
  for (let i = 0; i < points; i++) {
    // Add some random volatility
    const change = (Math.random() - 0.5) * 0.02 // ±1% random change
    price = price * (1 + change)
    
    // Trend slightly upward to end near current price
    const trendFactor = 1 + (0.05 / points) // Slight upward trend
    price = price * trendFactor
    
    data.push({ value: Math.max(0, price) })
  }
  
  // Ensure the last point is close to current price
  data[data.length - 1].value = currentPrice
  
  return data
} 