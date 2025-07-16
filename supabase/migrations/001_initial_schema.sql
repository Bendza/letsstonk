-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  wallet_address TEXT UNIQUE,
  risk_tolerance INTEGER DEFAULT 5 CHECK (risk_tolerance >= 1 AND risk_tolerance <= 10),
  total_invested DECIMAL(20, 6) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portfolios table
CREATE TABLE public.portfolios (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL,
  risk_level INTEGER NOT NULL CHECK (risk_level >= 1 AND risk_level <= 10),
  total_value DECIMAL(20, 6) DEFAULT 0,
  initial_investment DECIMAL(20, 6) NOT NULL,
  current_pnl DECIMAL(20, 6) DEFAULT 0,
  pnl_percentage DECIMAL(10, 4) DEFAULT 0,
  last_rebalanced TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  rebalance_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Positions table (individual stock holdings)
CREATE TABLE public.positions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL, -- e.g., 'xTSLA'
  token_address TEXT NOT NULL, -- Solana token mint address
  amount DECIMAL(20, 6) NOT NULL, -- Token amount held
  target_percentage DECIMAL(5, 2) NOT NULL, -- Target allocation %
  current_percentage DECIMAL(5, 2) DEFAULT 0, -- Current allocation %
  average_price DECIMAL(20, 6) DEFAULT 0, -- Average purchase price
  current_price DECIMAL(20, 6) DEFAULT 0, -- Current market price
  value DECIMAL(20, 6) DEFAULT 0, -- Current position value
  pnl DECIMAL(20, 6) DEFAULT 0, -- Profit/Loss
  pnl_percentage DECIMAL(10, 4) DEFAULT 0, -- P&L percentage
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table (swap history)
CREATE TABLE public.transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE,
  transaction_signature TEXT UNIQUE NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('buy', 'sell', 'rebalance')),
  input_token TEXT NOT NULL, -- Input token mint
  output_token TEXT NOT NULL, -- Output token mint
  input_amount DECIMAL(20, 6) NOT NULL,
  output_amount DECIMAL(20, 6) NOT NULL,
  price_impact DECIMAL(10, 4), -- Price impact percentage
  slippage DECIMAL(10, 4), -- Actual slippage
  fees DECIMAL(20, 6) DEFAULT 0, -- Transaction fees
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  block_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Price history table (for P&L calculations)
CREATE TABLE public.price_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  token_address TEXT NOT NULL,
  symbol TEXT NOT NULL,
  price DECIMAL(20, 6) NOT NULL,
  volume_24h DECIMAL(20, 6),
  market_cap DECIMAL(20, 2),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(token_address, timestamp)
);

-- Rebalance logs
CREATE TABLE public.rebalance_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('scheduled', 'manual', 'threshold')),
  old_allocations JSONB,
  new_allocations JSONB,
  transactions JSONB, -- Array of transaction signatures
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX idx_portfolios_user_id ON public.portfolios(user_id);
CREATE INDEX idx_portfolios_wallet_address ON public.portfolios(wallet_address);
CREATE INDEX idx_positions_portfolio_id ON public.positions(portfolio_id);
CREATE INDEX idx_transactions_portfolio_id ON public.transactions(portfolio_id);
CREATE INDEX idx_transactions_signature ON public.transactions(transaction_signature);
CREATE INDEX idx_price_history_token_timestamp ON public.price_history(token_address, timestamp DESC);
CREATE INDEX idx_rebalance_logs_portfolio_id ON public.rebalance_logs(portfolio_id);

-- Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rebalance_logs ENABLE ROW LEVEL SECURITY;

-- Price history is public data - no RLS needed
-- ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Portfolio policies
CREATE POLICY "Users can view own portfolios" ON public.portfolios
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own portfolios" ON public.portfolios
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own portfolios" ON public.portfolios
  FOR UPDATE USING (auth.uid() = user_id);

-- Position policies
CREATE POLICY "Users can view own positions" ON public.positions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.portfolios 
      WHERE portfolios.id = positions.portfolio_id 
      AND portfolios.user_id = auth.uid()
    )
  );

-- Transaction policies
CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.portfolios 
      WHERE portfolios.id = transactions.portfolio_id 
      AND portfolios.user_id = auth.uid()
    )
  );

-- Rebalance log policies
CREATE POLICY "Users can view own rebalance logs" ON public.rebalance_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.portfolios 
      WHERE portfolios.id = rebalance_logs.portfolio_id 
      AND portfolios.user_id = auth.uid()
    )
  );

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for auto-updating timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON public.portfolios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_positions_updated_at BEFORE UPDATE ON public.positions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
