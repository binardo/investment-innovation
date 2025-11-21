# Requirements Document: App Setup, Cross-Cutting Concerns, Strategies List, and Sidebar

## Introduction

This document specifies the foundational setup and initial user-facing features of the Investment Timeline application. This includes the application architecture, cross-cutting concerns (authentication, routing, theming, error handling), the strategies list page, and the navigation sidebar. This foundation enables incremental development of subsequent features.

The application is a React-based single-page application that allows investment professionals to view investment portfolios (strategies), track holdings, view company timelines, and manage forward-looking hypotheses. The app must support both development mode with mock data and production mode with Azure AD authentication and backend API integration.

## Requirements

### Requirement 1: Application Setup and Build Configuration

**User Story:** As a developer, I want a well-structured React application with TypeScript, so that I can build features incrementally with type safety and modern tooling.

#### Acceptance Criteria

1. WHEN the application is initialized THEN it SHALL use React 18+ with TypeScript
2. WHEN building the application THEN it SHALL use Vite as the build tool
3. WHEN the application runs THEN it SHALL support Hot Module Replacement (HMR) for development
4. WHEN environment variables are accessed THEN they SHALL use the `VITE_` prefix for client-side exposure
5. WHEN the application is built for production THEN it SHALL generate optimized static assets
6. IF authentication is disabled THEN the application SHALL work without Azure AD configuration
7. IF authentication is enabled THEN the application SHALL require Azure AD configuration variables

### Requirement 2: Mock Data Service Architecture

**User Story:** As a developer, I want mock data services that can be easily replaced with real API calls, so that I can develop UI features independently of backend availability.

#### Acceptance Criteria

1. WHEN `VITE_AUTH_ENABLED=false` THEN the application SHALL use mock data services
2. WHEN `VITE_AUTH_ENABLED=true` AND `VITE_MARKET_VIEW_API_HOST` is set THEN the application SHALL use real API calls
3. WHEN API calls fail AND `VITE_USE_DUMMY_DATA_FALLBACK=true` THEN the application SHALL fall back to mock data
4. WHEN switching between mock and real data THEN it SHALL only require environment variable changes
5. WHEN mock data is used THEN it SHALL provide realistic data structures matching API responses
6. WHEN mock data services are called THEN they SHALL simulate network delays (100-500ms)

### Requirement 3: Authentication System

**User Story:** As a user, I want secure authentication that works seamlessly in both development and production, so that I can access the application appropriately based on the environment.

#### Acceptance Criteria

1. WHEN `VITE_AUTH_ENABLED=false` THEN the application SHALL operate without authentication
2. WHEN `VITE_AUTH_ENABLED=false` THEN the application SHALL display a mock user identity (e.g., "Guest User")
3. WHEN `VITE_AUTH_ENABLED=true` THEN the application SHALL use Azure AD MSAL for authentication
4. WHEN authentication is enabled AND no user is logged in THEN the application SHALL redirect to Azure AD login
5. WHEN authentication is enabled AND user logs in THEN the application SHALL store tokens in localStorage
6. WHEN API calls are made AND authentication is enabled THEN they SHALL include Bearer token in Authorization header
7. WHEN tokens expire AND authentication is enabled THEN the application SHALL silently refresh tokens
8. WHEN token refresh fails AND authentication is enabled THEN the application SHALL redirect to login

### Requirement 4: Routing and Navigation

**User Story:** As a user, I want intuitive navigation between different sections of the application, so that I can efficiently access different features.

#### Acceptance Criteria

1. WHEN the application loads THEN it SHALL redirect from `/` to `/strategies`
2. WHEN navigating to `/strategies` THEN it SHALL display the strategies list page
3. WHEN navigating to `/strategies/:strategyCode` THEN it SHALL display the portfolio holdings page
4. WHEN navigating to `/watchlist` THEN it SHALL display the watchlist page
5. WHEN navigating to `/subscriptions` THEN it SHALL display the subscriptions page
6. WHEN browser back/forward buttons are used THEN the application SHALL navigate correctly
7. WHEN URLs are shared THEN they SHALL load the correct page with correct data
8. WHEN navigation occurs THEN the URL SHALL update to reflect the current page

### Requirement 5: Theme System

**User Story:** As a user, I want to switch between light and dark themes, so that I can use the application comfortably in different lighting conditions.

#### Acceptance Criteria

1. WHEN the application loads THEN it SHALL default to light theme
2. WHEN user selects dark theme THEN the application SHALL apply dark theme styles
3. WHEN user selects light theme THEN the application SHALL apply light theme styles
4. WHEN theme preference changes THEN it SHALL persist in localStorage
5. WHEN the application reloads THEN it SHALL restore the last selected theme
6. WHEN theme changes THEN all components SHALL update immediately without page reload

### Requirement 6: Error Handling and Logging

**User Story:** As a developer, I want comprehensive error handling and logging, so that I can diagnose issues and provide a good user experience.

#### Acceptance Criteria

1. WHEN an unhandled error occurs THEN the application SHALL display an error boundary UI
2. WHEN an API call fails THEN the application SHALL display a user-friendly error message
3. WHEN errors occur THEN they SHALL be logged to the console with context
4. WHEN API calls are made THEN they SHALL be logged with request/response details
5. WHEN API calls timeout THEN the application SHALL display a timeout error message
6. WHEN network errors occur THEN the application SHALL display a network error message
7. WHEN 403 Forbidden errors occur THEN the application SHALL display an authorization error message

### Requirement 7: Layout and Sidebar

**User Story:** As a user, I want a persistent navigation sidebar, so that I can quickly access different sections and pinned items.

#### Acceptance Criteria

1. WHEN the application loads THEN it SHALL display a collapsible sidebar on the left
2. WHEN sidebar is open THEN main content SHALL be offset by sidebar width (337px)
3. WHEN sidebar is collapsed THEN main content SHALL be offset by collapsed width (81px)
4. WHEN sidebar state changes THEN it SHALL persist in localStorage
5. WHEN sidebar is collapsed THEN it SHALL show icons only
6. WHEN sidebar is expanded THEN it SHALL show icons and labels
7. WHEN sidebar toggle button is clicked THEN sidebar SHALL expand/collapse
8. WHEN sidebar is collapsed AND user hovers over icons THEN tooltips SHALL show labels

### Requirement 8: Sidebar Navigation Items

**User Story:** As a user, I want to see navigation options in the sidebar, so that I can quickly access main features.

#### Acceptance Criteria

1. WHEN sidebar is displayed THEN it SHALL show a "Home" link to `/strategies`
2. WHEN sidebar is displayed THEN it SHALL show a "Watchlist" link to `/watchlist`
3. WHEN sidebar is displayed THEN it SHALL show a "Subscriptions" link to `/subscriptions`
4. WHEN current route matches a sidebar item THEN that item SHALL be highlighted
5. WHEN sidebar item is clicked THEN the application SHALL navigate to that route
6. WHEN sidebar is collapsed THEN navigation items SHALL still be clickable

### Requirement 9: Sidebar Pinned Items Section

**User Story:** As a user, I want to see pinned strategies and companies in the sidebar, so that I can quickly access frequently used items.

#### Acceptance Criteria

1. WHEN strategies are pinned THEN they SHALL appear in a "Pinned Strategies" section
2. WHEN companies are pinned THEN they SHALL appear in a "Pinned Companies" section
3. WHEN no items are pinned THEN pinned sections SHALL not be displayed
4. WHEN pinned item is clicked THEN the application SHALL navigate to that item
5. WHEN pinned strategies are displayed THEN they SHALL show strategy name
6. WHEN pinned companies are displayed THEN they SHALL show company name
7. WHEN sidebar is collapsed THEN pinned items SHALL show icons only with tooltips

### Requirement 10: Sidebar User Profile Section

**User Story:** As a user, I want to see my profile information and theme controls in the sidebar, so that I can manage my preferences.

#### Acceptance Criteria

1. WHEN sidebar is displayed THEN it SHALL show user profile section at the bottom
2. WHEN authentication is disabled THEN it SHALL show "Guest User" with default avatar
3. WHEN authentication is enabled AND user is logged in THEN it SHALL show user name and email
4. WHEN user profile is displayed THEN it SHALL show user initials in a circular avatar
5. WHEN user profile is clicked THEN it SHALL show a dropdown menu
6. WHEN dropdown menu is displayed THEN it SHALL include theme toggle (light/dark)
7. WHEN dropdown menu is displayed THEN it SHALL include sign out option (if auth enabled)
8. WHEN theme toggle is clicked THEN theme SHALL switch immediately

### Requirement 11: Sidebar Search Functionality

**User Story:** As a user, I want to search for strategies in the sidebar, so that I can quickly find and navigate to specific strategies.

#### Acceptance Criteria

1. WHEN sidebar is displayed THEN it SHALL show a search input field
2. WHEN user types in search field THEN it SHALL filter strategies by name
3. WHEN search results are displayed THEN they SHALL show matching strategies
4. WHEN search result is clicked THEN the application SHALL navigate to that strategy
5. WHEN search field is cleared THEN filtered results SHALL be hidden
6. WHEN no matches are found THEN search SHALL display "No strategies found"

### Requirement 12: Strategies List Page

**User Story:** As a user, I want to see a list of all available investment strategies, so that I can select one to view its holdings.

#### Acceptance Criteria

1. WHEN user navigates to `/strategies` THEN it SHALL display a list of all strategies
2. WHEN strategies are loading THEN it SHALL display a loading spinner with "Loading strategies..." message
3. WHEN strategies fail to load THEN it SHALL display an error message with retry option
4. WHEN strategies are displayed THEN each strategy SHALL show its name
5. WHEN strategy row is clicked THEN the application SHALL navigate to `/strategies/:strategyCode`
6. WHEN strategy row is hovered THEN it SHALL highlight to indicate it's clickable

### Requirement 13: Strategies List Filtering

**User Story:** As a user, I want to filter the strategies list, so that I can quickly find specific strategies.

#### Acceptance Criteria

1. WHEN strategies list is displayed THEN it SHALL show a filter input field
2. WHEN user types in filter field THEN it SHALL filter strategies by name, description, strategy code, or icon code
3. WHEN filter is applied THEN the list SHALL update immediately
4. WHEN filter matches are found THEN it SHALL display count (e.g., "5 strategies")
5. WHEN no matches are found THEN it SHALL display "No strategies found"
6. WHEN filter is cleared THEN full list SHALL be displayed

### Requirement 14: Strategies List Sorting

**User Story:** As a user, I want to sort the strategies list, so that I can organize strategies by name.

#### Acceptance Criteria

1. WHEN strategies list header is clicked THEN it SHALL toggle sort direction
2. WHEN sort is ascending THEN strategies SHALL be sorted A-Z
3. WHEN sort is descending THEN strategies SHALL be sorted Z-A
4. WHEN sort direction changes THEN sort indicator SHALL update
5. WHEN strategies are sorted THEN the list SHALL update immediately

### Requirement 15: Responsive Design

**User Story:** As a user, I want the application to work well on different screen sizes, so that I can use it on various devices.

#### Acceptance Criteria

1. WHEN screen width is less than 768px THEN sidebar SHALL be hidden by default
2. WHEN screen width is less than 768px THEN a menu button SHALL be displayed to toggle sidebar
3. WHEN sidebar is toggled on mobile THEN it SHALL overlay the main content
4. WHEN sidebar is open on mobile AND user clicks outside THEN sidebar SHALL close
5. WHEN content is displayed THEN it SHALL be responsive and not overflow horizontally

### Requirement 16: API Integration Layer

**User Story:** As a developer, I want a consistent API integration layer, so that all API calls follow the same patterns and error handling.

#### Acceptance Criteria

1. WHEN API calls are made THEN they SHALL use a centralized API service
2. WHEN API calls are made THEN they SHALL include proper error handling
3. WHEN API calls are made THEN they SHALL support timeout (15 seconds default)
4. WHEN API calls succeed THEN they SHALL return typed data
5. WHEN API calls fail THEN they SHALL throw typed errors
6. WHEN API responses are received THEN they SHALL be cached appropriately
7. WHEN cached data is available THEN API SHALL return cached data if not expired

### Requirement 17: Context Providers

**User Story:** As a developer, I want global state management through React Context, so that data can be shared across components efficiently.

#### Acceptance Criteria

1. WHEN the application loads THEN it SHALL wrap components in necessary Context providers
2. WHEN authentication context is provided THEN it SHALL manage authentication state
3. WHEN navigation context is provided THEN it SHALL manage navigation history and pinned items
4. WHEN events context is provided THEN it SHALL manage custom events
5. WHEN theme context is provided THEN it SHALL manage theme state
6. WHEN context values change THEN consuming components SHALL re-render

