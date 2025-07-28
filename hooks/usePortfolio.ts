import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useWalletAuth } from './useWalletAuth';

interface Portfolio {
  id: string;
  user_id: string;
  wallet_address: string;
  risk_level: number;
  total_value: number;
  initial_investment: number;
  current_pnl: number;
  pnl_percentage: number;
  last_rebalanced: string;
  rebalance_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  positions: Position[];
}

interface Position {
  id: string;
  portfolio_id: string;
  symbol: string;
  token_address: string;
  amount: number;
  target_percentage: number;
  current_percentage: number;
  average_price: number;
  current_price: number;
  value: number;
  pnl: number;
  pnl_percentage: number;
  created_at: string;
  updated_at: string;
}

export function usePortfolio() {
  const { user, isAuthenticated } = useWalletAuth();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolio = useCallback(async () => {
    if (!user?.id || !isAuthenticated) {
      console.log('[PORTFOLIO] Skipping fetch - no user or not authenticated:', { userId: user?.id, isAuthenticated });
      setLoading(false);
      return;
    }

    try {
      console.log('[PORTFOLIO] Fetching real portfolio data for user:', user.id);
      setLoading(true);
      setError(null);

      // Fetch active portfolio with positions
      const { data: portfoliosData, error: portfoliosError } = await supabase
        .from('portfolios')
        .select(`
          *,
          positions (*)
        `)
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);

      console.log('[PORTFOLIO] Supabase query result:', { 
        data: portfoliosData, 
        error: portfoliosError,
        dataLength: portfoliosData?.length 
      });

      if (portfoliosError) {
        console.error('[PORTFOLIO] Error fetching portfolio:', portfoliosError);
        throw new Error(`Failed to fetch portfolio: ${portfoliosError.message}`);
      }

      if (!portfoliosData || portfoliosData.length === 0) {
        console.log('[PORTFOLIO] No active portfolio found for user:', user.id);
        setPortfolio(null);
        setLoading(false);
        return;
      }

      const portfolioData = portfoliosData[0];
      console.log('[PORTFOLIO] Retrieved portfolio data:', {
        id: portfolioData.id,
        totalValue: portfolioData.total_value,
        positionsCount: portfolioData.positions?.length || 0,
        positions: portfolioData.positions
      });

      // Convert to our interface format
      const portfolio: Portfolio = {
        id: portfolioData.id,
        user_id: portfolioData.user_id || '',
        wallet_address: portfolioData.wallet_address || '',
        risk_level: portfolioData.risk_level || 5,
        total_value: portfolioData.total_value || 0,
        initial_investment: portfolioData.initial_investment || 0,
        current_pnl: portfolioData.current_pnl || 0,
        pnl_percentage: portfolioData.pnl_percentage || 0,
        last_rebalanced: portfolioData.last_rebalanced || '',
        rebalance_count: portfolioData.rebalance_count || 0,
        is_active: portfolioData.is_active ?? true,
        created_at: portfolioData.created_at || '',
        updated_at: portfolioData.updated_at || '',
        positions: (portfolioData.positions || []).map((pos: any) => ({
          id: pos.id,
          portfolio_id: pos.portfolio_id || '',
          symbol: pos.symbol || '',
          token_address: pos.token_address || '',
          amount: pos.amount || 0,
          target_percentage: pos.target_percentage || 0,
          current_percentage: pos.current_percentage || 0,
          average_price: pos.average_price || 0,
          current_price: pos.current_price || 0,
          value: pos.value || 0,
          pnl: pos.pnl || 0,
          pnl_percentage: pos.pnl_percentage || 0,
          created_at: pos.created_at || '',
          updated_at: pos.updated_at || ''
        }))
      };

      setPortfolio(portfolio);
      console.log('[PORTFOLIO] Portfolio set successfully with', portfolio.positions.length, 'positions');
      console.log('[PORTFOLIO] Final portfolio object:', portfolio);

    } catch (err) {
      console.error('[PORTFOLIO] Error in fetchPortfolio:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch portfolio';
      setError(errorMessage);
      setPortfolio(null);
    } finally {
      setLoading(false);
    }
  }, [user?.id, isAuthenticated]);

  const syncPortfolio = useCallback(async () => {
    if (!portfolio) return;

    try {
      console.log('[PORTFOLIO] Syncing portfolio...');
      setError(null);

      // For now, just refresh the data
      // In the future, this could update prices, recalculate P&L, etc.
      await fetchPortfolio();
      
      console.log('[PORTFOLIO] Portfolio synced successfully');
    } catch (err) {
      console.error('[PORTFOLIO] Error syncing portfolio:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to sync portfolio';
      setError(errorMessage);
      throw err;
    }
  }, [portfolio, fetchPortfolio]);

  // Fetch portfolio data when user changes
  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  return {
    portfolio,
    loading,
    error,
    syncPortfolio,
    refetch: fetchPortfolio
  };
} 