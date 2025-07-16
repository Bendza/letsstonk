"use server"

import { z } from "zod"
import { type XStock, XStockSchema } from "./types"

const XStocksResponseSchema = z.array(XStockSchema)

// Server action to fetch xStocks data
export async function fetchXStocksAction(): Promise<XStock[]> {
  try {
    // Use server-side API key if available
    const headers: Record<string, string> = {
      Accept: "application/json",
      "User-Agent": "SolanaRoboAdvisor/1.0",
    }

    // Add API key if available (server-side only)
    if (process.env.JUP_API_KEY) {
      headers["x-api-key"] = process.env.JUP_API_KEY
    }

    const response = await fetch("https://tokens.jup.ag/tokens?tags=rwa-stock", {
      headers,
      // Add cache control for better performance
      next: { revalidate: 300 }, // 5 minutes
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    let xStocks: XStock[]

    if (Array.isArray(data) && data.length > 0) {
      const validatedData = XStocksResponseSchema.parse(data)
      xStocks = validatedData.filter((token) => token.symbol.startsWith("x") && token.tags.includes("rwa-stock"))
    } else {
      // Fallback to mock data if API doesn't return expected format
      xStocks = getMockXStocks()
    }

    // If no xStocks found from API, use mock data
    if (xStocks.length === 0) {
      xStocks = getMockXStocks()
    }

    return xStocks
  } catch (error) {
    console.error("Failed to fetch xStocks:", error)
    // Return mock data as fallback
    return getMockXStocks()
  }
}

// Server action to fetch prices
export async function fetchPricesAction(tokenAddresses: string[]): Promise<Record<string, number>> {
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
        "User-Agent": "SolanaRoboAdvisor/1.0",
      }

      // Add API key if available (server-side only)
      if (process.env.JUP_API_KEY) {
        headers["x-api-key"] = process.env.JUP_API_KEY
      }

      const response = await fetch(`https://lite-api.jup.ag/price/v2?ids=${idsParam}`, {
        headers,
        next: { revalidate: 30 }, // 30 seconds cache
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
    console.error("Failed to fetch prices:", error)

    // Return mock prices as fallback
    const mockPrices: Record<string, number> = {}
    tokenAddresses.forEach((address, index) => {
      mockPrices[address] = 200 + index * 50 + Math.random() * 20
    })

    return mockPrices
  }
}

// Mock data function (moved from client)
function getMockXStocks(): XStock[] {
  return [
    {
      address: "XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB",
      symbol: "TSLAx",
      name: "Tesla xStock",
      decimals: 6,
      logoURI: "https://cdn.prod.website-files.com/655f3efc4be468487052e35a/684aaf9559b2312c162731f5_Ticker%3DTSLA%2C%20Company%20Name%3DTesla%20Inc.%2C%20size%3D256x256.svg",
      tags: ["rwa-stock"],
      daily_volume: 1000000,
      freeze_authority: null,
      mint_authority: null,
    },
    {
      address: "XsbEhLAtcf6HdfpFZ5xEMdqW8nfAvcsP5bdudRLJzJp",
      symbol: "AAPLx",
      name: "Apple xStock",
      decimals: 6,
      logoURI: "https://cdn.prod.website-files.com/655f3efc4be468487052e35a/6849799260ee65bf38841f90_Ticker%3DAAPL%2C%20Company%20Name%3DApple%20Inc.%2C%20size%3D256x256.svg",
      tags: ["rwa-stock"],
      daily_volume: 800000,
      freeze_authority: null,
      mint_authority: null,
    },
    {
      address: "Xs151QeqTCiuKtinzfRATnUESM2xTU6V9Wy8Vy538ci",
      symbol: "WMTx",
      name: "Walmart xStock",
      decimals: 6,
      logoURI: "https://cdn.prod.website-files.com/655f3efc4be468487052e35a/684bebd366d5089b2da3cf7e_Ticker%3DWMT%2C%20Company%20Name%3DWalmart%2C%20size%3D256x256.svg",
      tags: ["rwa-stock"],
      daily_volume: 600000,
      freeze_authority: null,
      mint_authority: null,
    },
    {
      address: "XsCPL9dNWBMvFtTmwcCA5v3xWPSMEBCszbQdiLLq6aN",
      symbol: "GOOGLx",
      name: "Alphabet xStock",
      decimals: 6,
      logoURI: "https://cdn.prod.website-files.com/655f3efc4be468487052e35a/684aae04a3d8452e0ae4bad8_Ticker%3DGOOG%2C%20Company%20Name%3DAlphabet%20Inc.%2C%20size%3D256x256.svg",
      tags: ["rwa-stock"],
      daily_volume: 500000,
      freeze_authority: null,
      mint_authority: null,
    },
    {
      address: "Xs3eBt7uRfJX8QUs4suhyU8p2M6DoUDrJyWBa8LLZsg",
      symbol: "AMZNx",
      name: "Amazon xStock",
      decimals: 6,
      logoURI: "https://cdn.prod.website-files.com/655f3efc4be468487052e35a/68497d354d7140b01657a793_Ticker%3DAMZN%2C%20Company%20Name%3DAmazon.com%20Inc.%2C%20size%3D256x256.svg",
      tags: ["rwa-stock"],
      daily_volume: 700000,
      freeze_authority: null,
      mint_authority: null,
    },
    {
      address: "XsqgsbXwWogGJsNcVZ3TyVouy2MbTkfCFhCGGGcQZ2p",
      symbol: "Vx",
      name: "Visa xStock",
      decimals: 6,
      logoURI: "https://cdn.prod.website-files.com/655f3efc4be468487052e35a/684acfd76eb8395c6d1d2210_Ticker%3DV%2C%20Company%20Name%3DVisa%2C%20size%3D256x256.svg",
      tags: ["rwa-stock"],
      daily_volume: 400000,
      freeze_authority: null,
      mint_authority: null,
    },
    {
      address: "XszvaiXGPwvk2nwb3o9C1CX4K6zH8sez11E6uyup6fe",
      symbol: "UNHx",
      name: "UnitedHealth xStock",
      decimals: 6,
      logoURI: "https://cdn.prod.website-files.com/655f3efc4be468487052e35a/684abb4c69185d8a871e2ab5_Ticker%3DUNH%2C%20Company%20Name%3DUnited%20Health%2C%20size%3D256x256.svg",
      tags: ["rwa-stock"],
      daily_volume: 300000,
      freeze_authority: null,
      mint_authority: null,
    },
    {
      address: "XsYdjDjNUygZ7yGKfQaB6TxLh2gC6RRjzLtLAGJrhzV",
      symbol: "PGx",
      name: "Procter & Gamble xStock",
      decimals: 6,
      logoURI: "https://cdn.prod.website-files.com/655f3efc4be468487052e35a/684bf6b9066fa1085ae954b6_Ticker%3DPG%2C%20Company%20Name%3DProcter%20%26%20Gamble%2C%20size%3D256x256.svg",
      tags: ["rwa-stock"],
      daily_volume: 250000,
      freeze_authority: null,
      mint_authority: null,
    },
  ]
}
