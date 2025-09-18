# @nktkas/hyperliquid SDK Knowledge Center

## Overview

The `@nktkas/hyperliquid` SDK is an unofficial TypeScript SDK for interacting with the Hyperliquid API. It provides comprehensive support for all major JavaScript runtimes and offers a fully typed interface for both WebSocket and HTTP communications with the Hyperliquid DEX.

**Version**: 0.24.1  
**GitHub**: https://github.com/nktkas/hyperliquid  
**License**: MIT  

### Key Features
- 🖋️ **Fully Typed**: 100% TypeScript with comprehensive type definitions
- 🧪 **Well Tested**: Good code coverage and type relevance
- 📦 **Minimal Dependencies**: Only 3 trusted dependencies (@msgpack/msgpack, @noble/hashes, @noble/secp256k1)
- 🌐 **Cross-Platform**: Compatible with Node.js, Deno, Browser, React Native
- 🔧 **Wallet Integration**: Works with viem, ethers.js, and private keys directly
- 📚 **Well Documented**: JSDoc annotations with usage examples

## Architecture Overview

### Core Components

```
@nktkas/hyperliquid/
├── clients/           # API client implementations
│   ├── info.js        # Info API client for data queries
│   ├── exchange.js    # Exchange API client for trading
│   ├── subscription.js # WebSocket subscription client
│   └── multiSign.js   # Multi-signature client
├── transports/        # Communication layer
│   ├── http/          # HTTP transport implementation
│   └── websocket/     # WebSocket transport with auto-reconnect
├── types/             # TypeScript type definitions
│   ├── info/          # Info API types
│   ├── exchange/      # Exchange API types
│   └── subscriptions/ # WebSocket subscription types
└── signing/           # Transaction signing utilities
```

## Transport Layer

### HTTP Transport (`HttpTransport`)
**File**: `src/transports/http/http_transport.d.ts`

- Uses fetch API for HTTP requests
- Automatically determines target URL based on request type and testnet flag
- Configurable timeout (default: 10,000ms)
- Support for custom server URLs and fetch options
- Request/response hooks for customization

```typescript
const httpTransport = new hl.HttpTransport({
  isTestnet: false,
  timeout: 10_000,
  server: {
    mainnet: { api: "https://api.hyperliquid.xyz" },
    testnet: { api: "https://api.hyperliquid-testnet.xyz" }
  }
});
```

### WebSocket Transport (`WebSocketTransport`)
**File**: `src/transports/websocket/websocket_transport.d.ts:52-136`

Advanced WebSocket implementation with enterprise-grade reliability features:

#### Key Features
- **Auto-Reconnection**: `ReconnectingWebSocket` with exponential backoff
- **Message Buffering**: FIFO buffer maintains message order during reconnects
- **Keep-Alive**: Smart ping/pong mechanism (30s intervals)
- **Subscription Recovery**: Auto-resubscribes after reconnection
- **Connection Management**: Lazy initialization with ready() method

#### Reconnection Strategy
**File**: `src/transports/websocket/_reconnecting_websocket.d.ts:3-35`

```typescript
interface ReconnectingWebSocketOptions {
  maxRetries: number;              // Default: 3
  connectionTimeout: number;       // Default: 10,000ms
  connectionDelay: number | fn;    // Exponential backoff (max 10s)
  shouldReconnect: (event) => bool; // Default: always reconnect
  messageBuffer: MessageBufferStrategy; // FIFO buffer
}
```

#### Connection URLs
- **Mainnet API**: `wss://api.hyperliquid.xyz/ws`
- **Mainnet Explorer**: `wss://rpc.hyperliquid.xyz/ws`
- **Testnet API**: `wss://api.hyperliquid-testnet.xyz/ws`
- **Testnet Explorer**: `wss://rpc.hyperliquid-testnet.xyz/ws`

## Client APIs

### InfoClient
**File**: `src/clients/info.d.ts:106-1295`

Read-only client for market data and account information queries.

#### Market Data Methods (Lines 398-566)
```typescript
// Price data
allMids(): Promise<AllMids>                    // All mid prices
l2Book(params): Promise<Book>                  // Order book snapshot
candleSnapshot(params): Promise<Candle[]>      // Historical candles
fundingHistory(params): Promise<FundingHistory[]> // Funding rates

// Market metadata
meta(): Promise<PerpsMeta>                     // Trading metadata
metaAndAssetCtxs(): Promise<PerpsMetaAndAssetCtxs> // Asset contexts
spotMeta(): Promise<SpotMeta>                  // Spot metadata
```

#### Account Data Methods (Lines 418-459)
```typescript
// Account summaries
clearinghouseState(params): Promise<PerpsClearinghouseState>
spotClearinghouseState(params): Promise<SpotClearinghouseState>

// Trading data
openOrders(params): Promise<Order[]>           // Open orders
userFills(params): Promise<Fill[]>             // Trade fills
userFunding(params): Promise<UserFundingUpdate[]> // Funding history
portfolio(params): Promise<PortfolioPeriods>   // Portfolio metrics
```

#### Validator/Staking Methods (Lines 449-455)
```typescript
delegations(params): Promise<Delegation[]>     // User delegations
delegatorRewards(params): Promise<DelegatorReward[]> // Staking rewards
validatorSummaries(): Promise<ValidatorSummary[]> // All validators
```

### ExchangeClient
**File**: `src/clients/exchange.d.ts:231-1418`

Trading client for executing transactions and managing positions.

#### Order Management (Lines 486-495)
```typescript
// Order operations
order(params): Promise<OrderSuccessResponse>      // Place orders
cancel(params): Promise<CancelSuccessResponse>    // Cancel orders
modify(params): Promise<SuccessResponse>          // Modify orders
batchModify(params): Promise<OrderSuccessResponse> // Batch modifications

// TWAP orders
twapOrder(params): Promise<TwapOrderSuccessResponse>   // TWAP orders
twapCancel(params): Promise<TwapCancelSuccessResponse> // Cancel TWAP
```

#### Account Management (Lines 498-518)
```typescript
// Account setup
approveAgent(params): Promise<SuccessResponse>    // Approve API wallet
createSubAccount(params): Promise<CreateSubAccountResponse>
setDisplayName(params): Promise<SuccessResponse>

// Leverage and margin
updateLeverage(params): Promise<SuccessResponse>
updateIsolatedMargin(params): Promise<SuccessResponse>
```

#### Transfer Operations (Lines 512-519)
```typescript
// Fund transfers
withdraw3(params): Promise<SuccessResponse>       // Withdraw to L1
usdSend(params): Promise<SuccessResponse>         // Send USDC
spotSend(params): Promise<SuccessResponse>        // Send spot tokens
subAccountTransfer(params): Promise<SuccessResponse> // Sub-account transfers
vaultTransfer(params): Promise<SuccessResponse>   // Vault deposits/withdrawals
```

### SubscriptionClient
**File**: `src/clients/subscription.d.ts:48-462`

WebSocket client for real-time data subscriptions.

#### Market Subscriptions (Lines 84-305)
```typescript
// Real-time market data
allMids(listener): Promise<Subscription>          // All mid prices
l2Book(params, listener): Promise<Subscription>   // Order book updates
trades(params, listener): Promise<Subscription>   // Trade feed
candle(params, listener): Promise<Subscription>   // Candlestick updates
bbo(params, listener): Promise<Subscription>      // Best bid/offer
activeAssetCtx(params, listener): Promise<Subscription> // Asset context updates
```

#### User Subscriptions (Lines 106-439)
```typescript
// Account updates
userFills(params, listener): Promise<Subscription>    // Trade fills
orderUpdates(params, listener): Promise<Subscription> // Order status
userEvents(params, listener): Promise<Subscription>   // General events
userFundings(params, listener): Promise<Subscription> // Funding updates
notification(params, listener): Promise<Subscription> // Notifications
webData2(params, listener): Promise<Subscription>     // Comprehensive user/market data
userNonFundingLedgerUpdates(params, listener): Promise<Subscription> // Ledger updates
activeAssetData(params, listener): Promise<Subscription> // User-specific asset data
```

#### Subscription Management
```typescript
const sub = await subsClient.l2Book({ coin: "ETH" }, (data) => {
  console.log("Order book update:", data);
});

// Unsubscribe when done
await sub.unsubscribe();
```

### MultiSignClient
**File**: `src/clients/exchange.d.ts:585-601`

Extends ExchangeClient for multi-signature account management.

```typescript
const multiSignClient = new hl.MultiSignClient({
  transport: new hl.HttpTransport(),
  multiSignAddress: "0x...",
  signers: [
    "0x...", // Leader (signs twice)
    viemAccount,
    ethersWallet,
    customSigner
  ]
});
```

## Type System

### Request Types
**File**: `src/types/info/requests.d.ts`

All API requests follow a consistent pattern:
```typescript
interface BaseRequest {
  type: string;           // Request type identifier
  // ... specific parameters
}

// Examples
interface L2BookRequest {
  type: "l2Book";
  coin: string;           // Asset symbol
  nSigFigs?: 2|3|4|5;    // Precision
  mantissa?: 2|5;        // Aggregation
}

interface CandleSnapshotRequest {
  type: "candleSnapshot";
  req: {
    coin: string;         // Asset symbol
    interval: "1m"|"5m"|"1h"|"1d"|"1w"|"1M"; // Time interval
    startTime: number;    // Unix timestamp
    endTime?: number;     // Optional end time
  };
}
```

### Response Types
Responses are strongly typed with discriminated unions for error handling:

```typescript
// Success responses
interface SuccessResponse { status: "ok"; response: { type: "default" } }
interface OrderSuccessResponse { status: "ok"; response: { type: "order"; data: { statuses: OrderStatus[] } } }

// Error responses  
interface ErrorResponse { status: "err"; response: string }
```

## Authentication & Signing

### Wallet Support
The SDK supports multiple wallet implementations:

```typescript
// Private key directly
const client = new hl.ExchangeClient({ 
  wallet: "0x...", 
  transport 
});

// Viem wallet
import { privateKeyToAccount } from "viem/accounts";
const account = privateKeyToAccount("0x...");
const client = new hl.ExchangeClient({ 
  wallet: account, 
  transport 
});

// Ethers wallet
import { ethers } from "ethers";
const wallet = new ethers.Wallet("0x...");
const client = new hl.ExchangeClient({ 
  wallet, 
  transport 
});

// External wallet (MetaMask)
import { createWalletClient, custom } from "viem";
const [account] = await window.ethereum.request({ method: "eth_requestAccounts" });
const wallet = createWalletClient({ account, transport: custom(window.ethereum) });
const client = new hl.ExchangeClient({ 
  wallet, 
  transport 
});
```

### Signature Chain
- **L1 Actions**: Signed with chain ID 1337 (Hyperliquid's requirement)
- **User Signed Actions**: Use EIP-712 structured signing
- **Nonce Management**: Automatic monotonic increment based on timestamp

## WebSocket Subscription Types & Responses

### webData2 Subscription
**File**: `src/types/subscriptions/responses.d.ts:166-186`

The `webData2` subscription provides comprehensive user and market data in a single stream:

```typescript
interface WsWebData2 {
  clearinghouseState: PerpsClearinghouseState;  // Account summary
  leadingVaults: { address: Hex; name: string }[]; // Top vaults
  totalVaultEquity: string;                     // Total vault equity
  openOrders: FrontendOrder[];                  // User's open orders
  agentAddress: Hex | null;                     // Agent if exists
  agentValidUntil: number | null;               // Agent validity
  cumLedger: string;                           // Cumulative ledger
  meta: { universe: Asset[] };                 // Asset metadata
  assetCtxs: AssetContext[];                   // Asset contexts
  serverTime: number;                          // Server timestamp
  isVault: boolean;                            // Is vault account
  user: string;                                // User address
  twapStates: TwapState[];                     // TWAP order states
  spotAssetCtxs: SpotAssetContext[];          // Spot asset contexts
  perpsAtOpenInterestCap: string[];           // Capped assets
}
```

### Subscription Request Types
**File**: `src/types/subscriptions/requests.d.ts`

Key subscription types with their parameters:

```typescript
// webData2 - Comprehensive user data
interface WsWebData2Request {
  type: "webData2";
  user: Hex;  // User wallet address
}

// activeAssetCtx - Asset context updates
interface WsActiveAssetCtxRequest {
  type: "activeAssetCtx";
  coin: string;  // Asset symbol (e.g., "BTC")
}

// candle - Price candles
interface WsCandleRequest {
  type: "candle";
  coin: string;
  interval: "1m"|"3m"|"5m"|"15m"|"30m"|"1h"|"2h"|"4h"|"8h"|"12h"|"1d"|"3d"|"1w"|"1M";
}

// userNonFundingLedgerUpdates - Account ledger changes
interface WsUserNonFundingLedgerUpdatesRequest {
  type: "userNonFundingLedgerUpdates";
  user: Hex;
}
```

## Advanced Features

### Error Handling
**File**: `src/clients/exchange.d.ts:222-225`

```typescript
class ApiRequestError extends HyperliquidError {
  response: ErrorResponse | OrderResponse | CancelResponse;
  constructor(response) { /* ... */ }
}

try {
  await exchClient.order({ /* params */ });
} catch (error) {
  if (error instanceof ApiRequestError) {
    console.log("API Error:", error.response);
  }
}
```

### Connection Management
```typescript
// WebSocket connection control
await transport.ready();    // Wait for connection
await transport.close();    // Graceful shutdown

// HTTP with custom options
const transport = new hl.HttpTransport({
  onRequest: (req) => {
    req.headers.set('Custom-Header', 'value');
    return req;
  },
  onResponse: (res) => {
    console.log('Response status:', res.status);
    return res;
  }
});
```

### Rate Limiting & Request Weight
```typescript
// Reserve additional API weight
await exchClient.reserveRequestWeight({ weight: 10 });

// Check current rate limits
const limits = await infoClient.userRateLimit({ user: "0x..." });
```

## Configuration Options

### Environment-Specific Settings
```typescript
// Testnet configuration
const client = new hl.ExchangeClient({
  wallet: privateKey,
  transport: new hl.HttpTransport({ isTestnet: true }),
  isTestnet: true
});

// Production with custom chain ID
const client = new hl.ExchangeClient({
  wallet: privateKey,
  transport: new hl.WebSocketTransport(),
  signatureChainId: "0x1", // Ethereum mainnet
  nonceManager: () => Date.now() // Custom nonce strategy
});
```

### WebSocket Optimization
```typescript
const wsTransport = new hl.WebSocketTransport({
  keepAlive: { interval: 15000 },     // Faster ping
  reconnect: { maxRetries: 5 },       // More retries
  autoResubscribe: true               // Auto-resubscribe
});
```

## Best Practices

### 1. Transport Selection
- **HTTP**: One-time requests, serverless environments
- **WebSocket**: Real-time data, better latency, persistent connections

### 2. Error Handling
Always wrap API calls in try-catch blocks and handle specific error types:

```typescript
try {
  const result = await exchClient.order(orderParams);
} catch (error) {
  if (error instanceof ApiRequestError) {
    // Handle API-specific errors
  } else if (error instanceof TransportError) {
    // Handle transport/network errors
  }
}
```

### 3. Resource Management
```typescript
// Use async disposal for automatic cleanup
await using client = new hl.SubscriptionClient({ transport });
// Automatically disposed at scope end

// Manual cleanup
const client = new hl.SubscriptionClient({ transport });
try {
  // Use client
} finally {
  await client[Symbol.asyncDispose]();
}
```

### 4. Multi-Asset Trading
```typescript
// Get all available assets
const meta = await infoClient.meta();
const assetCtxs = await infoClient.metaAndAssetCtxs();

// Find asset index by symbol
const assetIndex = meta.universe.find(u => u.name === "BTC")?.id;
```

### 5. Market Orders
Hyperliquid doesn't have traditional market orders. Use limit orders with IoC:

```typescript
// Simulate market buy (use high price)
const book = await infoClient.l2Book({ coin: "BTC" });
const marketPrice = parseFloat(book.levels[0][0]) * 1.01; // 1% above best ask

await exchClient.order({
  orders: [{
    a: assetIndex,
    b: true,              // Buy
    p: marketPrice.toString(),
    s: "0.1",            // Size
    r: false,            // Not reduce-only
    t: { limit: { tif: "Ioc" } } // Immediate or Cancel
  }],
  grouping: "na"
});
```

## Common Use Cases

### Real-Time Price Monitoring
```typescript
const subsClient = new hl.SubscriptionClient({
  transport: new hl.WebSocketTransport()
});

// Subscribe to all mid prices
await subsClient.allMids((data) => {
  Object.entries(data.mids).forEach(([coin, price]) => {
    console.log(`${coin}: $${price}`);
  });
});
```

### WebData2 Integration Pattern
```typescript
// Subscribe to comprehensive user data (includes positions, orders, assets)
const webData2Sub = await subsClient.webData2({ user: "0x..." }, (data) => {
  // Update user positions
  updateUserPositions(data.clearinghouseState.assetPositions);
  
  // Update asset contexts (pricing, funding rates)
  updateAssetContexts(data.assetCtxs);
  
  // Update open orders
  updateOpenOrders(data.openOrders);
  
  // Check for assets at open interest cap
  checkOpenInterestCaps(data.perpsAtOpenInterestCap);
});
```

### Multi-Asset Real-Time Data
```typescript
const assets = ["BTC", "ETH", "SOL"];
const subscriptions = [];

for (const asset of assets) {
  // Asset context (funding, mark price, volume)
  const ctxSub = await subsClient.activeAssetCtx({ coin: asset }, (data) => {
    console.log(`${data.coin}: Mark=${data.ctx.markPx}, Funding=${data.ctx.funding}`);
  });
  
  // Order book updates
  const bookSub = await subsClient.l2Book({ coin: asset }, (data) => {
    const bestBid = data.levels[1]?.[0]; // levels[1] = bids
    const bestAsk = data.levels[0]?.[0]; // levels[0] = asks
    console.log(`${data.coin}: Bid=${bestBid?.px}, Ask=${bestAsk?.px}`);
  });
  
  // Price candles
  const candleSub = await subsClient.candle({ coin: asset, interval: "1m" }, (data) => {
    console.log(`${data.s}: OHLC=[${data.o}, ${data.h}, ${data.l}, ${data.c}]`);
  });
  
  subscriptions.push(ctxSub, bookSub, candleSub);
}

// Cleanup all subscriptions
await Promise.all(subscriptions.map(sub => sub.unsubscribe()));
```

### Order Book Analysis  
```typescript
const book = await infoClient.l2Book({ coin: "BTC", nSigFigs: 3 });
const spread = parseFloat(book.levels[0][0]) - parseFloat(book.levels[1][0]);
console.log(`BTC spread: $${spread}`);
```

### Portfolio Tracking
```typescript
const state = await infoClient.clearinghouseState({ user: address });
const pnl = parseFloat(state.marginSummary.accountValue) - 
            parseFloat(state.marginSummary.totalNtlPos);
console.log(`Unrealized PnL: $${pnl}`);
```

## Integration Notes

This SDK is currently used in the project at version `0.24.1` and is well-integrated with the existing trading interface. The WebSocket functionality is particularly useful for real-time price feeds and order updates that drive the trading UI components.

### Current Project Usage Patterns
The project implements comprehensive WebSocket integration through `HyperLiquidWebsocketProvider` (`src/components/hyperliquid-websocket-provider.tsx`):

1. **webData2 Stream**: Core subscription for user account data, positions, and market metadata
2. **Asset-Specific Subscriptions**: Dynamic subscriptions based on active trading pairs:
   - `activeAssetCtx`: Real-time asset pricing and funding rates
   - `l2Book`: Order book depth for spread calculations  
   - `candle`: Price history for charting
   - `activeAssetData`: User leverage and trading limits per asset

3. **User Event Streams**:
   - `userFills`: Trade execution updates
   - `userFundings`: Funding payment notifications
   - `userNonFundingLedgerUpdates`: Deposit/withdrawal tracking
   - `userEvents`: Liquidation alerts and other account events
   - `notification`: System notifications

### Custom Type Extensions
The project extends SDK types in `src/lib/hyperliquid/websocket/types.ts` with additional interfaces for frontend-specific data structures and enhanced type safety.

The SDK's TypeScript-first approach aligns well with the project's type safety requirements, and its support for multiple wallet providers makes it flexible for different authentication methods.