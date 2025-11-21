# Design Document: App Setup, Cross-Cutting Concerns, Strategies List, and Sidebar

## Overview

This document describes the technical design for the foundational application setup, cross-cutting concerns, strategies list page, and navigation sidebar. This foundation enables incremental development of subsequent features.

The application is built as a React 18+ TypeScript SPA using Vite, with support for both mock data mode (for UI development) and production mode (with Azure AD authentication and backend API integration).

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Application                      │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Routing    │  │   Context    │  │  Components   │  │
│  │   Layer      │  │   Layer      │  │   Layer       │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌────────────────────────────────────────────────────┐  │
│  │            Service Layer (API/Mock)                 │  │
│  └────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
         │                    │
         ▼                    ▼
┌─────────────────┐  ┌─────────────────┐
│   Mock Data      │  │  Market View    │
│   Services       │  │  API (FastAPI)  │
└─────────────────┘  └─────────────────┘
```

### Technology Stack

- **Frontend Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v7
- **Styling**: Tailwind CSS with shadcn/ui components
- **Authentication**: Azure AD MSAL (when enabled)
- **State Management**: React Context API
- **HTTP Client**: Fetch API with custom wrapper
- **Error Handling**: Error boundaries and centralized error handling

### Application Structure

```
src/
├── main.tsx                 # Application entry point
├── App.tsx                  # Root component with routing
├── components/
│   ├── Layout.tsx          # Main layout wrapper
│   ├── NavigationSidebar.tsx  # Sidebar component
│   ├── ErrorBoundary.tsx   # Error boundary component
│   ├── ThemeProvider.tsx   # Theme context provider
│   └── ui/                 # shadcn/ui components
├── pages/
│   └── PortfoliosListPage.tsx  # Strategies list page
├── contexts/
│   ├── AuthContext.tsx     # Authentication context
│   ├── NavigationContext.tsx  # Navigation and pinned items
│   └── EventsContext.tsx  # Custom events context
├── lib/
│   ├── api.ts             # API service layer
│   ├── dummyData.ts       # Mock data generators
│   ├── cache.ts           # API response caching
│   └── errorUtils.ts      # Error handling utilities
├── config/
│   └── authConfig.ts      # Authentication configuration
└── providers/
    └── MsalProviderWrapper.tsx  # MSAL provider wrapper
```

## Components and Interfaces

### Layout Component

**Purpose**: Provides the main application layout with sidebar and content area.

**Props**:
```typescript
interface LayoutProps {
  children: ReactNode;
}
```

**Behavior**:
- Manages sidebar open/closed state
- Persists sidebar state in localStorage
- Adjusts main content margin based on sidebar state
- Renders NavigationSidebar and children

### NavigationSidebar Component

**Purpose**: Provides persistent navigation sidebar with pinned items, search, and user profile.

**Props**:
```typescript
interface NavigationSidebarProps {
  open: boolean;
  onToggle: () => void;
}
```

**Features**:
- Collapsible sidebar (expanded: 337px, collapsed: 81px)
- Navigation links (Home, Watchlist, Subscriptions)
- Pinned strategies section
- Pinned companies section
- Search functionality for strategies
- User profile dropdown with theme toggle
- Active route highlighting

**State Management**:
- Uses NavigationContext for pinned items and portfolios
- Uses ThemeContext for theme management
- Uses MSAL for user information (when auth enabled)

### PortfoliosListPage Component

**Purpose**: Displays a list of all investment strategies with filtering and sorting.

**State**:
- `portfolios`: Array of Portfolio objects
- `loading`: Boolean loading state
- `error`: String error message
- `filter`: String filter text
- `sortKey`: Key to sort by (default: 'strategy_name')
- `sortDir`: Sort direction ('asc' | 'desc')

**Features**:
- Displays strategies in a table
- Filter by name, description, strategy code, or icon code
- Sort by strategy name (ascending/descending)
- Click row to navigate to strategy holdings
- Loading and error states

### ErrorBoundary Component

**Purpose**: Catches React errors and displays a fallback UI.

**Behavior**:
- Catches errors in child components
- Displays user-friendly error message
- Logs errors for debugging
- Provides option to retry or navigate away

## Data Models

### Portfolio

```typescript
interface Portfolio {
  strategy_code: string;
  strategy_name: string;
  description: string;
  icon_code: string;
  total_value: number;
  holdings_count: number;
}
```

### PinnedItem

```typescript
interface PinnedItem {
  type: 'strategy' | 'company';
  id: string;
  name: string;
  strategyCode?: string;
  icon_code: string;
  sedol?: string;  // For companies only
}
```

## Error Handling

### Error Types

1. **Network Errors**: Timeout, connection failures
2. **API Errors**: 4xx, 5xx status codes
3. **Authentication Errors**: Token expiration, unauthorized access
4. **React Errors**: Component rendering errors

### Error Handling Strategy

1. **API Layer**: All API calls wrapped in try-catch with typed errors
2. **Component Layer**: Error boundaries catch React errors
3. **User Feedback**: Toast notifications for user-facing errors
4. **Logging**: All errors logged with context to console

### Error Messages

- Network errors: "Network error. Please check your connection."
- Timeout errors: "Request timeout. Please try again."
- 403 errors: "You don't have permission to access this resource."
- 500 errors: "Server error. Please try again later."
- Generic errors: "An error occurred. Please try again."

## Testing Strategy

### Unit Tests

- Component rendering with different props
- State management logic
- Filtering and sorting logic
- Error handling logic

### Integration Tests

- Navigation flow between pages
- Sidebar toggle functionality
- Theme switching
- API service layer with mock data

### E2E Tests (Future)

- Complete user flows
- Authentication flow
- Error scenarios

## Mock Data Service Design

### Mock Data Structure

Mock data services should provide realistic data structures that match the API response format. Data should be:
- Realistic in structure and content
- Sufficiently varied to test UI edge cases
- Deterministic (same input produces same output)

### Mock Data Services

1. **Portfolio Service**: Returns array of Portfolio objects
2. **Holdings Service**: Returns array of Holding objects for a portfolio
3. **Company Details Service**: Returns CompanyDetails object
4. **Documents Service**: Returns array of EventDocument objects

### Switching Between Mock and Real API

Configuration via environment variables:
- `VITE_AUTH_ENABLED=false`: Use mock data
- `VITE_AUTH_ENABLED=true` + `VITE_MARKET_VIEW_API_HOST`: Use real API
- `VITE_USE_DUMMY_DATA_FALLBACK=true`: Fallback to mock on API failure

## Authentication Design

### Mock Authentication Mode

When `VITE_AUTH_ENABLED=false`:
- No MSAL initialization
- Mock user identity: "Guest User"
- No token required for API calls
- All API calls use mock data

### Production Authentication Mode

When `VITE_AUTH_ENABLED=true`:
- MSAL initialized with Azure AD config
- User redirected to Azure AD login if not authenticated
- Access tokens stored in localStorage
- Tokens included in API request headers
- Silent token refresh on expiration

### Authentication Flow

1. App checks `VITE_AUTH_ENABLED`
2. If enabled, initialize MSAL with config from env vars
3. Check for active account
4. If no account, redirect to Azure AD login
5. After login, store tokens
6. Include tokens in API requests
7. Refresh tokens silently before expiration

## API Service Layer Design

### API Client Structure

```typescript
// Centralized API client
const fetchWithTimeout = async (
  url: string,
  options: RequestInit,
  timeoutMs: number
): Promise<Response>

// Get access token (returns null if auth disabled)
const getAccessToken = async (): Promise<string | null>

// API functions
const fetchPortfolios = async (): Promise<Portfolio[]>
```

### API Configuration

- Base URL from `VITE_MARKET_VIEW_API_HOST`
- Timeout: 15 seconds default
- Headers: Authorization Bearer token (if auth enabled)
- Error handling: Typed errors with user-friendly messages

### Caching Strategy

- Cache API responses with expiration times
- Cache key based on endpoint and parameters
- Cache duration: Configurable per endpoint type
- Invalidate cache on mutations

## Routing Design

### Route Structure

```
/ → redirects to /strategies
/strategies → Strategies list page
/strategies/:strategyCode → Portfolio holdings page
/strategies/:strategyCode/universe → Universe page
/strategies/:strategyCode/stocks/:sedol → Company timeline page
/watchlist → Watchlist page
/watchlist/stocks/:sedol → Company timeline page
/subscriptions → Subscriptions page
```

### Navigation Context

Manages:
- Navigation history
- Pinned items (strategies and companies)
- Watchlist items
- Breadcrumb generation

## Theme System Design

### Theme Implementation

- Uses CSS variables for theme colors
- Light theme: Default
- Dark theme: Inverted colors
- Theme preference stored in localStorage
- Theme toggle in user profile dropdown

### Theme Variables

```css
--background
--foreground
--card
--card-foreground
--primary
--primary-foreground
--secondary
--muted
--muted-foreground
--border
```

## Responsive Design

### Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Mobile Behavior

- Sidebar hidden by default
- Menu button to toggle sidebar
- Sidebar overlays content when open
- Click outside to close sidebar

## Performance Considerations

1. **Code Splitting**: Route-based code splitting
2. **Lazy Loading**: Lazy load components for routes
3. **API Caching**: Cache API responses to reduce calls
4. **Debouncing**: Debounce search/filter inputs
5. **Memoization**: Memoize expensive computations

## Security Considerations

1. **Environment Variables**: Never expose sensitive data in client code
2. **Token Storage**: Tokens stored in localStorage (consider httpOnly cookies for production)
3. **XSS Protection**: Sanitize user inputs
4. **CORS**: Configure CORS properly on backend
5. **HTTPS**: Always use HTTPS in production

