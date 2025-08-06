# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SolStock AI is a Solana-based robo-advisor that allows users to trade real stocks as tokens (xStocks) using Backed Finance. The application provides automated portfolio management with risk-based allocation strategies.

## Technology Stack

### Frontend
- **Next.js 14**: App Router with TypeScript, server/client components
- **React 18**: Functional components with hooks-based state management
- **Tailwind CSS 3.4**: Utility-first styling with CSS variables and custom classes
- **shadcn/ui**: Component system built on Radix UI primitives
- **TanStack Query**: Data fetching, caching, and synchronization (5min stale time)
- **Privy**: Wallet authentication and user management (replaced Solana Wallet Adapter)
- **Zod**: Runtime type validation and schema definitions

### Backend & Infrastructure
- **Supabase**: PostgreSQL database with Edge Functions and real-time subscriptions
- **Deno**: Runtime for Edge Functions with TypeScript support
- **Cron Jobs**: Automated portfolio rebalancing and price updates
- **Vercel**: Deployment platform for Next.js application

### Blockchain & Trading
- **Solana Web3.js**: Blockchain interactions and wallet management
- **Jupiter API**: DEX aggregation for swap quotes and execution
- **Backed Finance**: xStock tokenized securities provider
- **SPL Token**: Solana Program Library for token operations

## Project Structure

### Root Configuration Files
- `package.json` - Dependencies and build scripts
- `next.config.mjs` - Next.js configuration with ESLint/TypeScript overrides
- `tailwind.config.ts` - Tailwind CSS configuration with custom theme
- `tsconfig.json` - TypeScript configuration with path mapping
- `components.json` - shadcn/ui configuration and aliases
- `postcss.config.mjs` - PostCSS configuration for Tailwind

### Directory Structure

#### `/app` - Next.js App Router Pages
- `layout.tsx` - Root layout with metadata and providers
- `page.tsx` - Landing page component
- `providers.tsx` - Global providers (React Query, Wallet)
- `globals.css` - Global styles and Tailwind imports
- `dashboard/` - Dashboard routes with nested layouts
  - `layout.tsx` - Dashboard-specific layout
  - `page.tsx` - Main dashboard page
  - `portfolio/`, `analytics/`, `history/`, `markets/`, `settings/` - Feature pages
- Additional static pages: `about/`, `how-it-works/`, `privacy/`, `terms/`, `risk/`

#### `/components` - React Components
- **Layout Components**: `AppLayout.tsx`, `AppSidebar.tsx`, `Navigation.tsx`
- **Feature Components**: `Dashboard.tsx`, `Portfolio.tsx`, `InvestForm.tsx`, `TradingModal.tsx`
- **Provider Components**: `PrivyProvider.tsx`, `PrivyWalletButton.tsx` (Privy authentication system)
- **UI Components**: Complete shadcn/ui component library in `ui/` subdirectory
- **Utility Components**: `ClientOnly.tsx`, `DisclaimerModal.tsx`, `LegalBanner.tsx`

#### `/lib` - Core Business Logic
- `types.ts` - TypeScript types and Zod validation schemas
- `utils.ts` - Utility functions (className merging with clsx/tailwind-merge)
- `risk-engine.ts` - Risk allocation algorithms and portfolio calculations
- `supabase.ts` - Database client configuration with typed schemas
- `solana-utils.ts` - Blockchain utilities and transaction helpers
- `xstocks-config.ts` - Curated xStock token configurations and metadata
- `fetchXStocks.ts` - API functions for fetching stock data
- `rpc-config.ts` - Solana RPC endpoint management
- `server-actions.ts` - Next.js server actions for backend operations

#### `/hooks` - Custom React Hooks
- `usePortfolio.ts` - Portfolio data fetching and management
- `useWalletAuth.ts` - Legacy wallet authentication (deprecated)
- `usePrivyAuth.ts` - Privy authentication and user management
- `useJupiterSwap.ts` - Jupiter DEX integration for swaps
- `useJupiterTrading.ts` - Enhanced trading operations
- `useMockSwap.ts` - Mock trading for development
- `useRiskAssessment.ts` - Risk tolerance assessment logic
- `useSwapLeg.ts` - Individual swap leg management

#### `/supabase` - Backend Configuration
- `migrations/001_initial_schema.sql` - Database schema definition
- `functions/` - Edge Functions for serverless operations
  - `cron.yaml` - Cron job scheduling configuration
  - `wallet-auth/` - Signature verification
  - `jupiter-quote/` - Swap quote aggregation
  - `price-update/` - Real-time price updates
  - `portfolio-sync/` - On-chain balance synchronization
  - `risk-analysis/` - Portfolio risk calculations
  - `rebalance.ts` - Automated rebalancing logic

#### `/public` - Static Assets
- Logos, icons, and images
- Favicons and app icons
- Hero images and placeholders

## Development Commands

### Frontend Development
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build optimized production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint code analysis

### Important Build Configuration
- ESLint and TypeScript errors are ignored during builds (`ignoreDuringBuilds: true`)
- Images are unoptimized for deployment compatibility
- No test runner configured - manual testing through UI

## Important Architecture Notes

### Frontend-Only Architecture
- **Current State**: Supabase integration has been disabled/stubbed out in favor of a frontend-only approach
- **Database Operations**: The `lib/supabase.ts` file contains stub implementations for backward compatibility
- **Authentication**: Uses Privy exclusively for wallet authentication and user management
- **Data Storage**: Relies on client-side state management and external APIs rather than database persistence

## Supabase Backend Commands (Legacy)

Note: These commands are for reference only as Supabase functionality is currently disabled.

- `supabase login` - Authenticate with Supabase CLI
- `supabase link --project-ref <ref>` - Link to Supabase project
- `supabase functions deploy <function-name>` - Deploy individual Edge Function
- `supabase functions deploy --cron-file supabase/functions/cron.yaml` - Deploy cron schedules

## Architecture Patterns

### Component Architecture
- **Composition over Inheritance**: Reusable components with prop interfaces
- **Server/Client Components**: Proper separation for Next.js App Router
- **shadcn/ui Pattern**: Consistent component API with Radix UI primitives
- **Authentication System**: Privy-based wallet connection with unified user management

### State Management
- **React Query**: Server state management with caching and synchronization
- **React Hooks**: Local component state and side effects
- **Context Providers**: Global state for wallet connection and user data
- **Optimistic Updates**: Immediate UI feedback with eventual consistency

### Data Flow
- **Type Safety**: End-to-end TypeScript with Zod validation schemas
- **Frontend-First**: Client-side state management with React Query for API data
- **Real-time Updates**: Live data through external APIs (Jupiter, Backed Finance)
- **Mock Data**: Development uses mock implementations for database-dependent features

### Risk Engine Architecture
- 10 risk levels from Ultra Conservative (1) to Ultra Aggressive (10)
- Pre-defined allocation strategies focusing on major tech stocks (xTSLA, xAAPL, xMSFT, xGOOGL, xAMZN)
- Risk level 1: 30% AAPL, 25% MSFT, 20% TSLA (conservative)
- Risk level 10: 70% TSLA, 8% AAPL, 7% MSFT (ultra aggressive)
- Dynamic position calculation based on total investment amount

### Database Schema (Legacy Reference)
Note: Database functionality is currently disabled. The following schema exists for reference:
- `users` - User profiles with wallet addresses and risk tolerance
- `portfolios` - Portfolio metadata with P&L tracking
- `positions` - Individual stock positions with allocation percentages
- `transactions` - Swap history with Jupiter integration
- `price_history` - Historical pricing data for P&L calculations
- `rebalance_logs` - Automated rebalancing audit trail
- `xstocks_metadata` - Token metadata and trading configurations

### External Integrations
- **Jupiter**: Swap aggregation and price feeds for Solana DEX
- **Backed Finance**: xStock token metadata and addresses
- **Solana Web3.js**: Blockchain interactions and wallet management

## Configuration and Environment

### Required Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role for Edge Functions
- `NEXT_PUBLIC_PRIVY_APP_ID` - Privy application ID for authentication
- `NEXT_PUBLIC_TRADING_RPC_URL` - Custom Solana RPC endpoint (optional)
- `JUP_API_KEY` - Jupiter API key for enhanced rate limits (optional)

### Development Workflow
- **Authentication Testing**: Privy provides seamless wallet connection in all environments
- **Mock Data Development**: Use mock implementations for database-dependent features during development
- **Component Development**: shadcn/ui components with consistent theming and TypeScript interfaces
- **API Integration**: External APIs (Jupiter, Backed Finance) for live trading and price data
- **Lenient Build Process**: TypeScript and ESLint errors ignored during builds for rapid iteration

## Key Development Patterns

### Component Conventions
- Use TypeScript interfaces for all props
- Implement proper error boundaries and loading states
- Follow shadcn/ui patterns for consistent styling
- Use `cn()` utility for className merging

### Data Fetching Patterns
- React Query for server state management
- Custom hooks for business logic encapsulation
- Optimistic updates for improved UX
- Error handling with user-friendly messages

### Styling Conventions
- Tailwind CSS with semantic class names
- CSS variables for theming support
- Custom utility classes in `globals.css`
- Responsive design with mobile-first approach

### Business Logic Organization
- Risk engine calculations in dedicated modules (`lib/risk-engine.ts`)
- Frontend data management with mock implementations (`lib/frontend-data.ts`)
- Reusable utility functions in `/lib`
- Custom hooks for complex state management and API integration

## Development Notes

- **Current Architecture**: Frontend-only with Privy authentication, Supabase functionality disabled
- Uses Privy for unified wallet authentication across all environments  
- Component architecture follows shadcn/ui patterns with consistent styling
- Risk levels determine portfolio allocation automatically via `getAllocationForRisk()`
- Mock implementations handle portfolio data and transaction history for UI development
- All monetary values use high-precision decimals for accurate calculations
- Zod schemas provide runtime validation for all data structures
- TypeScript strict mode enabled with path mapping (`@/components`, `@/lib`, `@/hooks`)
- Next.js App Router with server/client component separation
- Build process is configured for rapid iteration with error tolerance (ignore TS/ESLint errors)
- External APIs (Jupiter, Backed Finance) provide real trading capabilities and market data