# Design Document: Company Timeline and Documents Screen

## Overview

This document describes the technical design for the Company Timeline and Documents screen, which displays a comprehensive timeline view of a company's investment-related events, documents, and metrics. Users can view stock price history, company documents, trades, Forward Looking Hypotheses (FLH), and AI-generated content on a unified timeline interface.

**Visual Reference**: A screenshot of the company timeline/docs page is available for reference to understand the exact layout and visual design.

## Architecture

### Component Structure

```
PortfolioPage (Company Timeline)
├── Header Section
│   ├── Back Button
│   ├── Company Name & Details
│   ├── Pin Button
│   └── Actions Menu (Add to Watchlist, etc.)
├── Chart Section
│   ├── Metric Selector
│   ├── Date Range Picker
│   ├── Price/Metrics Chart (Recharts)
│   │   ├── Chart Line
│   │   ├── Event Markers (under chart)
│   │   └── Vertical Lines (from markers to chart)
│   └── Event Type Filters
├── Document Table Section
│   ├── Selection Controls
│   ├── Document Table
│   └── Empty State
└── Overlays
    ├── DocumentOverlay
    ├── FLHFormOverlay
    ├── EventFormOverlay
    └── FrontsheetOverlay
```

### Data Flow

1. Page loads with `strategyCode` and `sedol` from route params
2. Fetches company details, documents, price history, metric types, and trades in parallel
3. Loads custom events from EventsContext
4. Renders chart with price/metric data
5. Positions event markers under chart aligned with dates
6. Filters documents and events based on date range and event type filters
7. Displays document table below chart

## Components and Interfaces

### PortfolioPage Component

**Purpose**: Main page component displaying company timeline.

**Props**: None (uses route params)

**State**:
```typescript
interface PortfolioPageState {
  // Data
  metricData: MetricDataPoint[];
  allDocuments: EventDocument[];
  companyDetails: CompanyDetails | null;
  metricTypes: MetricTypeDefinition[];
  
  // Loading states
  loadingPrice: boolean;
  loadingDocuments: boolean;
  loadingCompanyDetails: boolean;
  loadingMetricTypes: boolean;
  
  // Error states
  priceError: string | null;
  documentsError: string | null;
  companyDetailsError: string | null;
  
  // UI state
  selectedMetric: MetricType;
  dateRange: DateRange;
  enabledEventTypes: Set<EventType>;
  selectedDocuments: Set<string>;
  
  // Overlay states
  flhFormOpen: boolean;
  frontsheetOpen: boolean;
  eventFormOpen: boolean;
  documentOverlayOpen: boolean;
  selectedDocumentId: string | null;
}
```

### Chart Component

**Purpose**: Displays price/metric data as a line chart with event markers.

**Props**:
```typescript
interface ChartProps {
  data: MetricDataPoint[];
  metricType: MetricType;
  dateRange: DateRange;
  events: EventDocument[];
  enabledEventTypes: Set<EventType>;
  onEventClick: (event: EventDocument) => void;
}
```

**Features**:
- Line chart using Recharts library
- Zoom and pan functionality
- Event markers positioned under chart
- Vertical lines connecting markers to chart line
- Responsive to container size
- Data point reduction for performance

### DocumentTable Component

**Purpose**: Displays documents in a table format.

**Props**:
```typescript
interface DocumentTableProps {
  documents: EventDocument[];
  selectedDocuments: Set<string>;
  onToggleSelection: (id: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onRowClick: (document: EventDocument) => void;
  dateRange: DateRange;
  enabledEventTypes: Set<EventType>;
}
```

**Features**:
- Columns: Date, Type, Title, Author
- Sorting by date (newest first)
- Row selection with checkboxes
- Click row to open document overlay
- Filters by date range and event type

### DocumentOverlay Component

**Purpose**: Modal overlay for viewing document content.

**Props**:
```typescript
interface DocumentOverlayProps {
  document: EventDocument | null;
  isOpen: boolean;
  onClose: () => void;
}
```

**Features**:
- Full-screen or large modal overlay
- Document title, date, type, author
- Document content display
- Variant selector if document has variants
- Close button and ESC key support

## Data Models

### MetricDataPoint

```typescript
interface MetricDataPoint {
  date: Date;
  price?: number;
  mcap?: number;
  pe?: number;
  revenue?: number;
  [key: string]: number | Date | undefined; // Dynamic metric properties
}
```

### EventDocument

```typescript
interface EventDocument {
  id: string;
  date: Date;
  type: EventType;
  title: string;
  description: string;
  author: string;
  content: string;
  subtype?: string;
  variant?: string;
  isBuy?: boolean;
  color?: string;
  url?: string;
  filename?: string;
  variants?: {
    name: string;
    content: string;
    id?: string;
  }[];
}
```

### DateRange

```typescript
interface DateRange {
  from: Date;
  to: Date;
}
```

## UI/UX Design

### Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Sidebar │                                                    │
│         │  [←] Company Name              [Pin] [⋮]          │
│         │  Legal Name | Short Name | Country                │
│         │  Company Description...                            │
│         │                                                    │
│         │  [Price ▼] [Date Range Picker]                    │
│         │  ┌─────────────────────────────────────────────┐ │
│         │  │         Price Chart                          │ │
│         │  │    ╱╲                                        │ │
│         │  │   ╱  ╲                                       │ │
│         │  │  ╱    ╲                                      │ │
│         │  │ ╱      ╲                                     │ │
│         │  │─────────│─────────│─────────│─────────│─────│ │
│         │  │ 📄 📊 📞 📄 📊 📞 📄 📊 📞 📄 📊 📞 │ │
│         │  │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │
│         │  └─────────────────────────────────────────────┘ │
│         │  [✓] Trades [✓] Calls [✓] Reports [✓] Filings   │
│         │                                                    │
│         │  Documents                                        │
│         │  ☑ X selected                                    │
│         │  ┌─────────────────────────────────────────────┐ │
│         │  │ ☑ Date │ Type │ Title │ Author             │ │
│         │  │ ☐ 2024 │ Trade│ Buy   │ System              │ │
│         │  │ ☐ 2024 │ Report│ Q1   │ Analyst            │ │
│         │  └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Chart Design

**Chart Area**:
- X-axis: Date range (updates with zoom/pan)
- Y-axis: Metric value (Price, Market Cap, P/E, Revenue)
- Line: Smooth line connecting data points
- Grid: Light grid lines for readability

**Event Markers**:
- Positioned below chart line
- Aligned with event date on x-axis
- Icon and color based on event type
- Vertical line connecting marker to chart line
- Resolves to nearest chart date if exact date not available
- Stacked/offset when multiple events on same date

**Zoom and Pan**:
- Mouse wheel: Zoom in/out
- Pinch gesture: Zoom (mobile)
- Drag: Pan horizontally
- Date range picker updates with zoom/pan
- Data points reduce when zoomed out for performance

### Event Type Filters

**Layout**: Horizontal row of toggle buttons/checkboxes

**Event Types**:
- Trades (orange)
- Earnings Calls (pink)
- Broker Reports (cyan)
- Company Filings (yellow)
- Internal Research (blue)
- AI Content (purple)
- Macro Events (orange)

**Behavior**:
- Toggle on/off to show/hide event type
- Visual indicator when enabled/disabled
- Updates timeline immediately

### Date Range Picker

**Default**: Last year of data

**Features**:
- Start date and end date inputs
- Calendar picker for date selection
- Validation: start date before end date
- Updates chart and filters documents/events

## Chart Data Optimization

### Data Point Reduction Strategy

**When Zoomed Out**:
- Sample data points (e.g., show every Nth point)
- Aggregate data (e.g., daily → weekly → monthly)
- Maintain visual accuracy of trends
- Target: < 500 data points for smooth rendering

**When Zoomed In**:
- Load more granular data
- Show all available data points for visible range
- Fetch additional data if needed

**Performance Targets**:
- Maintain 60fps during interactions
- Render chart within 100ms
- Smooth zoom/pan animations

## Event Marker Positioning

### Positioning Algorithm

1. Get event date
2. Find nearest chart date (x-axis position)
3. If exact match: position at exact date
4. If no exact match: find nearest date within visible range
5. If date filtered out: resolve to nearest visible date
6. Position marker below chart line
7. Draw vertical line to chart line

### Multiple Events on Same Date

- Stack markers vertically
- Offset markers horizontally slightly
- Show count badge if many events
- Group similar event types

## Visual Lines from Events to Chart

**Purpose**: Visual connection between events and price/metric values.

**Design**:
- Vertical line from marker to chart line
- Dashed or solid line style
- Color matches event type or neutral gray
- Line extends from marker center to chart line
- Updates position when chart zoomed/panned

## Key Indicator Toggle

**Purpose**: Show/hide key indicators in FLH display.

**Location**: Near FLH section or in filter area

**Behavior**:
- Toggle button/checkbox
- When enabled: Shows indicators with `include_in_overall_status: true`
- When disabled: Hides key indicators
- Updates display immediately

## Indicator Status Timeline

**Purpose**: Visual timeline showing indicator status changes over time.

**Design**:
- Horizontal timeline for each indicator
- Color-coded dots: Green, Yellow, Orange, Red
- Dots positioned chronologically
- Line connecting dots showing flow
- Tooltip on hover: date, status, commentary

**Layout**:
```
Indicator Name: [Status Timeline]
─────────────────────────────────────────────
●──────●──────●──────●──────●
Green  Yellow Orange Red   Green
2024-01 2024-03 2024-05 2024-07 2024-09
```

## API Integration

### Fetch Company Details

```typescript
const fetchCompanyDetails = async (sedol: string): Promise<CompanyDetails>
```

**Endpoint**: `GET /api/companies/{sedol}`

### Fetch Documents

```typescript
const fetchDocuments = async (sedol: string, strategyCode: string): Promise<EventDocument[]>
```

**Endpoint**: `GET /api/companies/{sedol}/documents?strategy_code={strategyCode}`

### Fetch Price History

```typescript
const fetchPriceHistory = async (sedol: string, dateRange: DateRange): Promise<MetricDataPoint[]>
```

**Endpoint**: `GET /api/companies/{sedol}/price-history?from={from}&to={to}`

### Fetch Metric Data

```typescript
const fetchMetricData = async (sedol: string, metricType: MetricType, dateRange: DateRange): Promise<MetricDataPoint[]>
```

**Endpoint**: `GET /api/companies/{sedol}/metrics/{metricType}?from={from}&to={to}`

### Fetch Metric Types

```typescript
const fetchMetricTypes = async (): Promise<MetricTypeDefinition[]>
```

**Endpoint**: `GET /api/metric-types`

### Fetch Trades as Events

```typescript
const fetchTradesAsEvents = async (sedol: string, strategyCode: string): Promise<EventDocument[]>
```

**Endpoint**: `GET /api/companies/{sedol}/trades?strategy_code={strategyCode}`

## Custom Events Management

**Data Source**: EventsContext (local state)

**Operations**:
- Create: Add new custom event
- Update: Modify existing custom event
- Delete: Remove custom event

**Storage**: Persisted in localStorage or backend API

## Error Handling

### Loading States

- Separate loading states for each data section
- Loading spinners in respective sections
- Chart shows skeleton/placeholder while loading

### Error States

- Error messages for each failed data fetch
- Retry buttons for failed requests
- Errors don't block other data from displaying
- Graceful degradation

## Performance Considerations

1. **Chart Rendering**: Use Recharts with optimized settings
2. **Data Sampling**: Reduce data points for large date ranges
3. **Memoization**: Memoize filtered/sorted documents
4. **Virtualization**: Consider virtual scrolling for document table if > 100 items
5. **Debouncing**: Debounce date range changes (300ms)
6. **Lazy Loading**: Load document content on demand

## Accessibility

1. **Keyboard Navigation**: Tab through chart controls, filters, table
2. **Screen Readers**: ARIA labels for chart, events, documents
3. **Focus Management**: Focus moves logically through page
4. **Color Contrast**: Ensure sufficient contrast for all colors
5. **Chart Accessibility**: Provide data table alternative for chart

