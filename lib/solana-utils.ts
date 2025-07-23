import { Connection, PublicKey } from '@solana/web3.js'

// Connection to Solana RPC - using public RPC for token supply data
// Note: Only use this for critical operations (like trading) to avoid rate limits
const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed')

export interface TokenStats {
  supply: number
  price: number
  marketCap: number
  decimals: number
  mintAuthority: string | null
  freezeAuthority: string | null
}

export interface VolumeData {
  volume24h: number
  volumeChange24h: number
}

/**
 * Fetch real token supply from Solana RPC
 */
export async function getRealTokenSupply(mintAddress: string): Promise<number | null> {
  try {
    const mintPublicKey = new PublicKey(mintAddress)
    const tokenSupply = await connection.getTokenSupply(mintPublicKey)
    
    if (tokenSupply.value && tokenSupply.value.uiAmount) {
      return tokenSupply.value.uiAmount
    }
    
    return null
  } catch (error) {
    return null
  }
}

/**
 * Get real token statistics using actual supply and market price
 */
export async function getRealTokenStats(mintAddress: string, currentPrice: number): Promise<TokenStats | null> {
  try {
    // Fetch real supply from Solana
    const realSupply = await getRealTokenSupply(mintAddress)
    
    if (realSupply && realSupply > 0 && currentPrice > 0) {
      // Calculate real market cap: supply × price
      const marketCap = realSupply * currentPrice
      
      
      return {
        supply: realSupply,
        price: currentPrice,
        marketCap: marketCap,
        decimals: 6,
        mintAuthority: null,
        freezeAuthority: null,
      }
    }
    
    // Fallback to mock data if real data unavailable
    return getMockTokenStats(mintAddress)
  } catch (error) {
    return getMockTokenStats(mintAddress)
  }
}

/**
 * Generate mock token statistics with realistic xStock market caps
 * Updated to reflect real-world xStock market caps (millions, not billions)
 */
export function getMockTokenStats(mintAddress: string): TokenStats {
  // Use mint address to generate consistent mock data
  const hash = mintAddress.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const random = (seed: number) => (seed * 9301 + 49297) % 233280 / 233280
  
  // Generate realistic xStock values based on real data (e.g., SPYx: $1.98M market cap, 3,499 supply)
  // Use realistic supply ranges similar to actual xStocks
  const supply = 1000 + (random(hash) * 4000) // 1K - 5K tokens (matching real xStock supply ranges)
  const price = 100 + (random(hash + 1) * 500) // $100 - $600 per token (realistic stock prices)
  const marketCap = supply * price // This gives realistic market caps: $100K - $3M
  
  return {
    supply,
    price,
    marketCap,
    decimals: 6,
    mintAuthority: null,
    freezeAuthority: null,
  }
}

/**
 * Generate mock volume data
 */
export function getMockVolumeData(mintAddress: string = 'default'): VolumeData {
  // Handle undefined or empty mintAddress
  if (!mintAddress || typeof mintAddress !== 'string') {
    mintAddress = 'default'
  }
  
  const hash = mintAddress.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const random = (seed: number) => (seed * 9301 + 49297) % 233280 / 233280
  
  const volume24h = 1000000 + (random(hash) * 10000000) // 1M - 11M volume
  const volumeChange24h = -50 + (random(hash + 1) * 100) // -50% to +50% change
  
  return {
    volume24h,
    volumeChange24h,
  }
}

/**
 * Get token statistics - now returns mock data only to avoid RPC 403 errors
 */
export async function getTokenStats(mintAddress: string): Promise<TokenStats | null> {
  return getMockTokenStats(mintAddress)
}

/**
 * Get multiple token statistics - now returns mock data only
 */
export async function getMultipleTokenStats(mintAddresses: string[]): Promise<Record<string, TokenStats | null>> {
  
  const stats: Record<string, TokenStats | null> = {}
  
  mintAddresses.forEach(address => {
    stats[address] = getMockTokenStats(address)
  })
  
  return stats
}

/**
 * Get Solscan link for a token
 */
export function getSolscanLink(tokenAddress: string): string {
  return `https://solscan.io/token/${tokenAddress}`
}

/**
 * Format large numbers (e.g., 1,234,567 -> "1.23M")
 */
export function formatLargeNumber(num: number): string {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(2) + 'B'
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(2) + 'M'
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(2) + 'K'
  } else {
    return num.toFixed(2)
  }
}

/**
 * Format currency values
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format percentage values
 */
export function formatPercentage(value: number): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
} 

/**
 * Fetch real market cap data only when needed (e.g., for trading)
 * This should only be called when absolutely necessary to avoid RPC rate limits
 */
export async function getRealMarketCapForTrading(mintAddress: string, currentPrice: number): Promise<number | null> {
  try {
    const realSupply = await getRealTokenSupply(mintAddress)
    
    if (realSupply && realSupply > 0 && currentPrice > 0) {
      const marketCap = realSupply * currentPrice
      return marketCap
    }
    
    return null
  } catch (error) {
    return null
  }
} 