# Trading Application Design System

## Overview

This design system documentation covers the comprehensive cryptocurrency trading interface built with Next.js 14, React, TypeScript, and Tailwind CSS. The application features a dual-layout system with responsive desktop and mobile interfaces for professional trading.

## Architecture Principles

### 1. Component-Driven Architecture
- **Atomic Design**: Components built from basic UI primitives up to complex trading interfaces
- **Separation of Concerns**: Business logic separated into custom hooks, UI components handle presentation
- **Compound Components**: Complex components like AssetSelector use compound pattern for flexibility

### 2. Mobile-First Responsive Design
- Breakpoints: Mobile < 768px, Tablet < 1024px, Desktop >= 1024px
- Adaptive layouts: Tab-based mobile, grid-based desktop
- Progressive enhancement from mobile to desktop experience

### 3. TypeScript-First Development
- Comprehensive interface definitions for all trading data
- Type safety enforced throughout component tree
- Generic components with proper type constraints

## Layout System

### Desktop Layout (`desktop-view.tsx`)
```
┌─────────────────────────────────────────┬───────────┐
│ Market Panel                            │  Trading  │
├─────────────────┬───────────────────────┤   Panel   │
│                 │                       │           │
│     Chart       │    Order Book         │  (320px)  │
│                 │    & Trades           │           │
│                 │    (280px)            │           │
├─────────────────┴───────────────────────┤           │
│   Trading Management Tabs               │           │
│   (Positions, Orders, History...)       │           │
└─────────────────────────────────────────┴───────────┘
```

**Layout Specifications:**
- **Main Container**: `flex gap-3 p-3 pt-0 min-w-0`
- **Chart Area**: `flex-1` (flexible width)
- **Order Book**: `w-[280px] xl:w-[280px] lg:w-[240px] md:w-[200px] min-w-[180px]`
- **Trading Panel**: `w-[320px] xl:w-[320px] lg:w-[280px] md:w-[240px] min-w-[220px]`
- **Management Tabs**: `min-h-[300px]`

### Mobile Layout (`mobile-view.tsx`)
```
┌─────────────────────────────────────────┐
│ Asset Info Panel                        │
├─────────────────────────────────────────┤
│                                         │
│ Chart Panel (480px height)              │
│                                         │
├─────────────────────────────────────────┤
│ Management Tabs                         │
│                                         │
└─────────────────────────────────────────┘
[Trading Actions FAB]
```

**Layout Specifications:**
- **Container**: `flex-1 flex flex-col gap-3 overflow-y-auto px-3`
- **Chart Panel**: `h-[480px]` (fixed height)
- **Panels**: `bg-card border border-border rounded-lg shadow-sm`

## Design Tokens

### Color System
Based on HSL color values with opacity variations:

```css
/* Base Colors */
--background: 0 0% 3.9%           /* #0a0a0a - Main background */
--foreground: 0 0% 98%            /* #fafafa - Primary text */
--card: 0 0% 3.9%                 /* #0a0a0a - Card background */
--border: 0 0% 14.9%              /* #262626 - Border color */

/* White Opacity Scale */
--white-96: rgba(255, 255, 255, 0.96)  /* Primary text */
--white-80: rgba(255, 255, 255, 0.80)  /* Secondary text */
--white-64: rgba(255, 255, 255, 0.64)  /* Tertiary text */
--white-48: rgba(255, 255, 255, 0.48)  /* Placeholder text */
--white-32: rgba(255, 255, 255, 0.32)  /* Disabled text */
--white-16: rgba(255, 255, 255, 0.16)  /* Subtle backgrounds */
--white-8: rgba(255, 255, 255, 0.08)   /* Hover states */
--white-4: rgba(255, 255, 255, 0.04)   /* Very subtle backgrounds */

/* Semantic Colors */
--emerald-500: #10b981             /* Positive/Long positions */
--red-500: #ef4444                 /* Negative/Short positions */
--blue-500: #3b82f6                /* SPOT trading type */
--orange-500: #f97316              /* PERP trading type */
--purple-400: #a855f7              /* AI features accent */
--yellow-500: #eab308              /* Favorites/Important */
```

### Typography Scale
```css
/* Font Families */
--font-sans: Inter, system-ui, sans-serif
--font-mono: 'SF Mono', Consolas, monospace

/* Text Sizes */
.text-xs     { font-size: 0.75rem; }   /* 12px - Labels, captions */
.text-sm     { font-size: 0.875rem; }  /* 14px - Body text, descriptions */
.text-base   { font-size: 1rem; }      /* 16px - Default body */
.text-lg     { font-size: 1.125rem; }  /* 18px - Headings */
.text-xl     { font-size: 1.25rem; }   /* 20px - Large headings */

/* Font Weights */
.font-medium { font-weight: 500; }     /* Semi-bold for emphasis */
.font-bold   { font-weight: 700; }     /* Bold for headings */
```

### Spacing System
```css
/* Base unit: 4px (0.25rem) */
.gap-1     { gap: 0.25rem; }    /* 4px */
.gap-1.5   { gap: 0.375rem; }   /* 6px */
.gap-2     { gap: 0.5rem; }     /* 8px */
.gap-3     { gap: 0.75rem; }    /* 12px - Primary gap */
.gap-4     { gap: 1rem; }       /* 16px */

/* Padding */
.p-3       { padding: 0.75rem; }    /* 12px - Standard padding */
.p-4       { padding: 1rem; }       /* 16px - Larger padding */
.px-3      { padding: 0 0.75rem; }  /* Horizontal padding */
.py-1      { padding: 0.25rem 0; }  /* Vertical padding */
```

### Border Radius
```css
.rounded       { border-radius: 0.25rem; }    /* 4px - Default */
.rounded-lg    { border-radius: 0.5rem; }     /* 8px - Cards, panels */
.rounded-full  { border-radius: 9999px; }     /* Pills, badges */
```

## Core Components

### 1. NumericInput (`numeric-input.tsx`)
Specialized input component for numerical trading values.

**Features:**
- Input masking with `use-mask-input`
- Automatic number validation
- Transparent background design
- Custom onChange handler for numbers

**Usage Pattern:**
```tsx
<NumericInput
  mask="numeric"
  className="placeholder:text-white-32 md:text-xs bg-transparent outline-none"
  onChange={(value: number) => handleChange(value)}
/>
```

### 2. EmptyState (`empty-state.tsx`)
Consistent empty state component across tables and lists.

**Features:**
- Centered layout with custom icon
- Dual-text layout (heading + description)
- Consistent messaging pattern

**Visual Structure:**
```tsx
<div className="flex flex-col gap-4 items-center justify-center">
  <svg>{/* Custom empty state icon */}</svg>
  <div className="flex flex-col gap-2 items-center justify-center">
    <p className="text-md font-medium">Data Not Found</p>
    <p className="text-sm text-white-48">Description message</p>
  </div>
</div>
```

### 3. AssetSelector (`asset-selector.tsx`)
Complex compound component for asset selection with market data.

**Features:**
- Dual display modes: compact and full
- Responsive modal/drawer pattern
- Advanced filtering and search
- Real-time market data integration
- Category-based asset filtering

**Display Modes:**
- **Compact**: Icon-only with overlay trigger
- **Full**: Asset name, type badge, and chevron indicator

**Architecture Pattern:**
```tsx
// Responsive modal/drawer pattern
if (isDesktop) {
  return <Dialog>...</Dialog>
} else {
  return <Drawer>...</Drawer>
}
```

## Panel System

### AppPanel Wrapper
All trading panels use the `AppPanel` component wrapper for consistency.

```tsx
<AppPanel 
  className="flex flex-col p-0" 
  render={<ComponentContent />} 
/>
```

### Panel Background Pattern
```css
.bg-card           /* Panel background */
.border            /* Panel border */
.border-border     /* Border color */
.rounded-lg        /* Panel radius */
.shadow-sm         /* Subtle shadow */
```

## Table System

### Base Table Pattern (`balances-table.tsx`)
All trading tables follow a consistent pattern:

```tsx
<Table pure>
  <TableHeader className="sticky top-0 left-0 right-0 bg-background z-10">
    <TableRow className="!border-0">
      {columns.map((column) => (
        <TableHead className="whitespace-nowrap relative after:border-b after:border-white-8 after:absolute after:bottom-0 after:inset-x-0">
          {column.label}
        </TableHead>
      ))}
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map((row) => (
      <TableRow key={row.id}>
        <TableCell>{row.content}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

**Table Features:**
- Sticky headers with custom border
- Consistent cell padding and alignment
- Hover states on rows
- Pure table variant (no default borders)

## State Management Patterns

### Zustand Store Architecture
```typescript
interface StoreState {
  // Data properties
  data: DataType;
  
  // Loading states
  isLoading: boolean;
  
  // Actions
  setData: (value: DataType) => void;
  updateData: (updates: Partial<DataType>) => void;
}

export const useStore = create<StoreState>()((set, get) => ({
  data: initialData,
  isLoading: false,
  
  setData: (value) => set({ data: value }),
  updateData: (updates) => set((state) => ({
    data: { ...state.data, ...updates }
  })),
}));
```

### Custom Hooks Pattern
Business logic separated into custom hooks:

```typescript
export const useBalances = () => {
  const { data, isLoading } = useHyperliquidSDK();
  
  const columns = useMemo(() => [
    { label: "Asset", key: "asset" },
    { label: "Total", key: "total" },
    // ...
  ], []);
  
  const balances = useMemo(() => {
    return transformData(data);
  }, [data]);
  
  return { columns, balances, isLoading };
};
```

## Animation System

### Framer Motion Integration
Using `framer-motion` for smooth transitions:

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  {content}
</motion.div>
```

### Loading States
Consistent loading patterns:

```css
.animate-spin        /* Spinner animation */
.animate-pulse       /* Skeleton loading */
```

```tsx
// Loading skeleton pattern
<div className="animate-pulse">
  <div className="h-4 w-24 bg-white-8 rounded"></div>
  <div className="h-8 w-32 bg-white-8 rounded"></div>
</div>
```

## Interactive States

### Hover States
```css
.hover:bg-white-8        /* Light background on hover */
.hover:opacity-100       /* Full opacity on hover */
.hover:text-yellow-500   /* Color change on hover */
```

### Focus States
```css
.focus-within:bg-white-8  /* Focus-within for containers */
.outline-none            /* Remove default outline */
```

### Disabled States
```css
.disabled:opacity-50     /* Reduced opacity */
.cursor-not-allowed      /* Disabled cursor */
```

## Data Formatting Utilities

### Price Formatting
```typescript
// Standard price formatting
const formatPrice = (value: number, opts?: Intl.NumberFormatOptions) => {
  return Intl.NumberFormat("en-US", {
    currency: "USD",
    ...opts,
  }).format(value);
};

// Volume formatting
const formatNumber = (num: number) => {
  if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
  return num.toFixed(2);
};
```

### Color-Coded Values
```tsx
// Price change color coding
<div className={cn(
  "font-medium",
  change >= 0 ? "text-emerald-500" : "text-red-500"
)}>
  {change >= 0 ? "+" : ""}{change.toFixed(2)}%
</div>
```

## Asset Type System

### Type Indicators
```tsx
// Asset type badges
<span className={cn(
  "text-xs px-2 py-1 rounded font-medium text-white",
  assetType === "SPOT" ? "bg-blue-500" : "bg-orange-500"
)}>
  {assetType}
</span>
```

### Asset Categories
```typescript
const ASSET_CATEGORIES = {
  ai: ["FET", "IO", "RENDER", "TAO", "WLD"],
  defi: ["AAVE", "COMP", "CRV", "DYDX", ...],
  layer1: ["ADA", "APT", "ATOM", "AVAX", ...],
  layer2: ["ARB", "BLAST", "IMX", "MANTA", ...],
  meme: ["BOME", "BRETT", "DOGE", "kBONK", ...],
} as const;
```

## Icon System

### Icon Libraries
- **@untitled-ui/icons-react**: Primary icon set for UI elements
- **Custom SVG**: Embedded custom icons for empty states

### Icon Usage Pattern
```tsx
import { SearchMd, ChevronDown, Star04 } from "@untitled-ui/icons-react";

<SearchMd className="size-4 text-white-48" />
<ChevronDown className={cn("size-3", sortDirection === "asc" && "rotate-180")} />
```

## Token/Asset Display

### TokenIcon Component
Displays cryptocurrency icons with consistent sizing:

```tsx
<TokenIcon 
  symbol={asset.symbol} 
  size="24"         // "16", "24", "32"
  className={...}   // Additional styling
/>
```

## Chart Integration

### TradingView Integration
Charts use TradingView's lightweight-charts library:

```tsx
<TradingViewChart 
  symbol="BTCUSD"
  interval="1D"
  className="w-full h-full"
/>
```

## Authentication Integration

### Wagmi/Wallet Connection
```tsx
const { isConnected } = useAccount();

// Conditional rendering based on connection state
{!isConnected ? (
  <AppLoginButton>Connect</AppLoginButton>
) : (
  <TradingInterface />
)}
```

## Performance Optimizations

### Memoization Patterns
```typescript
const memoizedData = useMemo(() => {
  return expensiveDataTransformation(rawData);
}, [rawData]);

const memoizedCallbacks = useCallback((param) => {
  handleAction(param);
}, [dependency]);
```

### Virtual Scrolling
For large datasets, consider implementing virtual scrolling for table components.

## Accessibility Considerations

### ARIA Labels
```tsx
<button aria-label="Close Drawer">
  <XClose className="size-5" />
</button>
```

### Screen Reader Support
```tsx
<DialogDescription className="sr-only" />
```

### Keyboard Navigation
All interactive elements support keyboard navigation through native HTML semantics and proper focus management.

## Development Guidelines

### File Organization
```
components/
├── core/              # Reusable base components
├── layouts/           # Layout components
├── markets/           # Trading-specific components
├── trading-management-tabs/  # Table components
└── trading-mobile-tabs/      # Mobile-specific components
```

### Naming Conventions
- **Components**: PascalCase (e.g., `AssetSelector`)
- **Files**: kebab-case (e.g., `asset-selector.tsx`)
- **Interfaces**: PascalCase with `I` prefix (e.g., `IMarketData`)
- **Hooks**: camelCase with `use` prefix (e.g., `useBalances`)

### Import Organization
```typescript
// 1. React imports
import { useState, useMemo } from "react";

// 2. Third-party imports
import { motion } from "framer-motion";

// 3. UI component imports
import { Button } from "@brother-terminal/components/ui/button";

// 4. Local imports
import { EmptyState } from "./empty-state";
```

This design system ensures consistency, maintainability, and scalability across the trading application while providing a professional, responsive trading experience.