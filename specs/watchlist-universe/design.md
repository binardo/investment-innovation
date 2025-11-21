# Design Document: Watchlist and Universe Pages

## Overview

This document describes the technical design for the Watchlist and Universe pages. The watchlist allows users to manage their personal list of companies to track, while the universe page displays all companies available to a strategy with filtering capabilities.

## Architecture

### Watchlist Page Structure

```
WatchlistPage
├── Header
│   └── Title ("Watchlist")
├── Empty State (if no items)
│   └── Message and "Add from Universe" link
└── StockTable
    ├── Filter Input
    ├── Table with Watchlist Items
    └── Row Menu (Pin, Remove from Watchlist)
```

### Universe Page Structure

```
UniversePage
├── Header
│   └── Title ("Investment Universe")
├── StockTable
│   ├── Filter Inputs (Country, Sector, Industry)
│   ├── Table with Universe Stocks
│   ├── Table Menu (Pin Selected, Add to Watchlist)
│   └── Row Menu (Pin, Add to Watchlist)
└── Loading State
```

### Data Flow

**Watchlist**:
1. Page loads
2. Fetches watchlist from API (once per session, cached)
3. Displays watchlist items in table
4. Handles remove from watchlist actions

**Universe**:
1. Page loads with `strategyCode` from route
2. Fetches universe data for strategy
3. Displays companies in table with filters
4. Handles add to watchlist and pin actions

## Components and Interfaces

### WatchlistPage Component

**Purpose**: Display user's personal watchlist.

**Props**: None

**State**:
```typescript
interface WatchlistPageState {
  watchlistItems: WatchlistItem[];
  selectedStocks: Set<string>; // SEDOLs
  loading: boolean;
}
```

### UniversePage Component

**Purpose**: Display strategy universe with filtering.

**Props**: None (uses route params)

**State**:
```typescript
interface UniversePageState {
  universeStocks: UniverseStock[];
  selectedStocks: Set<string>; // SEDOLs
  countryFilter: Set<string>;
  sectorFilter: Set<string>;
  industryFilter: Set<string>;
  loading: boolean;
}
```

### WatchlistItem Interface

```typescript
interface WatchlistItem {
  sedol: string;
  company_name: string;
  icon_code: string;
  country?: string;
  sector?: string;
  industry?: string;
  mcap?: number;
}
```

### UniverseStock Interface

```typescript
interface UniverseStock {
  sedol: string;
  company_name: string;
  sector?: string;
  industry?: string;
  region?: string;
  country?: string;
}
```

## UI/UX Design

### Watchlist Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Sidebar │                                                    │
│         │  Watchlist                                         │
│         │                                                    │
│         │  Filter: [____________]                            │
│         │  ┌─────────────────────────────────────────────┐ │
│         │  │ ☑ Name │ SEDOL │ Country │ Sector │ MCap  │ │
│         │  │ ☐ Co1  │ SED1  │ US      │ Tech   │ $1.5B │ │
│         │  │ ☐ Co2  │ SED2  │ UK      │ Finance│ $500M │ │
│         │  └─────────────────────────────────────────────┘ │
│         │                                                    │
│         │  [Empty State if no items]                        │
└─────────────────────────────────────────────────────────────┘
```

### Universe Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Sidebar │                                                    │
│         │  Investment Universe                                │
│         │                                                    │
│         │  Filter: [____________]                            │
│         │  ┌─────────────────────────────────────────────┐ │
│         │  │ ☑ Name │ SEDOL │ Country │ Sector │ Ind. │ │ │
│         │  │ ☐ Co1  │ SED1  │ [US ▼]  │ [Tech ▼]│ [SW▼]│ │ │
│         │  │ ☐ Co2  │ SED2  │ [UK ▼]  │ [Fin▼] │ [Bank]│ │ │
│         │  └─────────────────────────────────────────────┘ │
│         │  [Pin] [Add to Watchlist]                         │
└─────────────────────────────────────────────────────────────┘
```

### Watchlist Table Columns

1. **Checkbox**: Selection checkbox
2. **Name**: Company name (bold, left-aligned)
3. **SEDOL**: Stock identifier (left-aligned)
4. **Country**: Country name (left-aligned)
5. **Sector**: Sector classification (left-aligned)
6. **Industry**: Industry classification (left-aligned)
7. **MCap**: Market capitalization (right-aligned, formatted: $1.5B, $500M)

### Universe Table Columns

1. **Checkbox**: Selection checkbox
2. **Name**: Company name (bold, left-aligned)
3. **SEDOL**: Stock identifier (left-aligned)
4. **Country**: Country name with filter dropdown (left-aligned)
5. **Sector**: Sector classification with filter dropdown (left-aligned)
6. **Industry**: Industry classification with filter dropdown (left-aligned)

### Filter Design

**Watchlist Filtering**:
- Single text input
- Filters by: company name, SEDOL, country, sector, industry
- Updates table immediately

**Universe Filtering**:
- Text input for general search
- Multi-select dropdowns for Country, Sector, Industry columns
- Filters combine with AND logic (must match all selected filters)
- Selected filters shown as badges/chips
- Clear filter option

### Multi-Select Filter Component

**Purpose**: Dropdown filter for table columns.

**Props**:
```typescript
interface MultiSelectFilterProps {
  options: string[];
  selectedValues: Set<string>;
  onFilterChange: (selected: Set<string>) => void;
}
```

**Features**:
- Dropdown button showing selected count
- Checkbox list of all unique values
- Select/deselect all option
- Search within options (if many)
- Selected values highlighted

### Selection Behavior

**Watchlist**:
- Select individual rows or all rows
- Selected count displayed
- Selection persists during filtering
- Row menu actions available

**Universe**:
- Select individual rows or all filtered rows
- Selected count displayed
- Selection persists when filters change (if item still visible)
- Bulk actions available: Pin, Add to Watchlist

## API Integration

### Fetch Watchlist

```typescript
const fetchWatchlist = async (): Promise<WatchlistItem[]>
```

**Endpoint**: `GET /api/watchlist`

**Caching**: Load once per session, cached in NavigationContext

**Mock Data**: Returns array of WatchlistItem objects

### Add to Watchlist

```typescript
const addToWatchlist = async (item: WatchlistItem): Promise<void>
```

**Endpoint**: `POST /api/watchlist`

**Request Body**: WatchlistItem

**Optimistic Update**: Add to local state immediately, rollback on error

### Remove from Watchlist

```typescript
const removeFromWatchlist = async (sedol: string): Promise<void>
```

**Endpoint**: `DELETE /api/watchlist/{sedol}`

**Optimistic Update**: Remove from local state immediately, rollback on error

### Fetch Universe

```typescript
const fetchPortfolioUniverse = async (strategyCode: string, identifierType: 'strategy_code' | 'icon_code'): Promise<UniverseStock[]>
```

**Endpoint**: `GET /api/portfolios/{identifier}/universe`

**Parameters**: Uses strategy_code or icon_code based on identifierType

**Mock Data**: Returns array of UniverseStock objects

## Navigation

### From Watchlist

- Click row → `/strategies/WATCHLIST/stocks/:sedol`
- Uses special "WATCHLIST" strategy code
- Navigates to company timeline page

### From Universe

- Click row → `/strategies/:strategyCode/stocks/:sedol`
- Preserves strategy context
- Navigates to company timeline page

## Actions

### Watchlist Actions

**Row Menu**:
- Pin: Add company to pinned items
- Remove from Watchlist: Remove company from watchlist

**Bulk Actions**: None (watchlist is personal, bulk actions less common)

### Universe Actions

**Row Menu**:
- Pin: Add company to pinned items
- Add to Watchlist: Add company to watchlist (disabled if already in watchlist)

**Table Menu** (when items selected):
- Pin: Pin all selected companies
- Add to Watchlist: Add all selected companies to watchlist

## Filter Logic

### Watchlist Filtering

- Single text input
- Searches across: name, SEDOL, country, sector, industry
- Case-insensitive matching
- Updates immediately as user types

### Universe Filtering

**Filter Combination**:
- Text filter: Searches name, SEDOL
- Country filter: Multi-select, AND logic
- Sector filter: Multi-select, AND logic
- Industry filter: Multi-select, AND logic
- All filters combine with AND logic (must match all)

**Example**:
- Country: US, UK selected
- Sector: Technology selected
- Result: Companies in (US OR UK) AND Technology sector

### Selected Items During Filtering

- Selected items remain selected if they match new filters
- Selected items remain in selection if filtered out (but not visible)
- "Select All" only selects visible (filtered) items
- Selection count shows visible selected items

## Empty States

### Watchlist Empty State

**Message**: "Your watchlist is empty. Add stocks from the universe page."

**Design**:
- Centered message
- Visually distinct from table
- Provides clear next steps

### Universe Empty State

**Message**: "No companies match your filters"

**Design**:
- Shown when filters result in no matches
- Suggests clearing filters
- Maintains filter state for user to adjust

## Performance Considerations

1. **Watchlist Caching**: Cache watchlist data in NavigationContext
2. **Universe Data**: Consider pagination if universe is very large (1000+ companies)
3. **Filter Performance**: Memoize filtered results
4. **Virtualization**: Consider virtual scrolling for large tables
5. **Debouncing**: Debounce text filter input (300ms)

## Accessibility

1. **Keyboard Navigation**: Tab through filters and table rows
2. **Screen Readers**: ARIA labels for filters, table, actions
3. **Focus Management**: Focus moves logically through page
4. **Filter Announcements**: Screen reader announcements when filters change
5. **Table Navigation**: Arrow keys to navigate table rows

