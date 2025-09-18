# Sandbox Trading Application Architecture

## Overview
The sandbox directory (`/src/app/sandbox/`) contains a comprehensive cryptocurrency trading interface built with Next.js 14, React, and TypeScript. It features responsive design with separate desktop and mobile layouts.

## Directory Structure
```
sandbox/
├── page.tsx              # Main entry point, detects device and renders appropriate layout
├── layout.tsx            # Wraps app with AuthProvider
├── portfolio/            # Portfolio page (separate feature)
└── _/                    # Private directory with all trading app logic
    ├── api/              # API integration (to be implemented)
    ├── components/       # All UI components
    ├── hooks/            # Custom React hooks
    ├── interfaces/       # TypeScript types and interfaces
    ├── mock/             # Mock data for development
    ├── store/            # Zustand state management
    └── utils/            # Utility functions
```

## Core Architecture

### 1. Layout System
- **Desktop**: Grid-based layout with 4 main sections:
  - Left: Watchlist
  - Center: Chart
  - Right: Order panel
  - Bottom: Management tabs
- **Mobile**: Tab-based interface with floating action button

### 2. State Management (Zustand)
Three main stores manage application state:

#### useTradingStore
- Selected trading pair (base/quote assets)
- Market information (price, change, funding rate)
- Trading size input
- Order type (long/short)

#### useWatchlistStore
- Watchlist data array
- Search/filter state
- Sorting configuration
- Tab selection (All/Favorites)
- Starred items tracking

#### useTradingChartStore
- Chart configuration options
- Chart type (candlestick/area)
- Time intervals (1m to 1M)
- Chart appearance settings

### 3. Component Architecture

#### Main Components
- **TradingApp** (`/components/trading-app/`): Root component that switches between layouts
- **MarketPanel**: Shows current market info (price, change%, funding)
- **MarketWatchlist**: Displays tradeable pairs with filtering/sorting
- **MarketOrderPanel**: Interface for placing orders
- **MarketChart**: Trading chart with technical analysis

#### Trading Management Tabs
- **PositionsTable**: Open positions with PnL tracking
- **OrderHistoryTable**: Past orders
- **FundingHistoryTable**: Funding payments
- **DepositAndWithdrawalTable**: Transaction history

#### Core UI Components
- **AssetSelector**: Dropdown for asset selection
- **NumericInput**: Specialized number input
- **EmptyState**: Placeholder for empty data

### 4. Data Flow Patterns

#### Asset Selection Flow
1. User clicks asset in watchlist or uses selector
2. `useWatchlist` hook updates trading store
3. Watchlist highlights selected item
4. Chart updates to show new pair data
5. Order panel reflects new trading pair

#### Order Placement Flow
1. User selects long/short
2. Inputs trade size
3. System validates available balance
4. Shows order summary with fees
5. User confirms order placement

#### Watchlist Interaction
1. User can search/filter pairs
2. Star favorites for quick access
3. Sort by various criteria (volume, change%)
4. Click to select for trading

### 5. Key Features

#### Trading Features
- Multi-asset support (base/quote pairs)
- Long/short positions
- Percentage-based sizing
- Asset allocation with swap
- Leverage support

#### Market Data
- Real-time price updates
- 24h change percentages
- Funding rates
- Volume tracking

#### Charting
- Multiple timeframes (1m, 5m, 1H, 1D, 1W, 1M)
- Candlestick and area charts
- Dark theme optimized
- Powered by lightweight-charts library

#### Position Management
- Real-time PnL calculations
- Liquidation price tracking
- Margin requirements
- Position sharing functionality

### 6. Authentication
- Uses Privy for authentication
- Protected routes require login
- Login prompts for unauthenticated users
- Embedded wallet support

### 7. Mobile Optimizations
- Tab-based navigation
- Floating action button for orders
- Drawer-based order placement
- Responsive table designs

### 8. Development Patterns

#### Custom Hooks
- `useTradingApp`: Main app logic
- `useWatchlist`: Watchlist data management
- `usePositions`: Position tracking
- `useOrderHistories`: Order history
- `useTradingChart`: Chart configuration

#### TypeScript Interfaces
- `ITradingAsset`: Asset definition
- `IWatchlistItem`: Watchlist row data
- `IPosition`: Position tracking
- `IOrderHistory`: Order records
- Chart types and configs

#### Mock Data
All features use mock data in development:
- `mock/watchlist-data.ts`: Sample trading pairs
- `mock/positions-data.ts`: Sample positions
- `mock/order-histories-data.ts`: Sample orders
- `mock/chart-data.ts`: Sample price data

### 9. UI/UX Conventions
- Consistent color scheme (green for long, red for short)
- Percentage formatting with + prefix for positive
- Currency formatting with appropriate decimals
- Loading states and empty states
- Responsive breakpoints (mobile < 768px, tablet < 1024px)

### 10. Technical Stack
- **Framework**: Next.js 14 (App Router)
- **UI**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Charts**: Lightweight Charts
- **Auth**: Privy
- **Icons**: Untitled UI
- **Components**: Custom + Radix UI primitives

## Important Notes for Development
1. All components follow compound component pattern
2. Business logic separated into custom hooks
3. Mock data allows full development without API
4. Mobile-first responsive design approach
5. Type safety enforced throughout
6. Dark theme is the primary theme

## Future Considerations
- API integration points are prepared but not implemented
- WebSocket connections for real-time data
- Order execution logic needs backend integration
- Position management requires wallet integration