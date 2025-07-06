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
      address: "8Yv9Jz4z7UCCN52HGAgrjbzduFJo5pTre5tKl2cozNhW",
      symbol: "xTSLA",
      name: "Tesla Inc",
      decimals: 6,
      logoURI:
        "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/8Yv9Jz4z7UCCN52HGAgrjbzduFJo5pTre5tKl2cozNhW/logo.png",
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
      logoURI:
        "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/3vAs4D1WE6Na4tCgt4BApgFSsKXSVKJpJgmEWz1sEzpx/logo.png",
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
      logoURI:
        "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/H9j56wcDHnHaKbVq5QV8TyKFyYHbXXjHbRhFKfLFNgEQ/logo.png",
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
      logoURI:
        "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/7dVH61ChzgmN9BwG4PkzwRP8PbYwPJ7ZPNF2vamKT2H8/logo.png",
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
      logoURI:
        "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E/logo.png",
      tags: ["rwa-stock"],
      daily_volume: 700000,
      freeze_authority: null,
      mint_authority: null,
    },
  ]
}
