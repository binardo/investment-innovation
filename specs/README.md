# Investment Timeline Application Specifications

This directory contains comprehensive specifications for rebuilding the Investment Timeline application. The specifications are organized into incremental feature sets that build upon each other, allowing a developer to build the application step-by-step without seeing the original implementation.

## Specification Structure

Each feature has its own directory containing:
- `requirements.md` - User stories, requirements, and acceptance criteria in EARS format
- `design.md` - Technical design, architecture, and implementation details (to be created)
- `tasks.md` - Implementation plan with actionable coding tasks (to be created)

## Build Order

The specifications are designed to be implemented in this order:

### 1. App Setup and Strategies List (`app-setup-and-strategies-list/`)
**Foundation**: This is the first specification that must be implemented. It covers:
- Application setup (React + TypeScript + Vite)
- Cross-cutting concerns (authentication, routing, theming, error handling)
- Mock data service architecture
- Strategies list page
- Navigation sidebar

**Dependencies**: None - this is the foundation

**Key Features**:
- Mock/real API switching via environment variables
- Azure AD authentication (optional, can be mocked)
- Theme system (light/dark)
- Error boundaries and logging
- Navigation sidebar with pinned items
- Strategies list with filtering and sorting

### 2. Portfolio Holdings (`portfolio-holdings/`)
**Builds on**: App Setup and Strategies List

**Key Features**:
- Holdings table for a selected strategy
- Strategy metadata display
- Holdings filtering and sorting
- Multi-select for bulk actions
- Navigation to company detail pages

### 3. Company Timeline and Documents (`company-timeline-docs/`)
**Builds on**: Portfolio Holdings, App Setup

**Key Features**:
- Timeline view with price/metrics chart
- Document display and filtering
- Event type filtering
- Document overlay for viewing content
- Custom events management
- Company pinning and watchlist management

### 4. FLH Form Overlay (`flh-form-overlay/`)
**Builds on**: Company Timeline and Documents

**Key Features**:
- FLH creation and editing
- Tracking indicators management
- Status tracking (Green/Yellow/Orange/Red)
- Version history display
- Overall status calculation

### 5. Watchlist and Universe (`watchlist-universe/`)
**Builds on**: Portfolio Holdings, App Setup

**Key Features**:
- Personal watchlist management
- Universe browsing for strategies
- Multi-select and bulk actions
- Filtering by country, sector, industry
- Add to watchlist functionality

### 6. Subscriptions (`subscriptions/`)
**Builds on**: App Setup

**Key Features**:
- Email subscription management
- Subscription type selection
- Scope configuration (strategy or watchlist)
- CRUD operations for subscriptions

## Key Design Principles

### Mock Data First
All specifications emphasize building with mock data services first, allowing UI development to proceed independently of backend availability. Mock data can be easily swapped for real API calls via environment variable configuration.

### Incremental Development
Each specification builds on previous ones, ensuring that foundational features are in place before dependent features are implemented.

### Environment-Based Configuration
The application supports multiple modes:
- **Development Mode**: `VITE_AUTH_ENABLED=false` - Uses mock data, no authentication
- **Production Mode**: `VITE_AUTH_ENABLED=true` + API host - Uses Azure AD and real API

### API Integration
The Market View API OpenAPI specification will be provided separately. The application integrates with this API when:
- `VITE_AUTH_ENABLED=true`
- `VITE_MARKET_VIEW_API_HOST` is configured
- Azure AD credentials are provided

## Common Patterns

### Data Loading
- All data loading should show loading states
- Errors should be handled gracefully with user-friendly messages
- Optimistic updates should be used for better UX

### Navigation
- Use React Router for client-side routing
- Preserve strategy context in URLs
- Support browser back/forward navigation

### State Management
- Use React Context for global state
- Local state for component-specific data
- Persist user preferences in localStorage

### Error Handling
- Error boundaries for React errors
- Typed errors for API failures
- Toast notifications for user feedback
- Logging for debugging

## Implementation Notes

### Technology Stack
- **Frontend**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v7
- **Styling**: Tailwind CSS + shadcn/ui
- **Authentication**: Azure AD MSAL (when enabled)
- **State**: React Context API

### File Structure
```
src/
├── main.tsx              # Entry point
├── App.tsx               # Routing
├── components/           # Reusable components
├── pages/                # Page components
├── contexts/             # React contexts
├── lib/                   # Services and utilities
├── config/                # Configuration
└── types/                 # TypeScript types
```

### API Service Pattern
All API calls should:
1. Check if auth is enabled
2. Get access token if needed
3. Make request with timeout
4. Handle errors appropriately

### Component Patterns
- Use functional components with hooks
- Type all props and state
- Extract reusable logic to custom hooks
- Use composition over inheritance

## Next Steps

1. Start with `app-setup-and-strategies-list/requirements.md`
2. Review requirements and get approval
3. Create design document
4. Create tasks document
5. Implement tasks incrementally
6. Move to next specification

Each specification follows the same workflow:
1. Requirements gathering and approval
2. Design document creation and approval
3. Tasks document creation and approval
4. Implementation (one task at a time)

## Additional Resources

- Market View API OpenAPI specification (provided separately)
- Azure AD authentication documentation
- React Router documentation
- Tailwind CSS documentation
- shadcn/ui component library

