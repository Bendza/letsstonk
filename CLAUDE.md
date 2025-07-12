# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SolStock AI is a Solana-based robo-advisor that allows users to trade real stocks as tokens (xStocks) using Backed Finance. The application provides automated portfolio management with risk-based allocation strategies.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm start` - Start production server

## Supabase Backend Commands

- `supabase login` - Authenticate with Supabase CLI
- `supabase link --project-ref <ref>` - Link to Supabase project
- `supabase functions deploy <function-name>` - Deploy individual Edge Function
- `supabase functions deploy --cron-file supabase/functions/cron.yaml` - Deploy cron schedules

## Architecture

### Frontend (Next.js 14)
- **App Router**: Uses Next.js 14 App Router with TypeScript
- **UI Components**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: React hooks with dual providers (Mock and Real Solana wallet)

### Core Components
- **WalletProvider/MockWalletProvider**: Dual wallet system for development vs production
- **AppLayout/AppSidebar**: Main layout with sidebar navigation
- **Dashboard**: Portfolio overview with P&L tracking and analytics
- **InvestForm**: Risk-based investment form with 1-10 risk levels
- **TradingModal**: Swap interface for individual positions
- **Portfolio/TestPortfolio**: Real-time portfolio tracking with mock/real data

### Risk Engine (`lib/risk-engine.ts`)
- 10 risk levels from Ultra Conservative (1) to Ultra Aggressive (10)
- Pre-defined allocation strategies focusing on major tech stocks (xTSLA, xAAPL, xMSFT, xGOOGL, xAMZN)
- Risk level 1: 30% AAPL, 25% MSFT, 20% TSLA (conservative)
- Risk level 10: 70% TSLA, 8% AAPL, 7% MSFT (ultra aggressive)
- Dynamic position calculation based on total investment amount

### Backend (Supabase Edge Functions)
- **Database**: PostgreSQL with comprehensive schema and RLS policies
- **Edge Functions**: Deno-based serverless functions for core operations
- **Cron Jobs**: Automated scheduling for rebalancing, price updates, and portfolio sync

### Edge Functions Architecture
- `wallet-auth` - Wallet signature verification and user authentication
- `jupiter-quote` - Swap quote aggregation with safety checks
- `price-update` - Real-time xStock price fetching (every 5 min during market hours)
- `portfolio-sync` - On-chain balance synchronization (hourly during market hours)
- `risk-analysis` - Portfolio risk metrics calculation (daily at 2 AM UTC)
- `rebalance` - Automated portfolio rebalancing (daily at 3 AM UTC)

### Database Schema
- `users` - User profiles with wallet addresses and risk tolerance
- `portfolios` - Portfolio metadata with P&L tracking
- `positions` - Individual stock positions with allocation percentages
- `transactions` - Swap history with Jupiter integration
- `price_history` - Historical pricing data for P&L calculations
- `rebalance_logs` - Automated rebalancing audit trail

### External Integrations
- **Jupiter**: Swap aggregation and price feeds for Solana DEX
- **Backed Finance**: xStock token metadata and addresses
- **Solana Web3.js**: Blockchain interactions and wallet management

## Key File Locations

- Risk allocation logic: `lib/risk-engine.ts`
- Type definitions and Zod schemas: `lib/types.ts`
- Supabase client configuration: `lib/supabase.ts`
- Database schema: `supabase/migrations/001_initial_schema.sql`
- Cron job configuration: `supabase/functions/cron.yaml`
- Edge Functions: `supabase/functions/*/index.ts`
- Custom hooks: `hooks/` directory (portfolio, wallet auth, swap operations)

## Development Notes

- Uses dual provider system: MockWalletProvider for development, WalletProvider for production
- Component architecture follows shadcn/ui patterns with consistent styling
- Risk levels determine portfolio allocation automatically via `getAllocationForRisk()`
- Rebalancing triggers when allocation drifts > 5% from target
- All monetary values use high-precision decimals for accurate calculations
- Environment variables required for Supabase, Solana RPC, and optional Jupiter API key