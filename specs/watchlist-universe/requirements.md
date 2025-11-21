# Requirements Document: Watchlist and Universe Pages

## Introduction

This document specifies the Watchlist and Universe pages, which allow users to manage their personal watchlist of companies and browse the full investment universe for a strategy. The watchlist enables users to track companies across strategies, while the universe page provides access to all companies available to a strategy.

These features build upon the portfolio holdings foundation, providing users with tools to discover and track companies of interest.

## Requirements

### Requirement 1: Watchlist Page Display

**User Story:** As a user, I want to see my watchlist, so that I can quickly access companies I'm tracking.

#### Acceptance Criteria

1. WHEN user navigates to `/watchlist` THEN it SHALL display the watchlist page
2. WHEN watchlist is loading THEN it SHALL display a loading spinner
3. WHEN watchlist fails to load THEN it SHALL display an error message
4. WHEN watchlist is empty THEN it SHALL display "Your watchlist is empty" message
5. WHEN watchlist has items THEN it SHALL display them in a table format

### Requirement 2: Watchlist Table Columns

**User Story:** As a user, I want to see relevant information about watchlist companies, so that I can identify and analyze them.

#### Acceptance Criteria

1. WHEN watchlist items are displayed THEN table SHALL include Name column showing company name
2. WHEN watchlist items are displayed THEN table SHALL include SEDOL column showing stock identifier
3. WHEN watchlist items are displayed THEN table SHALL include Country column
4. WHEN watchlist items are displayed THEN table SHALL include Sector column
5. WHEN watchlist items are displayed THEN table SHALL include Industry column
6. WHEN watchlist items are displayed THEN table SHALL include MCap column showing market capitalization
7. WHEN MCap values are displayed THEN they SHALL be formatted (e.g., $1.5B, $500M)
8. WHEN data is missing THEN it SHALL display "-" for that field

### Requirement 3: Watchlist Navigation

**User Story:** As a user, I want to navigate to company detail pages from watchlist, so that I can view company timelines.

#### Acceptance Criteria

1. WHEN user clicks on a watchlist row THEN it SHALL navigate to `/strategies/WATCHLIST/stocks/:sedol`
2. WHEN navigation occurs THEN it SHALL use special "WATCHLIST" strategy code
3. WHEN navigation occurs THEN URL SHALL update correctly
4. WHEN company detail page loads THEN it SHALL display company timeline

### Requirement 4: Watchlist Item Selection

**User Story:** As a user, I want to select multiple watchlist items, so that I can perform bulk actions.

#### Acceptance Criteria

1. WHEN watchlist table is displayed THEN each row SHALL have a checkbox for selection
2. WHEN user clicks a row checkbox THEN that item SHALL be added to selection
3. WHEN user clicks a selected row checkbox THEN that item SHALL be removed from selection
4. WHEN header checkbox is clicked THEN it SHALL select/deselect all visible items
5. WHEN items are selected THEN selected count SHALL be displayed

### Requirement 5: Remove from Watchlist

**User Story:** As a user, I want to remove companies from my watchlist, so that I can keep it current.

#### Acceptance Criteria

1. WHEN watchlist row menu is opened THEN it SHALL show "Remove from Watchlist" option
2. WHEN "Remove from Watchlist" is clicked THEN item SHALL be removed from watchlist
3. WHEN item is removed THEN table SHALL update immediately (optimistic update)
4. WHEN removal succeeds THEN success toast SHALL be displayed
5. WHEN removal fails THEN item SHALL be restored and error toast displayed
6. WHEN item is removed THEN it SHALL be removed from selection if selected

### Requirement 6: Pin Company from Watchlist

**User Story:** As a user, I want to pin companies from watchlist, so that I can quickly access them from the sidebar.

#### Acceptance Criteria

1. WHEN watchlist row menu is opened THEN it SHALL show "Pin" option
2. WHEN "Pin" is clicked THEN company SHALL be added to pinned items
3. WHEN company is pinned THEN it SHALL appear in sidebar pinned companies section
4. WHEN pin action succeeds THEN success toast SHALL be displayed
5. WHEN pin action fails THEN error toast SHALL be displayed

### Requirement 7: Watchlist Loading

**User Story:** As a user, I want watchlist to load automatically, so that I see my companies when I visit the page.

#### Acceptance Criteria

1. WHEN watchlist page loads THEN it SHALL fetch watchlist from API
2. WHEN watchlist is fetched THEN it SHALL load once per session (cached)
3. WHEN watchlist data is available THEN it SHALL populate the table
4. WHEN watchlist fails to load THEN error message SHALL be displayed

### Requirement 8: Universe Page Display

**User Story:** As a user, I want to see all companies in a strategy's universe, so that I can discover investment opportunities.

#### Acceptance Criteria

1. WHEN user navigates to `/strategies/:strategyCode/universe` THEN it SHALL display the universe page
2. WHEN universe is loading THEN it SHALL display a loading spinner
3. WHEN universe fails to load THEN it SHALL display an error message
4. WHEN universe has companies THEN it SHALL display them in a table format
5. WHEN universe page loads THEN it SHALL display "Investment Universe" as page title

### Requirement 9: Universe Table Columns

**User Story:** As a user, I want to see relevant information about universe companies, so that I can evaluate them.

#### Acceptance Criteria

1. WHEN universe companies are displayed THEN table SHALL include Name column
2. WHEN universe companies are displayed THEN table SHALL include SEDOL column
3. WHEN universe companies are displayed THEN table SHALL include Country column
4. WHEN universe companies are displayed THEN table SHALL include Sector column
5. WHEN universe companies are displayed THEN table SHALL include Industry column
6. WHEN data is missing THEN it SHALL display "-" for that field

### Requirement 10: Universe Filtering by Country

**User Story:** As a user, I want to filter universe by country, so that I can focus on specific regions.

#### Acceptance Criteria

1. WHEN universe table is displayed THEN Country column SHALL have a filter dropdown
2. WHEN filter dropdown is opened THEN it SHALL show all unique countries
3. WHEN user selects countries THEN table SHALL filter to show only those countries
4. WHEN multiple countries are selected THEN table SHALL show companies from any selected country
5. WHEN filter is cleared THEN all companies SHALL be displayed
6. WHEN filter is applied THEN table SHALL update immediately

### Requirement 11: Universe Filtering by Sector

**User Story:** As a user, I want to filter universe by sector, so that I can focus on specific industries.

#### Acceptance Criteria

1. WHEN universe table is displayed THEN Sector column SHALL have a filter dropdown
2. WHEN filter dropdown is opened THEN it SHALL show all unique sectors
3. WHEN user selects sectors THEN table SHALL filter to show only those sectors
4. WHEN multiple sectors are selected THEN table SHALL show companies from any selected sector
5. WHEN filter is cleared THEN all companies SHALL be displayed
6. WHEN filter is applied THEN table SHALL update immediately

### Requirement 12: Universe Filtering by Industry

**User Story:** As a user, I want to filter universe by industry, so that I can focus on specific business types.

#### Acceptance Criteria

1. WHEN universe table is displayed THEN Industry column SHALL have a filter dropdown
2. WHEN filter dropdown is opened THEN it SHALL show all unique industries
3. WHEN user selects industries THEN table SHALL filter to show only those industries
4. WHEN multiple industries are selected THEN table SHALL show companies from any selected industry
5. WHEN filter is cleared THEN all companies SHALL be displayed
6. WHEN filter is applied THEN table SHALL update immediately

### Requirement 13: Universe Company Selection

**User Story:** As a user, I want to select multiple universe companies, so that I can perform bulk actions.

#### Acceptance Criteria

1. WHEN universe table is displayed THEN each row SHALL have a checkbox for selection
2. WHEN user clicks a row checkbox THEN that company SHALL be added to selection
3. WHEN user clicks a selected row checkbox THEN that company SHALL be removed from selection
4. WHEN header checkbox is clicked THEN it SHALL select/deselect all filtered companies
5. WHEN companies are selected THEN selected count SHALL be displayed

### Requirement 14: Add Selected Companies to Watchlist

**User Story:** As a user, I want to add multiple companies to watchlist at once, so that I can efficiently build my watchlist.

#### Acceptance Criteria

1. WHEN companies are selected THEN table menu SHALL show "Add to Watchlist" option
2. WHEN "Add to Watchlist" is clicked THEN all selected companies SHALL be added to watchlist
3. WHEN companies are already in watchlist THEN they SHALL be skipped
4. WHEN companies are added THEN success toast SHALL be displayed
5. WHEN companies are added THEN selection SHALL be cleared
6. WHEN add action fails THEN error toast SHALL be displayed for failed items

### Requirement 15: Pin Selected Companies

**User Story:** As a user, I want to pin multiple companies at once, so that I can quickly access them from the sidebar.

#### Acceptance Criteria

1. WHEN companies are selected THEN table menu SHALL show "Pin" option
2. WHEN "Pin" is clicked THEN all selected companies SHALL be pinned
3. WHEN companies are pinned THEN they SHALL appear in sidebar pinned companies section
4. WHEN pin action succeeds THEN success toast SHALL be displayed
5. WHEN pin action fails THEN error toast SHALL be displayed

### Requirement 16: Add Single Company to Watchlist

**User Story:** As a user, I want to add individual companies to watchlist, so that I can track specific companies.

#### Acceptance Criteria

1. WHEN universe row menu is opened THEN it SHALL show "Add to Watchlist" option
2. WHEN "Add to Watchlist" is clicked THEN that company SHALL be added to watchlist
3. WHEN company is already in watchlist THEN option SHALL be disabled or show "Already in Watchlist"
4. WHEN company is added THEN success toast SHALL be displayed
5. WHEN add action fails THEN error toast SHALL be displayed

### Requirement 17: Pin Single Company from Universe

**User Story:** As a user, I want to pin individual companies, so that I can quickly access them.

#### Acceptance Criteria

1. WHEN universe row menu is opened THEN it SHALL show "Pin" option
2. WHEN "Pin" is clicked THEN company SHALL be added to pinned items
3. WHEN company is pinned THEN it SHALL appear in sidebar pinned companies section
4. WHEN pin action succeeds THEN success toast SHALL be displayed

### Requirement 18: Navigate to Company from Universe

**User Story:** As a user, I want to navigate to company detail pages from universe, so that I can view company timelines.

#### Acceptance Criteria

1. WHEN user clicks on a universe row THEN it SHALL navigate to `/strategies/:strategyCode/stocks/:sedol`
2. WHEN navigation occurs THEN it SHALL preserve strategy context
3. WHEN navigation occurs THEN URL SHALL update correctly
4. WHEN company detail page loads THEN it SHALL display company timeline

### Requirement 19: Universe Data Loading

**User Story:** As a user, I want universe data to load efficiently, so that I can browse companies quickly.

#### Acceptance Criteria

1. WHEN universe page loads THEN it SHALL fetch universe data for the strategy
2. WHEN universe is fetched THEN it SHALL use strategy_code parameter
3. WHEN universe data is available THEN it SHALL populate the table
4. WHEN universe fails to load THEN error message SHALL be displayed
5. WHEN universe is large THEN it SHALL handle performance appropriately (pagination or virtualization if needed)

### Requirement 20: Watchlist Empty State

**User Story:** As a user, I want helpful guidance when my watchlist is empty, so that I know how to add companies.

#### Acceptance Criteria

1. WHEN watchlist is empty THEN it SHALL display a message: "Your watchlist is empty. Add stocks from the universe page."
2. WHEN empty state is displayed THEN it SHALL be visually distinct from table
3. WHEN empty state is displayed THEN it SHALL provide clear next steps

### Requirement 21: Filter Combination Logic

**User Story:** As a user, I want filters to work together, so that I can narrow down companies effectively.

#### Acceptance Criteria

1. WHEN multiple filters are applied THEN companies SHALL match ALL filter criteria (AND logic)
2. WHEN country filter is set AND sector filter is set THEN companies SHALL be in selected country AND selected sector
3. WHEN filters are combined THEN table SHALL update to show only matching companies
4. WHEN no companies match filters THEN it SHALL display "No companies match your filters"

### Requirement 22: Selected Items Persistence During Filtering

**User Story:** As a user, I want selected items to remain selected when filtering, so that I don't lose my selection.

#### Acceptance Criteria

1. WHEN companies are selected AND filters are applied THEN selected companies SHALL remain selected if they match filters
2. WHEN selected companies are filtered out THEN they SHALL remain in selection but not visible
3. WHEN "Select All" is clicked THEN only visible (filtered) companies SHALL be selected
4. WHEN filters change THEN selection SHALL be preserved for companies still visible

