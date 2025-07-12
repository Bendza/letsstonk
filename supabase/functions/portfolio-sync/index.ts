import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { Connection, PublicKey } from "https://esm.sh/@solana/web3.js@1.95.0"

interface SyncRequest {
  walletAddress: string
  portfolioId?: string
}

interface TokenBalance {
  mint: string
  symbol?: string
  balance: number
  decimals: number
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
    })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Initialize Solana connection
    const rpcUrl = Deno.env.get("SOLANA_RPC_URL") || "https://api.mainnet-beta.solana.com"
    const connection = new Connection(rpcUrl, "confirmed")

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
    }

    const body: SyncRequest = await req.json()
    const { walletAddress, portfolioId } = body

    if (!walletAddress) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required field: walletAddress' 
        }),
        { 
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
    }

    // Get on-chain token balances
    const tokenBalances = await getTokenBalances(connection, walletAddress)
    
    // Get xStocks token list for filtering
    const xStocks = await getXStocksTokens()
    const xStockMints = new Set(xStocks.map(stock => stock.address))
    
    // Filter only xStock tokens
    const xStockBalances = tokenBalances.filter(balance => 
      xStockMints.has(balance.mint) && balance.balance > 0
    )

    // Get or create portfolio
    let portfolio
    if (portfolioId) {
      const { data: existingPortfolio } = await supabase
        .from('portfolios')
        .select('*')
        .eq('id', portfolioId)
        .eq('wallet_address', walletAddress)
        .single()
      
      portfolio = existingPortfolio
    } else {
      const { data: portfolios } = await supabase
        .from('portfolios')
        .select('*')
        .eq('wallet_address', walletAddress)
        .eq('is_active', true)
        .limit(1)
      
      portfolio = portfolios?.[0]
    }

    if (!portfolio) {
      return new Response(
        JSON.stringify({ 
          error: 'No active portfolio found for wallet address' 
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

    // Get current prices for valuation
    const tokenAddresses = xStockBalances.map(balance => balance.mint)
    const prices = await fetchCurrentPrices(tokenAddresses)

    // Update positions in database
    const syncResults = []
    let totalValue = 0

    for (const balance of xStockBalances) {
      const stock = xStocks.find(s => s.address === balance.mint)
      const price = prices[balance.mint] || 0
      const value = balance.balance * price

      totalValue += value

      // Update or create position
      const { data: existingPosition } = await supabase
        .from('positions')
        .select('*')
        .eq('portfolio_id', portfolio.id)
        .eq('token_address', balance.mint)
        .single()

      if (existingPosition) {
        // Update existing position
        const { error: updateError } = await supabase
          .from('positions')
          .update({
            amount: balance.balance,
            current_price: price,
            value: value,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingPosition.id)

        if (updateError) {
          console.error('Error updating position:', updateError)
        } else {
          syncResults.push({
            symbol: stock?.symbol || balance.mint,
            action: 'updated',
            amount: balance.balance,
            value: value
          })
        }
      } else if (balance.balance > 0) {
        // Create new position
        const { error: insertError } = await supabase
          .from('positions')
          .insert({
            portfolio_id: portfolio.id,
            symbol: stock?.symbol || `Token-${balance.mint.slice(0, 8)}`,
            token_address: balance.mint,
            amount: balance.balance,
            target_percentage: 0, // Will be set by rebalancing logic
            current_percentage: 0, // Will be calculated after total value update
            average_price: price, // Use current price as initial average
            current_price: price,
            value: value
          })

        if (insertError) {
          console.error('Error creating position:', insertError)
        } else {
          syncResults.push({
            symbol: stock?.symbol || `Token-${balance.mint.slice(0, 8)}`,
            action: 'created',
            amount: balance.balance,
            value: value
          })
        }
      }
    }

    // Remove positions for tokens with zero balance
    const { data: allPositions } = await supabase
      .from('positions')
      .select('*')
      .eq('portfolio_id', portfolio.id)

    if (allPositions) {
      for (const position of allPositions) {
        const hasBalance = xStockBalances.some(balance => 
          balance.mint === position.token_address && balance.balance > 0
        )

        if (!hasBalance) {
          const { error: deleteError } = await supabase
            .from('positions')
            .delete()
            .eq('id', position.id)

          if (!deleteError) {
            syncResults.push({
              symbol: position.symbol,
              action: 'removed',
              amount: 0,
              value: 0
            })
          }
        }
      }
    }

    // Update portfolio total value and PnL
    const currentPnl = totalValue - portfolio.initial_investment
    const pnlPercentage = portfolio.initial_investment > 0 
      ? (currentPnl / portfolio.initial_investment) * 100 
      : 0

    const { error: portfolioUpdateError } = await supabase
      .from('portfolios')
      .update({
        total_value: totalValue,
        current_pnl: currentPnl,
        pnl_percentage: pnlPercentage,
        updated_at: new Date().toISOString()
      })
      .eq('id', portfolio.id)

    if (portfolioUpdateError) {
      console.error('Error updating portfolio:', portfolioUpdateError)
    }

    // Update position percentages now that we have total value
    if (totalValue > 0) {
      const { data: updatedPositions } = await supabase
        .from('positions')
        .select('*')
        .eq('portfolio_id', portfolio.id)

      if (updatedPositions) {
        for (const position of updatedPositions) {
          const currentPercentage = (position.value / totalValue) * 100
          
          await supabase
            .from('positions')
            .update({
              current_percentage: currentPercentage,
              pnl: position.value - (position.average_price * position.amount),
              pnl_percentage: position.average_price > 0 
                ? ((position.current_price - position.average_price) / position.average_price) * 100 
                : 0
            })
            .eq('id', position.id)
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        portfolioId: portfolio.id,
        walletAddress: walletAddress,
        totalValue: totalValue,
        syncResults: syncResults,
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
    console.error('Portfolio sync error:', error)
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

async function getTokenBalances(connection: Connection, walletAddress: string): Promise<TokenBalance[]> {
  try {
    const walletPubkey = new PublicKey(walletAddress)
    
    // Get all token accounts for the wallet
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletPubkey, {
      programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") // SPL Token Program
    })

    const balances: TokenBalance[] = []

    for (const account of tokenAccounts.value) {
      const accountData = account.account.data.parsed
      const mintAddress = accountData.info.mint
      const balance = parseFloat(accountData.info.tokenAmount.uiAmount || "0")
      const decimals = accountData.info.tokenAmount.decimals

      if (balance > 0) {
        balances.push({
          mint: mintAddress,
          balance: balance,
          decimals: decimals
        })
      }
    }

    return balances
  } catch (error) {
    console.error('Error fetching token balances:', error)
    return []
  }
}

async function getXStocksTokens() {
  try {
    const headers: Record<string, string> = {
      Accept: "application/json",
      "User-Agent": "SolanaRoboAdvisor-PortfolioSync/1.0",
    }

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

    return []
  } catch (error) {
    console.error("Failed to fetch xStocks from Jupiter:", error)
    return []
  }
}

async function fetchCurrentPrices(tokenAddresses: string[]): Promise<Record<string, number>> {
  try {
    if (tokenAddresses.length === 0) return {}

    const idsParam = tokenAddresses.join(",")

    const headers: Record<string, string> = {
      Accept: "application/json",
      "User-Agent": "SolanaRoboAdvisor-PortfolioSync/1.0",
    }

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
    const prices: Record<string, number> = {}

    if (data.data) {
      for (const [address, priceData] of Object.entries(data.data)) {
        if (priceData && typeof priceData === "object" && "price" in priceData) {
          prices[address] = (priceData as any).price
        }
      }
    }

    return prices
  } catch (error) {
    console.error("Failed to fetch current prices:", error)
    return {}
  }
} 