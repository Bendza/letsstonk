import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { 
  Connection, 
  VersionedTransaction, 
  PublicKey,
  LAMPORTS_PER_SOL 
} from "@solana/web3.js";
import { useCallback, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getTradingRpcUrl } from "@/lib/rpc-config";

interface QuoteResponse {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  platformFee?: any;
  priceImpactPct: string;
  routePlan: any[];
}

interface JupiterSwapParams {
  inputMint: string;
  outputMint: string;
  amount: number;
  slippageBps?: number;
}

export const useJupiterTrading = () => {
  // Use a dedicated RPC connection for trading to avoid rate limits
  const tradingConnection = new Connection(getTradingRpcUrl(), 'confirmed');
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get quote from Jupiter
  const getQuote = useCallback(async ({
    inputMint,
    outputMint,
    amount,
    slippageBps = 50
  }: JupiterSwapParams): Promise<QuoteResponse | null> => {
    try {
      const response = await fetch(
        `https://lite-api.jup.ag/swap/v1/quote?` +
        `inputMint=${inputMint}&` +
        `outputMint=${outputMint}&` +
        `amount=${amount}&` +
        `slippageBps=${slippageBps}&` +
        `onlyDirectRoutes=false&` +
        `asLegacyTransaction=false`
      );
      
      if (!response.ok) {
        throw new Error('Failed to get quote');
      }
      
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get quote');
      return null;
    }
  }, []);

  // Execute swap transaction
  const executeSwap = useCallback(async (
    quoteResponse: QuoteResponse,
    portfolioId?: string
  ): Promise<string | null> => {
    if (!connected || !publicKey) {
      setError('Wallet not connected');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
          // Get swap transaction from Jupiter (using free endpoint)
    const swapResponse = await fetch('https://lite-api.jup.ag/swap/v1/swap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          quoteResponse,
          userPublicKey: publicKey.toString(),
          wrapAndUnwrapSol: true,
          dynamicComputeUnitLimit: true,
          prioritizationFeeLamports: {
            priorityLevelWithMaxLamports: {
              maxLamports: 10000000,
              priorityLevel: "high"
            }
          }
        })
      });

      if (!swapResponse.ok) {
        throw new Error('Failed to get swap transaction');
      }

      const { swapTransaction } = await swapResponse.json();

      // Deserialize the transaction
      const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

      // Send transaction through wallet using trading connection
      const signature = await sendTransaction(transaction, tradingConnection, {
        skipPreflight: false,
        maxRetries: 3
      });

      // Confirm transaction using trading connection
      const latestBlockHash = await tradingConnection.getLatestBlockhash();
      await tradingConnection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature
      });

      // Log transaction to Supabase
      if (portfolioId) {
        await logTransaction({
          portfolioId,
          signature,
          inputMint: quoteResponse.inputMint,
          outputMint: quoteResponse.outputMint,
          inputAmount: quoteResponse.inAmount,
          outputAmount: quoteResponse.outAmount,
          type: 'buy'
        });
      }

      return signature;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Swap failed');
      return null;
    } finally {
      setLoading(false);
    }
  }, [connected, publicKey, sendTransaction, connection]);

  // Log transaction to Supabase
  const logTransaction = useCallback(async (params: {
    portfolioId: string;
    signature: string;
    inputMint: string;
    outputMint: string;
    inputAmount: string;
    outputAmount: string;
    type: 'buy' | 'sell';
  }) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .insert({
          portfolio_id: params.portfolioId,
          transaction_signature: params.signature,
          transaction_type: params.type,
          input_token: params.inputMint,
          output_token: params.outputMint,
          input_amount: parseFloat(params.inputAmount),
          output_amount: parseFloat(params.outputAmount),
          status: 'confirmed'
        });

      if (error) {
      }
    } catch (err) {
    }
  }, []);

  // Buy xStock with USDC
  const buyXStock = useCallback(async (
    stockSymbol: string,
    usdcAmount: number,
    portfolioId?: string
  ) => {
    try {
      // Get stock metadata from Supabase
      const { data: stockData, error } = await supabase
        .from('xstocks_metadata')
        .select('solana_address, decimals')
        .eq('symbol', stockSymbol)
        .single();

      if (error || !stockData) {
        throw new Error(`Stock ${stockSymbol} not found`);
      }

      const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
      const amount = Math.floor(usdcAmount * Math.pow(10, 6)); // USDC has 6 decimals

      const quote = await getQuote({
        inputMint: USDC_MINT,
        outputMint: stockData.solana_address,
        amount,
        slippageBps: 100 // 1% slippage
      });

      if (!quote) {
        throw new Error('Failed to get quote');
      }

      return await executeSwap(quote, portfolioId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Buy failed');
      return null;
    }
  }, [getQuote, executeSwap]);

  // Sell xStock for USDC
  const sellXStock = useCallback(async (
    stockSymbol: string,
    stockAmount: number,
    portfolioId?: string
  ) => {
    try {
      // Get stock metadata from Supabase
      const { data: stockData, error } = await supabase
        .from('xstocks_metadata')
        .select('solana_address, decimals')
        .eq('symbol', stockSymbol)
        .single();

      if (error || !stockData) {
        throw new Error(`Stock ${stockSymbol} not found`);
      }

      const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
      const amount = Math.floor(stockAmount * Math.pow(10, stockData.decimals || 6));

      const quote = await getQuote({
        inputMint: stockData.solana_address,
        outputMint: USDC_MINT,
        amount,
        slippageBps: 100 // 1% slippage
      });

      if (!quote) {
        throw new Error('Failed to get quote');
      }

      return await executeSwap(quote, portfolioId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sell failed');
      return null;
    }
  }, [getQuote, executeSwap]);

  return {
    getQuote,
    executeSwap,
    buyXStock,
    sellXStock,
    loading,
    error,
    connected,
    publicKey
  };
}; 