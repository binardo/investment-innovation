# Requirements Document: Portfolio Holdings Screen

## Introduction

This document specifies the Portfolio Holdings screen, which displays the holdings (stocks) within a selected investment strategy. Users can view detailed information about each holding, filter and sort the holdings, select multiple holdings for bulk actions, and navigate to individual company detail pages.

This feature builds upon the app setup and strategies list foundation, allowing users to drill down from a strategy to see its constituent holdings.

## Requirements

### Requirement 1: Portfolio Holdings Page Display

**User Story:** As a user, I want to see all holdings for a selected strategy, so that I can understand the composition of the portfolio.

#### Acceptance Criteria

1. WHEN user navigates to `/strategies/:strategyCode` THEN it SHALL display the portfolio holdings page
2. WHEN the page loads THEN it SHALL fetch holdings data for the strategy
3. WHEN holdings are loading THEN it SHALL display a loading spinner with "Loading holdings..." message
4. WHEN holdings fail to load THEN it SHALL display an error message with back button
5. WHEN holdings are displayed THEN they SHALL be shown in a table format
6. WHEN no holdings exist THEN it SHALL display "No holdings found"

### Requirement 2: Strategy Header Information

**User Story:** As a user, I want to see key information about the strategy, so that I can understand the context of the holdings I'm viewing.

#### Acceptance Criteria

1. WHEN the holdings page loads THEN it SHALL display the strategy name as the page title
2. WHEN strategy metadata is available THEN it SHALL display representative portfolio icon code
3. WHEN strategy metadata is available THEN it SHALL display investment style, asset class, sub-asset class, and investment time horizon
4. WHEN strategy metadata is available THEN it SHALL display primary benchmark name
5. WHEN strategy metadata is available THEN it SHALL display portfolio management group members
6. WHEN strategy metadata is available THEN it SHALL display product group members as badges with tooltips
7. WHEN strategy metadata is available THEN it SHALL display investment decision making group members as badges with tooltips
8. WHEN strategy metadata is available THEN it SHALL display client contacts as badges with tooltips
9. WHEN strategy performance objective exists THEN it SHALL display an info icon with tooltip showing the objective

### Requirement 3: Holdings Table Columns

**User Story:** As a user, I want to see relevant information about each holding, so that I can analyze the portfolio composition.

#### Acceptance Criteria

1. WHEN holdings are displayed THEN the table SHALL include a Company column showing company name
2. WHEN holdings are displayed THEN the table SHALL include a SEDOL column showing the stock identifier
3. WHEN holdings are displayed THEN the table SHALL include a Sector column showing the sector classification
4. WHEN holdings are displayed THEN the table SHALL include a Country column showing the country
5. WHEN holdings are displayed THEN the table SHALL include a Weight column showing portfolio weight as percentage
6. WHEN holdings are displayed THEN the table SHALL include a Benchmark Wt column showing benchmark weight as percentage
7. WHEN holdings are displayed THEN the table SHALL include an Active Wt column showing active weight as percentage
8. WHEN weight values are null THEN they SHALL display as "-"
9. WHEN weight values are displayed THEN they SHALL be formatted to 2 decimal places with % symbol

### Requirement 4: Holdings Table Sorting

**User Story:** As a user, I want to sort holdings by different columns, so that I can organize the data in a way that's useful for my analysis.

#### Acceptance Criteria

1. WHEN user clicks on a sortable column header THEN it SHALL toggle sort direction
2. WHEN sort is first applied THEN it SHALL default to ascending order
3. WHEN same column is clicked again THEN it SHALL toggle to descending order
4. WHEN different column is clicked THEN it SHALL sort by that column in ascending order
5. WHEN holdings are sorted THEN the table SHALL update immediately
6. WHEN default sort is applied THEN it SHALL sort by Active Wt descending

### Requirement 5: Holdings Table Filtering

**User Story:** As a user, I want to filter holdings, so that I can quickly find specific stocks in the portfolio.

#### Acceptance Criteria

1. WHEN the holdings table is displayed THEN it SHALL show a filter input field
2. WHEN user types in filter field THEN it SHALL filter holdings by company name, SEDOL, sector, or country
3. WHEN filter is applied THEN the table SHALL update immediately
4. WHEN filter matches are found THEN it SHALL display count of filtered results
5. WHEN no matches are found THEN it SHALL display "No holdings match your filter"

### Requirement 6: Holdings Selection

**User Story:** As a user, I want to select multiple holdings, so that I can perform bulk actions on them.

#### Acceptance Criteria

1. WHEN holdings table is displayed THEN each row SHALL have a checkbox for selection
2. WHEN user clicks a row checkbox THEN that holding SHALL be added to selection
3. WHEN user clicks a selected row checkbox THEN that holding SHALL be removed from selection
4. WHEN header checkbox is clicked THEN it SHALL select/deselect all visible holdings
5. WHEN holdings are selected THEN selected count SHALL be displayed
6. WHEN "Select All" action is triggered THEN all filtered holdings SHALL be selected
7. WHEN "Clear Selection" action is triggered THEN all selections SHALL be cleared

### Requirement 7: Navigation to Company Detail

**User Story:** As a user, I want to click on a holding to see its detail page, so that I can view the company timeline and documents.

#### Acceptance Criteria

1. WHEN user clicks on a holding row THEN it SHALL navigate to `/strategies/:strategyCode/stocks/:sedol`
2. WHEN user clicks on a holding row THEN it SHALL preserve the strategy context
3. WHEN navigation occurs THEN the URL SHALL update to reflect the company detail page

### Requirement 8: Back Navigation

**User Story:** As a user, I want to navigate back to the strategies list, so that I can select a different strategy.

#### Acceptance Criteria

1. WHEN the holdings page is displayed THEN it SHALL show a back button
2. WHEN back button is clicked THEN it SHALL navigate to `/strategies`
3. WHEN back button is clicked THEN it SHALL preserve any navigation history

### Requirement 9: Strategy Actions Menu

**User Story:** As a user, I want to access strategy-specific actions, so that I can manage subscriptions and pinning.

#### Acceptance Criteria

1. WHEN the holdings page is displayed THEN it SHALL show a "More" menu button (three dots)
2. WHEN menu is opened THEN it SHALL display "Subscriptions" option
3. WHEN menu is opened THEN it SHALL display "Pin" or "Unpin" option based on current pin state
4. WHEN "Subscriptions" is clicked THEN it SHALL open the subscriptions overlay
5. WHEN "Pin" is clicked THEN the strategy SHALL be added to pinned items
6. WHEN "Unpin" is clicked THEN the strategy SHALL be removed from pinned items
7. WHEN pin state changes THEN a toast notification SHALL be displayed

### Requirement 10: Universe Navigation

**User Story:** As a user, I want to navigate to the universe view, so that I can see all companies available to the strategy.

#### Acceptance Criteria

1. WHEN the holdings page is displayed THEN it SHALL show an "Universe" button
2. WHEN "Universe" button is clicked THEN it SHALL navigate to `/strategies/:strategyCode/universe`
3. WHEN navigation occurs THEN the URL SHALL update correctly

### Requirement 12: Portfolio Metadata Display

**User Story:** As a user, I want to see additional portfolio metadata, so that I can understand the strategy characteristics.

#### Acceptance Criteria

1. WHEN portfolio metadata is loaded THEN it SHALL display strategy description if available
2. WHEN portfolio metadata is loaded THEN it SHALL display strategy performance objective in tooltip
3. WHEN portfolio metadata is loaded THEN it SHALL format group member lists appropriately
4. WHEN portfolio metadata fails to load THEN it SHALL not prevent holdings from displaying
5. WHEN portfolio metadata is missing THEN it SHALL gracefully handle missing fields

