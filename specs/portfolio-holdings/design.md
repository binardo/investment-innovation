# Design Document: Portfolio Holdings Screen

## Overview

This document describes the technical design for the Portfolio Holdings screen, which displays holdings (stocks) within a selected investment strategy. This feature builds upon the app setup and strategies list foundation, allowing users to drill down from a strategy to see its constituent holdings.

## Architecture

### Component Structure

```
PortfolioHoldingsPage
├── Header Section
│   ├── Back Button
│   ├── Strategy Name & Info Icon
│   ├── Strategy Metadata Display
│   └── Action Buttons (Universe, More Menu)
├── Holdings Table
│   ├── Filter Input
│   ├── Table Header (with sorting)
│   ├── Table Rows (with selection checkboxes)
│   └── Empty State
└── Overlays
    ├── SubscriptionsOverlay
    └── RedTeamPopup (optional)
```

### Data Flow

1. Page loads with `strategyCode` from route params
2. Converts `strategyCode` to `iconCode` using NavigationContext portfolios
3. Fetches holdings data using `iconCode`
4. Fetches portfolio metadata for strategy details
5. Displays holdings in table with filtering/sorting
6. Handles navigation to company detail pages

## Components and Interfaces

### PortfolioHoldingsPage Component

**Purpose**: Main page component displaying strategy holdings.

**Props**: None (uses route params)

**State**:
```typescript
interface PortfolioHoldingsPageState {
  holdings: Holding[];
  portfolio: Portfolio | null;
  meta: PortfolioMeta | null;
  loading: boolean;
  error: string | null;
  selectedHoldings: Set<string>; // SEDOLs
  isSubscriptionsOpen: boolean;
  isRedTeamOpen: boolean;
}
```

**Key Functions**:
- `loadData()`: Fetches holdings, portfolio, and metadata
- `handleHoldingClick()`: Navigates to company detail page
- `handleToggleSelect()`: Manages row selection
- `togglePinStrategy()`: Pins/unpins strategy

### StockTable Component

**Purpose**: Reusable table component for displaying stock/holding data.

**Props**:
```typescript
interface StockTableProps<T> {
  title: string;
  items: T[];
  columns: StockColumn<T>[];
  selectedItems: Set<string>;
  onToggleSelection: (id: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onRowClick: (item: T) => void;
  getItemId: (item: T) => string;
  filterPlaceholder?: string;
  initialSortField?: string;
  initialSortDirection?: 'asc' | 'desc';
}
```

**Features**:
- Column-based rendering with custom render functions
- Built-in filtering
- Built-in sorting
- Row selection with checkboxes
- Row click handling
- Empty state display

### Strategy Header Component

**Purpose**: Displays strategy metadata and actions.

**Layout**:
```
┌─────────────────────────────────────────────────────┐
│ [←] Strategy Name [ℹ️]                              │
│ Representative Portfolio: ICON_CODE                 │
│ Investment Style - Asset Class - Sub-Asset Class   │
│ Benchmark: Benchmark Name                           │
│ Portfolio Managers: Name1, Name2                    │
│ [Badge: Product Group] [Badge: IDM Group] [Badge: Client Contacts] │
│                                    [Universe] [⋮]   │
└─────────────────────────────────────────────────────┘
```

**Metadata Display**:
- Strategy name with info icon (tooltip shows performance objective)
- Representative portfolio icon code
- Investment characteristics (style, asset class, etc.)
- Benchmark name
- Portfolio managers (comma-separated list)
- Group badges with tooltips showing member lists

## Data Models

### Holding

```typescript
interface Holding {
  sedol: string;
  company_name: string;
  icon_code: string;
  weight: number; // Portfolio weight (0-1)
  bench_weight?: number; // Benchmark weight (0-1)
  active_weight?: number; // Active weight (0-1)
  sector?: string;
  country?: string;
  industry?: string;
  mcap?: number;
}
```

### PortfolioMeta

```typescript
interface PortfolioMeta {
  strategy_name?: string;
  strategy_description?: string;
  strategy_performance_objective?: string;
  primary_benchmark_name?: string;
  representative_fund?: string;
  fund_managers?: string[];
  client_contacts?: string[];
  asset_class?: string;
  sub_asset_class?: string;
  investment_style?: string;
  investment_time_horizon?: string;
  product_group_members?: string[];
  investment_decision_making_group_members?: string[];
  portfolio_management_group_members?: string[];
}
```

## UI/UX Design

### Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Sidebar │                                                    │
│         │  [←] Strategy Name [ℹ️]        [Universe] [⋮]   │
│         │  Representative Portfolio: ICON_CODE             │
│         │  Investment Style - Asset Class                   │
│         │  Benchmark: Benchmark Name                        │
│         │  Portfolio Managers: ...                          │
│         │  [Badges...]                                      │
│         │                                                    │
│         │  Holdings                                         │
│         │  Filter: [____________]  X selected              │
│         │  ┌─────────────────────────────────────────────┐ │
│         │  │ ☑ Company │ SEDOL │ Sector │ Weight │ ... │ │
│         │  │ ☐ Company1│ SEDOL1│ Tech   │ 5.23%  │ ... │ │
│         │  │ ☐ Company2│ SEDOL2│ Finance│ 3.45%  │ ... │ │
│         │  └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Table Columns

1. **Checkbox Column**: Selection checkbox
2. **Company**: Company name (bold, left-aligned)
3. **SEDOL**: Stock identifier (left-aligned)
4. **Sector**: Sector classification (left-aligned)
5. **Country**: Country name (left-aligned)
6. **Weight**: Portfolio weight percentage (right-aligned, formatted to 2 decimals)
7. **Benchmark Wt**: Benchmark weight percentage (right-aligned, formatted to 2 decimals)
8. **Active Wt**: Active weight percentage (right-aligned, formatted to 2 decimals, default sort column)

### Sorting Behavior

- Click column header to sort
- First click: ascending
- Second click: descending
- Click different column: sort by that column ascending
- Default: Active Wt descending
- Sort indicator shows current sort column and direction

### Filtering Behavior

- Filter input above table
- Filters by: company name, SEDOL, sector, country
- Updates table immediately as user types
- Shows count of filtered results
- "No holdings match your filter" when no matches

### Selection Behavior

- Checkbox in first column for each row
- Header checkbox selects/deselects all visible rows
- Selected count displayed above table
- Selected holdings persist during filtering
- Selection cleared when navigating away

## API Integration

### Fetch Holdings

```typescript
const fetchHoldings = async (iconCode: string): Promise<Holding[]>
```

**Endpoint**: `GET /api/portfolios/{iconCode}/holdings`

**Mock Data**: Returns array of Holding objects with realistic data

**Error Handling**: Displays error message with back button

### Fetch Portfolio Meta

```typescript
const fetchPortfolioMeta = async (iconCode: string): Promise<PortfolioMeta>
```

**Endpoint**: `GET /api/portfolios/{iconCode}/meta`

**Mock Data**: Returns PortfolioMeta object with strategy details

**Error Handling**: Gracefully handles missing fields, doesn't block holdings display

## Strategy Code to Icon Code Conversion

**Purpose**: Convert strategy_code from route to icon_code for API calls.

**Implementation**:
- Uses `getIconCodeFromStrategyCode()` utility
- Waits for portfolios to load before conversion
- Displays error if conversion fails
- Prevents API calls with invalid icon_code

## Navigation

### To Company Detail

- Click holding row → `/strategies/:strategyCode/stocks/:sedol`
- Preserves strategy context in URL

### To Universe

- Click "Universe" button → `/strategies/:strategyCode/universe`

### Back to Strategies

- Click back button → `/strategies`
- Preserves navigation history

## Error Handling

### Loading States

- Loading spinner with "Loading holdings..." message
- Centered on page

### Error States

- Error message with error details
- Back button to return to strategies list
- Error doesn't block other functionality

### Empty States

- "No holdings found" when no holdings exist
- "No holdings match your filter" when filter has no matches

## Performance Considerations

1. **Memoization**: Use `useMemo` for filtered/sorted holdings
2. **Virtualization**: Consider virtual scrolling for large holdings lists (100+ items)
3. **Debouncing**: Debounce filter input (optional, 300ms)
4. **Lazy Loading**: Load metadata in parallel with holdings

## Accessibility

1. **Keyboard Navigation**: Tab through table rows, Enter to select
2. **Screen Readers**: Proper ARIA labels for table, buttons, and form controls
3. **Focus Management**: Focus moves logically through page elements
4. **Color Contrast**: Ensure sufficient contrast for text and icons

