import { XStock } from './types'

// Frontend-only xStocks data - no database required
export const XSTOCKS_DATA: XStock[] = [
  {
    symbol: "AAPLx",
    address: "XsbEhLAtcf6HdfpFZ5xEMdqW8nfAvcsP5bdudRLJzJp",
    name: "Apple xStock",
    decimals: 6,
    tags: ["rwa-stock", "technology", "large-cap"],
    logoURI: "https://cdn.prod.website-files.com/655f3efc4be468487052e35a/6849799260ee65bf38841f90_Ticker%3DAAPL%2C%20Company%20Name%3DApple%20Inc.%2C%20size%3D256x256.svg",
    daily_volume: 9659164.951989,
    market_cap: 4861730.078482,
  },
  {
    symbol: "TSLAx",
    address: "XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB",
    name: "Tesla xStock",
    decimals: 6,
    tags: ["rwa-stock", "automotive", "large-cap", "electric-vehicles"],
    logoURI: "https://cdn.prod.website-files.com/655f3efc4be468487052e35a/684aaf9559b2312c162731f5_Ticker%3DTSLA%2C%20Company%20Name%3DTesla%20Inc.%2C%20size%3D256x256.svg",
    daily_volume: 9896047.668038,
    market_cap: 5086277.437819,
  },
  {
    symbol: "GOOGLx",
    address: "XsCPL9dNWBMvFtTmwcCA5v3xWPSMEBCszbQdiLLq6aN",
    name: "Alphabet xStock",
    decimals: 6,
    tags: ["rwa-stock", "technology", "large-cap", "search-engine"],
    logoURI: "https://cdn.prod.website-files.com/655f3efc4be468487052e35a/684aae04a3d8452e0ae4bad8_Ticker%3DGOOG%2C%20Company%20Name%3DAlphabet%20Inc.%2C%20size%3D256x256.svg",
    daily_volume: 7892189.643347,
    market_cap: 3346102.235571,
  },
  {
    symbol: "AMZNx",
    address: "Xs3eBt7uRfJX8QUs4suhyU8p2M6DoUDrJyWBa8LLZsg",
    name: "Amazon xStock",
    decimals: 6,
    tags: ["rwa-stock", "e-commerce", "large-cap", "cloud-computing"],
    logoURI: "https://cdn.prod.website-files.com/655f3efc4be468487052e35a/68497d354d7140b01657a793_Ticker%3DAMZN%2C%20Company%20Name%3DAmazon.com%20Inc.%2C%20size%3D256x256.svg",
    daily_volume: 5068887.174211,
    market_cap: 1507595.334291,
  },
  {
    symbol: "NVDAx",
    address: "Xsc9qvGR1efVDFGLrVsmkzv3qi45LTBjeUKSPmx9qEh",
    name: "NVIDIA xStock",
    decimals: 6,
    tags: ["rwa-stock", "technology", "large-cap", "semiconductors"],
    logoURI: "https://cdn.prod.website-files.com/655f3efc4be468487052e35a/684961bfb45e3c4d777b9997_Ticker%3DNVDA%2C%20Company%20Name%3DNVIDIA%20Corp%2C%20size%3D256x256.svg",
    daily_volume: 3743312.757202,
    market_cap: 891878.291427,
  },
  {
    symbol: "METAx",
    address: "Xsa62P5mvPszXL1krVUnU5ar38bBSVcWAB6fmPCo5Zu",
    name: "Meta xStock",
    decimals: 6,
    tags: ["rwa-stock", "technology", "large-cap", "social-media"],
    logoURI: "https://cdn.prod.website-files.com/655f3efc4be468487052e35a/68497dee3db1bae97b91ac05_Ticker%3DMETA%2C%20Company%20Name%3DMeta%20Platforms%20Inc.%2C%20size%3D256x256.svg",
    daily_volume: 2342678.326475,
    market_cap: 413125.556179,
  },
  {
    symbol: "MSTRx",
    address: "XsP7xzNPvEHS1m6qfanPUGjNmdnmsLKEoNAnHjdxxyZ",
    name: "MicroStrategy xStock",
    decimals: 6,
    tags: ["rwa-stock", "technology", "large-cap", "business-intelligence"],
    logoURI: "https://cdn.prod.website-files.com/655f3efc4be468487052e35a/684c0d47eee3a9c3fa12475a_Ticker%3DMSTR%2C%20Company%20Name%3DMicroStrategy%2C%20size%3D256x256.svg",
    daily_volume: 3947830.932785,
    market_cap: 976557.653323,
  },
  {
    symbol: "COINx",
    address: "Xs7ZdzSHLU9ftNJsii5fCeJhoRWSC32SQGzGQtePxNu",
    name: "Coinbase xStock",
    decimals: 6,
    tags: ["rwa-stock", "financial-services", "large-cap", "cryptocurrency"],
    logoURI: "https://cdn.prod.website-files.com/655f3efc4be468487052e35a/684c131b2d6d8cbe9e61a3dc_Ticker%3DCOIN%2C%20Company%20Name%3DCoinbase%2C%20size%3D256x256.svg",
    daily_volume: 4605452.674897,
    market_cap: 1274354.758270,
  },
  {
    symbol: "SPYx",
    address: "XsoCS1TfEyfFhfvj8EtZ528L3CaKBDBRqRapnBbDF2W",
    name: "SP500 xStock",
    decimals: 6,
    tags: ["rwa-etf", "index-fund", "large-cap"],
    logoURI: "https://cdn.prod.website-files.com/655f3efc4be468487052e35a/685116624ae31d5ceb724895_Ticker%3DSPX%2C%20Company%20Name%3DSP500%2C%20size%3D256x256.svg",
    daily_volume: 1276020.233196,
    market_cap: 166958.810493,
  },
  {
    symbol: "QQQx",
    address: "Xs8S1uUs1zvS2p7iwtsG3b6fkhpvmwz4GYU3gWAmWHZ",
    name: "Nasdaq xStock",
    decimals: 6,
    tags: ["rwa-etf", "technology", "large-cap"],
    logoURI: "https://cdn.prod.website-files.com/655f3efc4be468487052e35a/68511cb6e367f19f06664527_QQQx.svg",
    daily_volume: 10090234.910837,
    market_cap: 5274119.507574,
  },
  {
    symbol: "HOODx",
    address: "XsvNBAYkrDRNhA7wPHQfX3ZUXZyZLdnCQDfHZ56bzpg",
    name: "Robinhood xStock",
    decimals: 6,
    tags: ["rwa-stock", "financial-services", "medium-cap", "trading"],
    logoURI: "https://cdn.prod.website-files.com/655f3efc4be468487052e35a/684c0f39cede10b9afa4852f_Ticker%3DHOOD%2C%20Company%20Name%3DRobinhood%2C%20size%3D256x256.svg",
    daily_volume: 1049468.449931,
    market_cap: 127858.524905,
  },
  {
    symbol: "GLDx",
    address: "Xsv9hRk1z5ystj9MhnA7Lq4vjSsLwzL2nxrwmwtD3re",
    name: "Gold xStock",
    decimals: 6,
    tags: ["commodities"],
    logoURI: "https://cdn.prod.website-files.com/655f3efc4be468487052e35a/685123a7747987b071b10d47_Ticker%3DGLD%2C%20Company%20Name%3DGold%2C%20size%3D256x256.svg",
    daily_volume: 5046853.566529,
    market_cap: 1496068.450732,
  },
  {
    symbol: "CRCLx",
    address: "XsueG8BtpquVJX9LVLLEGuViXUungE6WmK5YZ3p3bd1",
    name: "Circle xStock",
    decimals: 6,
    tags: ["rwa-stock", "financial-services", "medium-cap", "cryptocurrency"],
    logoURI: "https://cdn.prod.website-files.com/655f3efc4be468487052e35a/6861ae6944c62c8dd3a0e165_CRCLx.svg",
    daily_volume: 9885716.735254,
    market_cap: 5076379.152702,
  },
  {
    symbol: "AMBRx",
    address: "XsaQTCgebC2KPbf27KUhdv5JFvHhQ4GDAPURwrEhAzb",
    name: "Amber xStock",
    decimals: 6,
    tags: ["rwa-stock", "financial-services", "small-cap", "cryptocurrency"],
    logoURI: "https://cdn.prod.website-files.com/655f3efc4be468487052e35a/68652e463fd5d0c86d866c65_AMBRx.svg",
    daily_volume: 1976337.448560,
    market_cap: 317035.276714,
  },
]

// Fallback prices (used if Jupiter API fails)
export const FALLBACK_PRICES: Record<string, number> = {
  "XsbEhLAtcf6HdfpFZ5xEMdqW8nfAvcsP5bdudRLJzJp": 228.5,  // AAPLx
  "XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB": 405.2,  // TSLAx
  "XsCPL9dNWBMvFtTmwcCA5v3xWPSMEBCszbQdiLLq6aN": 178.3,  // GOOGLx
  "Xs3eBt7uRfJX8QUs4suhyU8p2M6DoUDrJyWBa8LLZsg": 185.4,  // AMZNx
  "Xsc9qvGR1efVDFGLrVsmkzv3qi45LTBjeUKSPmx9qEh": 172.80, // NVDAx
  "Xsa62P5mvPszXL1krVUnU5ar38bBSVcWAB6fmPCo5Zu": 704.20, // METAx
  "XsP7xzNPvEHS1m6qfanPUGjNmdnmsLKEoNAnHjdxxyZ": 485.25, // MSTRx
  "Xs7ZdzSHLU9ftNJsii5fCeJhoRWSC32SQGzGQtePxNu": 325.45, // COINx
  "XsoCS1TfEyfFhfvj8EtZ528L3CaKBDBRqRapnBbDF2W": 566.96, // SPYx
  "Xs8S1uUs1zvS2p7iwtsG3b6fkhpvmwz4GYU3gWAmWHZ": 512.75, // QQQx
  "XsvNBAYkrDRNhA7wPHQfX3ZUXZyZLdnCQDfHZ56bzpg": 35.80,  // HOODx
  "XsYdjDjNUygZ7yGKfQaB6TxLh2gC6RRjzLtLAGJrhzV": 165.25, // PGx
  "XszvaiXGPwvk2nwb3o9C1CX4K6zH8sez11E6uyup6fe": 560.1,  // UNHx
  "XsqgsbXwWogGJsNcVZ3TyVouy2MbTkfCFhCGGcQZ2p": 292.85, // Vx
  "Xs151QeqTCiuKtinzfRATnUESM2xTU6V9Wy8Vy538ci": 95.75,  // WMTx
};

// Frontend-only function to get xStocks data
export async function fetchXStocksFrontend(): Promise<XStock[]> {
  // Return a copy to prevent mutations
  return [...XSTOCKS_DATA];
}

// Cache for Jupiter Price API v3 data
interface JupiterPriceData {
  price: number
  volume24h?: number
  marketCap?: number
}

interface CachedPriceData {
  data: Record<string, JupiterPriceData>
  timestamp: number
}

let priceCache: CachedPriceData | null = null
const CACHE_DURATION = 60 * 1000 // 1 minute cache

// Frontend-only function to fetch prices, volume, and market cap from Jupiter API v3
export async function fetchPricesFrontend(stockAddresses: string[]): Promise<Record<string, number>> {
  const fullData = await fetchJupiterPriceData(stockAddresses)
  
  // Extract just prices for backward compatibility
  const prices: Record<string, number> = {}
  Object.entries(fullData).forEach(([address, data]) => {
    prices[address] = data.price
  })
  
  return prices
}

// New function to fetch complete Jupiter Price API v3 data with caching
export async function fetchJupiterPriceData(stockAddresses: string[]): Promise<Record<string, JupiterPriceData>> {
  // Check cache first
  const now = Date.now()
  if (priceCache && (now - priceCache.timestamp) < CACHE_DURATION) {
    console.log('[JUPITER] Using cached price data')
    
    // Filter cached data to only include requested addresses
    const filteredData: Record<string, JupiterPriceData> = {}
    stockAddresses.forEach(address => {
      if (priceCache!.data[address]) {
        filteredData[address] = priceCache!.data[address]
      }
    })
    
    // If we have all requested addresses in cache, return them
    if (Object.keys(filteredData).length === stockAddresses.length) {
      return filteredData
    }
  }

  try {
    console.log('[JUPITER] Fetching fresh price data from Jupiter API v3')
    
    // Use Jupiter Price API v3 with volume and market cap data
    const idsParam = stockAddresses.join(',')
    const response = await fetch(`https://lite-api.jup.ag/price/v3?ids=${idsParam}&includeDepth=true`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'LetsStonk/1.0',
      },
    })

    if (!response.ok) {
      throw new Error(`Jupiter API v3 error: ${response.status}`)
    }

    const apiResponse = await response.json()
    const jupiterData: Record<string, JupiterPriceData> = {}

    console.log('[JUPITER] Raw API response:', apiResponse)

    // Extract prices from Jupiter API v3 response
    // Note: Jupiter API v3 returns data directly as an object, not wrapped in a "data" property
    for (const [address, priceInfo] of Object.entries(apiResponse)) {
      if (priceInfo && typeof priceInfo === 'object') {
        const info = priceInfo as any
        const price = parseFloat(info.usdPrice || '0')
        
        jupiterData[address] = {
          price: price,
          // Note: Jupiter API v3 doesn't provide volume24h or marketCap for these tokens
          volume24h: undefined,
          marketCap: undefined,
        }
      }
    }

    // Update cache with all fetched data
    priceCache = {
      data: { ...jupiterData },
      timestamp: now
    }

    console.log('[JUPITER] Cached new price data:', Object.keys(jupiterData).length, 'tokens')
    return jupiterData

  } catch (error) {
    console.warn('[JUPITER] API v3 failed, using fallback data:', error)
    
    // Fallback to hardcoded prices
    const fallbackData: Record<string, JupiterPriceData> = {}
    stockAddresses.forEach(address => {
      if (FALLBACK_PRICES[address]) {
        fallbackData[address] = {
          price: FALLBACK_PRICES[address],
          volume24h: undefined,
          marketCap: undefined,
        }
      }
    })

    return fallbackData
  }
}

// Get all available token addresses
export function getAllTokenAddresses(): string[] {
  return XSTOCKS_DATA.map(stock => stock.address)
}

// Get stock by symbol
export function getStockBySymbol(symbol: string): XStock | undefined {
  return XSTOCKS_DATA.find(stock => stock.symbol === symbol)
}

// Get stock by address
export function getStockByAddress(address: string): XStock | undefined {
  return XSTOCKS_DATA.find(stock => stock.address === address)
}

// Mock portfolio data for frontend-only approach
export interface MockPortfolio {
  id: string
  wallet_address: string
  risk_level: number
  total_value: number
  initial_investment: number
  current_pnl: number
  pnl_percentage: number
  last_rebalanced: string
  positions: MockPosition[]
}

export interface MockPosition {
  id: string
  symbol: string
  token_address: string
  amount: number
  target_percentage: number
  current_percentage: number
  average_price: number
  current_price: number
  value: number
  pnl: number
  pnl_percentage: number
}

// Generate mock portfolio data
export function generateMockPortfolio(walletAddress: string, riskLevel: number = 5): MockPortfolio {
  const initialInvestment = 10000
  const totalValue = initialInvestment * (1 + (Math.random() * 0.4 - 0.2)) // ±20% variation
  
  // Select stocks based on risk level
  const selectedStocks = XSTOCKS_DATA.slice(0, Math.min(8, riskLevel + 3))
  
  const portfolio: MockPortfolio = {
    id: `portfolio-${walletAddress.slice(0, 8)}`,
    wallet_address: walletAddress,
    risk_level: riskLevel,
    total_value: totalValue,
    initial_investment: initialInvestment,
    current_pnl: totalValue - initialInvestment,
    pnl_percentage: ((totalValue - initialInvestment) / initialInvestment) * 100,
    last_rebalanced: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    positions: []
  }

  // Generate positions
  const weights = selectedStocks.map(() => Math.random())
  const totalWeight = weights.reduce((sum, w) => sum + w, 0)
  
  portfolio.positions = selectedStocks.map((stock, index) => {
    const targetPercentage = (weights[index] / totalWeight) * 100
    const currentPrice = FALLBACK_PRICES[stock.address] || 100
    const positionValue = (totalValue * targetPercentage) / 100
    const amount = positionValue / currentPrice
    const averagePrice = currentPrice * (1 + (Math.random() * 0.2 - 0.1)) // ±10% variation
    const pnl = (currentPrice - averagePrice) * amount
    
    return {
      id: `position-${stock.symbol}-${walletAddress.slice(0, 8)}`,
      symbol: stock.symbol,
      token_address: stock.address,
      amount: amount,
      target_percentage: targetPercentage,
      current_percentage: targetPercentage, // Assume perfect allocation for mock
      average_price: averagePrice,
      current_price: currentPrice,
      value: positionValue,
      pnl: pnl,
      pnl_percentage: (pnl / (averagePrice * amount)) * 100
    }
  })

  return portfolio
}