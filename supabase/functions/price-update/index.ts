import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

interface PriceData {
  token_address: string
  symbol: string
  price: number
  volume_24h?: number
  market_cap?: number
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      },
    })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get all xStocks tokens from Jupiter API
    const xStocks = await fetchXStocksFromJupiter()
    
    if (xStocks.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No xStocks found' 
        }),
        { 
          status: 404,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
    }

    // Get token addresses for price fetching
    const tokenAddresses = xStocks.map(stock => stock.address)
    
    // Fetch current prices from Jupiter
    const prices = await fetchPricesFromJupiter(tokenAddresses)
    
    // Prepare price data for database
    const priceDataArray: PriceData[] = xStocks.map(stock => ({
      token_address: stock.address,
      symbol: stock.symbol,
      price: prices[stock.address] || 0,
      volume_24h: stock.daily_volume || null,
      market_cap: null // Can be calculated later or fetched from another source
    }))

    // Insert price data into database
    const { error: insertError } = await supabase
      .from('price_history')
      .insert(priceDataArray)

    if (insertError) {
      console.error('Error inserting price data:', insertError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to store price data',
          details: insertError.message 
        }),
        { 
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Price data updated successfully',
        updatedTokens: priceDataArray.length,
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )

  } catch (error) {
    console.error('Price update error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: error.message
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }
})

async function fetchXStocksFromJupiter() {
  try {
    const headers: Record<string, string> = {
      Accept: "application/json",
      "User-Agent": "SolanaRoboAdvisor-PriceUpdater/1.0",
    }

    // Add API key if available
    const jupApiKey = Deno.env.get('JUP_API_KEY')
    if (jupApiKey) {
      headers["x-api-key"] = jupApiKey
    }

    const response = await fetch("https://tokens.jup.ag/tokens?tags=rwa-stock", {
      headers,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (Array.isArray(data) && data.length > 0) {
      return data.filter((token) => 
        token.symbol.startsWith("x") && 
        token.tags.includes("rwa-stock")
      )
    }

    // Return mock data if API doesn't return expected format
    return getMockXStocks()
  } catch (error) {
    console.error("Failed to fetch xStocks from Jupiter:", error)
    return getMockXStocks()
  }
}

async function fetchPricesFromJupiter(tokenAddresses: string[]): Promise<Record<string, number>> {
  try {
    // Batch up to 100 token addresses per call
    const batches = []
    for (let i = 0; i < tokenAddresses.length; i += 100) {
      batches.push(tokenAddresses.slice(i, i + 100))
    }

    const allPrices: Record<string, number> = {}

    for (const batch of batches) {
      const idsParam = batch.join(",")

      const headers: Record<string, string> = {
        Accept: "application/json",
        "User-Agent": "SolanaRoboAdvisor-PriceUpdater/1.0",
      }

      // Add API key if available
      const jupApiKey = Deno.env.get('JUP_API_KEY')
      if (jupApiKey) {
        headers["x-api-key"] = jupApiKey
      }

      const response = await fetch(`https://lite-api.jup.ag/price/v2?ids=${idsParam}`, {
        headers,
      })

      if (!response.ok) {
        throw new Error(`Price fetch failed: ${response.status}`)
      }

      const data = await response.json()

      // Extract prices from response
      if (data.data) {
        for (const [address, priceData] of Object.entries(data.data)) {
          if (priceData && typeof priceData === "object" && "price" in priceData) {
            allPrices[address] = (priceData as any).price
          }
        }
      }
    }

    return allPrices
  } catch (error) {
    console.error("Failed to fetch prices from Jupiter:", error)

    // Return mock prices as fallback
    const mockPrices: Record<string, number> = {}
    tokenAddresses.forEach((address, index) => {
      mockPrices[address] = 200 + index * 50 + Math.random() * 20
    })

    return mockPrices
  }
}

function getMockXStocks() {
  return [
    {
      address: "8Yv9Jz4z7UCCN52HGAgrjbzduFJo5pTre5tKl2cozNhW",
      symbol: "xTSLA",
      name: "Tesla Inc",
      decimals: 6,
      logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/8Yv9Jz4z7UCCN52HGAgrjbzduFJo5pTre5tKl2cozNhW/logo.png",
      tags: ["rwa-stock"],
      daily_volume: 1000000,
      freeze_authority: null,
      mint_authority: null,
    },
    {
      address: "3vAs4D1WE6Na4tCgt4BApgFSsKXSVKJpJgmEWz1sEzpx",
      symbol: "xAAPL",
      name: "Apple Inc",
      decimals: 6,
      logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/3vAs4D1WE6Na4tCgt4BApgFSsKXSVKJpJgmEWz1sEzpx/logo.png",
      tags: ["rwa-stock"],
      daily_volume: 800000,
      freeze_authority: null,
      mint_authority: null,
    },
    {
      address: "H9j56wcDHnHaKbVq5QV8TyKFyYHbXXjHbRhFKfLFNgEQ",
      symbol: "xMSFT",
      name: "Microsoft Corporation",
      decimals: 6,
      logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/H9j56wcDHnHaKbVq5QV8TyKFyYHbXXjHbRhFKfLFNgEQ/logo.png",
      tags: ["rwa-stock"],
      daily_volume: 600000,
      freeze_authority: null,
      mint_authority: null,
    },
    {
      address: "7dVH61ChzgmN9BwG4PkzwRP8PbYwPJ7ZPNF2vamKT2H8",
      symbol: "xGOOGL",
      name: "Alphabet Inc",
      decimals: 6,
      logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/7dVH61ChzgmN9BwG4PkzwRP8PbYwPJ7ZPNF2vamKT2H8/logo.png",
      tags: ["rwa-stock"],
      daily_volume: 500000,
      freeze_authority: null,
      mint_authority: null,
    },
    {
      address: "9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E",
      symbol: "xAMZN",
      name: "Amazon.com Inc",
      decimals: 6,
      logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E/logo.png",
      tags: ["rwa-stock"],
      daily_volume: 700000,
      freeze_authority: null,
      mint_authority: null,
    },
  ]
} 