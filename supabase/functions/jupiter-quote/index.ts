import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

interface JupiterQuoteRequest {
  inputMint: string
  outputMint: string
  amount: number
  slippageBps?: number
}

interface JupiterQuoteResponse {
  inputMint: string
  inAmount: string
  outputMint: string
  outAmount: string
  otherAmountThreshold: string
  swapMode: string
  slippageBps: number
  platformFee: null
  priceImpactPct: string
  routePlan: any[]
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

    const body: JupiterQuoteRequest = await req.json()
    const { inputMint, outputMint, amount, slippageBps = 50 } = body

    // Validate required fields
    if (!inputMint || !outputMint || !amount) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields: inputMint, outputMint, amount' 
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

    // Build Jupiter quote URL
    const quoteUrl = new URL('https://quote-api.jup.ag/v6/quote')
    quoteUrl.searchParams.set('inputMint', inputMint)
    quoteUrl.searchParams.set('outputMint', outputMint)
    quoteUrl.searchParams.set('amount', amount.toString())
    quoteUrl.searchParams.set('slippageBps', slippageBps.toString())

    // Set up headers for Jupiter API
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'User-Agent': 'SolanaRoboAdvisor/1.0',
    }

    // Add API key if available
    const jupApiKey = Deno.env.get('JUP_API_KEY')
    if (jupApiKey) {
      headers['x-api-key'] = jupApiKey
    }

    // Fetch quote from Jupiter
    const response = await fetch(quoteUrl.toString(), { headers })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Jupiter API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      })

      return new Response(
        JSON.stringify({ 
          error: 'Failed to get quote from Jupiter',
          details: errorText
        }),
        { 
          status: response.status,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
    }

    const quote: JupiterQuoteResponse = await response.json()

    // Add safety checks
    const priceImpact = parseFloat(quote.priceImpactPct)
    if (priceImpact > 5) {
      console.warn('High price impact detected:', priceImpact)
    }

    // Return the quote with additional metadata
    const enrichedQuote = {
      ...quote,
      safetyChecks: {
        priceImpactPct: priceImpact,
        isHighImpact: priceImpact > 5,
        estimatedFee: calculateEstimatedFee(quote),
      },
      timestamp: new Date().toISOString(),
    }

    return new Response(
      JSON.stringify(enrichedQuote),
      {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )

  } catch (error) {
    console.error('Jupiter quote error:', error)
    return new Response(
      JSON.stringify({
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

function calculateEstimatedFee(quote: JupiterQuoteResponse): number {
  // Estimate transaction fees based on route complexity
  const baseTransactionFee = 0.000005 // ~5000 lamports
  const routeComplexity = quote.routePlan.length
  const estimatedFee = baseTransactionFee * (1 + routeComplexity * 0.1)
  
  return estimatedFee
} 