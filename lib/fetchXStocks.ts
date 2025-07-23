import { supabase } from '@/lib/supabase'
import { XStock } from './types'

// Fallback prices (used if Jupiter API fails) - Updated with all active xStocks
const FALLBACK_PRICES: Record<string, number> = {
  "XsbEhLAtcf6HdfpFZ5xEMdqW8nfAvcsP5bdudRLJzJp": 228.5,  // AAPLx
  "XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB": 405.2,  // TSLAx
  "XsCPL9dNWBMvFtTmwcCA5v3xWPSMEBCszbQdiLLq6aN": 178.3,  // GOOGLx
  "Xs3eBt7uRfJX8QUs4suhyU8p2M6DoUDrJyWBa8LLZsg": 185.4,  // AMZNx
  "XsYdjDjNUygZ7yGKfQaB6TxLh2gC6RRjzLtLAGJrhzV": 165.25, // PGx (if exists)
  "XszvaiXGPwvk2nwb3o9C1CX4K6zH8sez11E6uyup6fe": 560.1,  // UNHx (if exists)
  "XsqgsbXwWogGJsNcVZ3TyVouy2MbTkfCFhCGGGcQZ2p": 292.85, // Vx (if exists)
  "Xs151QeqTCiuKtinzfRATnUESM2xTU6V9Wy8Vy538ci": 95.75,  // WMTx (if exists)
  // New tokens from database
  "XsP7xzNPvEHS1m6qfanPUGjNmdnmsLKEoNAnHjdxxyZ": 485.25, // MSTRx
  "Xsc9qvGR1efVDFGLrVsmkzv3qi45LTBjeUKSPmx9qEh": 172.80, // NVDAx
  "Xs7ZdzSHLU9ftNJsii5fCeJhoRWSC32SQGzGQtePxNu": 325.45, // COINx
  "Xsa62P5mvPszXL1krVUnU5ar38bBSVcWAB6fmPCo5Zu": 704.20, // METAx
  "XsoCS1TfEyfFhfvj8EtZ528L3CaKBDBRqRapnBbDF2W": 566.96, // SPYx
  "Xs8S1uUs1zvS2p7iwtsG3b6fkhpvmwz4GYU3gWAmWHZ": 512.75, // QQQx
  "XsvNBAYkrDRNhA7wPHQfX3ZUXZyZLdnCQDfHZ56bzpg": 35.80,  // HOODx
  "XsueG8BtpquVJX9LVLLEGuViXUungE6WmK5YZ3p3bd1": 28.45,  // CRCLx
  "Xs2yquAgsHByNzx68WJC55WHjHBvG9JsMB7CWjTLyPy": 125.30, // DFDVx
  "XsaQTCgebC2KPbf27KUhdv5JFvHhQ4GDAPURwrEhAzb": 15.75,  // AMBRx
  "Xsv9hRk1z5ystj9MhnA7Lq4vjSsLwzL2nxrwmwtD3re": 245.60  // GLDx
};

export async function fetchXStocks(forceRefresh: boolean = false): Promise<XStock[]> {

  try {
    const { data, error } = await supabase
      .from('xstocks_metadata')
      .select('*')
      .eq('is_active', true)
      .order('symbol')

    if (error) {
      throw new Error(`Failed to fetch xStocks: ${error.message}`)
    }

    if (!data || data.length === 0) {
      return []
    }

    // Transform database records to match XStock interface
    const xStocks: XStock[] = data.map(record => ({
      symbol: record.symbol,
      address: record.solana_address, // Map solana_address to address
      name: record.name,
      decimals: record.decimals || 6,
      tags: record.tags || [],
      logoURI: record.logo_uri || undefined,
      daily_volume: record.daily_volume || undefined,
      market_cap: record.market_cap || undefined,
    }))

    return xStocks
  } catch (error) {
    throw error
  }
}

export async function fetchPrices(stockAddresses: string[]): Promise<Record<string, number>> {
  
  try {
    // Try to fetch live prices from Jupiter API
    const idsParam = stockAddresses.join(',')
    const response = await fetch(`https://lite-api.jup.ag/price/v2?ids=${idsParam}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'SolanaRoboAdvisor/1.0',
      },
    })

    if (!response.ok) {
      throw new Error(`Jupiter API error: ${response.status}`)
    }

    const data = await response.json()
    const livePrices: Record<string, number> = {}

    // Extract prices from Jupiter API response
    if (data.data) {
      for (const [address, priceData] of Object.entries(data.data)) {
        if (priceData && typeof priceData === 'object' && 'price' in priceData) {
          livePrices[address] = parseFloat((priceData as any).price)
        }
      }
    }

    return livePrices

  } catch (error) {
    
    // Fallback to hardcoded prices
    const fallbackPrices: Record<string, number> = {}
    stockAddresses.forEach(address => {
      if (FALLBACK_PRICES[address]) {
        fallbackPrices[address] = FALLBACK_PRICES[address]
      }
    })

    return fallbackPrices
  }
}

export async function updateXStockMarketData(
  address: string, 
  marketCap: number, 
  dailyVolume: number
): Promise<void> {
  try {
    const { error } = await supabase
      .from('xstocks_metadata')
      .update({
        market_cap: marketCap,
        daily_volume: dailyVolume,
        updated_at: new Date().toISOString()
      })
      .eq('solana_address', address)

    if (error) {
    } else {
    }
  } catch (error) {
  }
}
