# Requirements Document: Company Timeline and Documents Screen

## Introduction

This document specifies the Company Timeline and Documents screen, which displays a comprehensive timeline view of a company's investment-related events, documents, and metrics. Users can view stock price history, company documents (reports, filings, earnings calls), trades, Forward Looking Hypotheses (FLH), and AI-generated content all on a unified timeline interface.

This feature builds upon the portfolio holdings foundation, allowing users to drill down from a holding to see detailed company information and investment activity over time.

## Requirements

### Requirement 1: Company Timeline Page Display

**User Story:** As a user, I want to see a timeline view of a company's investment activity, so that I can understand the history and context of investment decisions.

#### Acceptance Criteria

1. WHEN user navigates to `/strategies/:strategyCode/stocks/:sedol` THEN it SHALL display the company timeline page
2. WHEN the page loads THEN it SHALL fetch company details, documents, price history, and metrics
3. WHEN data is loading THEN it SHALL display loading states for each data section
4. WHEN data fails to load THEN it SHALL display error messages with retry options
5. WHEN the page loads THEN it SHALL display company name as the page title
6. WHEN company details are available THEN it SHALL display company information in the header

### Requirement 2: Company Header Information

**User Story:** As a user, I want to see key information about the company, so that I can understand the context of the timeline.

#### Acceptance Criteria

1. WHEN the timeline page loads THEN it SHALL display company name prominently
2. WHEN company details are available THEN it SHALL display legal name
3. WHEN company details are available THEN it SHALL display short name
4. WHEN company details are available THEN it SHALL display country code
5. WHEN company details are available THEN it SHALL display company description
6. WHEN company details fail to load THEN it SHALL not prevent timeline from displaying

### Requirement 3: Price and Metrics Chart

**User Story:** As a user, I want to see stock price and financial metrics over time, so that I can correlate price movements with events and documents.

#### Acceptance Criteria

1. WHEN the timeline page loads THEN it SHALL display a chart showing price history
2. WHEN price data is available THEN the chart SHALL display price over time as a line graph
3. WHEN price data is loading THEN it SHALL display a loading state
4. WHEN price data fails to load THEN it SHALL display an error message
5. WHEN user selects a different metric THEN the chart SHALL update to show that metric
6. WHEN metrics are available THEN user SHALL be able to select from: Price, Market Cap, P/E Ratio, Revenue
7. WHEN metric data is displayed THEN it SHALL use appropriate units and formatting
8. WHEN date range is changed THEN the chart SHALL update to show data for that range

### Requirement 4: Date Range Selection

**User Story:** As a user, I want to adjust the date range of the timeline, so that I can focus on specific time periods.

#### Acceptance Criteria

1. WHEN the timeline page loads THEN it SHALL default to showing the last year of data
2. WHEN date range picker is displayed THEN user SHALL be able to select custom date range
3. WHEN date range is changed THEN the chart SHALL update to show data for that range
4. WHEN date range is changed THEN documents SHALL be filtered to that range
5. WHEN date range is changed THEN events SHALL be filtered to that range
6. WHEN date range picker is used THEN it SHALL validate that start date is before end date

### Requirement 5: Event Type Filtering

**User Story:** As a user, I want to filter which event types are displayed, so that I can focus on specific types of information.

#### Acceptance Criteria

1. WHEN the timeline page loads THEN it SHALL display event type filter controls
2. WHEN event types are available THEN user SHALL be able to toggle: Trades, Earnings Calls, Broker Reports, Company Filings, Internal Research, AI Content, Macro Events
3. WHEN event type is toggled off THEN events of that type SHALL be hidden from timeline
4. WHEN event type is toggled on THEN events of that type SHALL be displayed on timeline
5. WHEN event type filter changes THEN the timeline SHALL update immediately
6. WHEN default filters are applied THEN all event types SHALL be enabled except those specified

### Requirement 6: Timeline Document Display

**User Story:** As a user, I want to see documents and events on the timeline, so that I can understand what happened and when.

#### Acceptance Criteria

1. WHEN documents are loaded THEN they SHALL be displayed as markers on the timeline
2. WHEN documents are displayed THEN they SHALL be positioned under the price/metric chart at their event date
3. WHEN documents are displayed THEN they SHALL show event type icon and color
4. WHEN documents are displayed THEN they SHALL show document title
5. WHEN user hovers over a document marker THEN it SHALL show a tooltip with document details
6. WHEN user clicks on a document marker THEN it SHALL open the document overlay
7. WHEN documents are filtered by date range THEN only documents within range SHALL be displayed
8. WHEN documents are filtered by event type THEN only enabled types SHALL be displayed
9. WHEN document date doesn't match chart date THEN marker SHALL resolve to nearest available chart date
10. WHEN date range is wide AND event dates are filtered out THEN markers SHALL resolve to nearest visible date

### Requirement 7: Document Table

**User Story:** As a user, I want to see a list of all documents, so that I can browse and search through them.

#### Acceptance Criteria

1. WHEN the timeline page loads THEN it SHALL display a document table below the chart
2. WHEN documents are displayed THEN the table SHALL show columns: Date, Type, Title, Author
3. WHEN documents are displayed THEN they SHALL be sorted by date (newest first) by default
4. WHEN user clicks on a document row THEN it SHALL open the document overlay
5. WHEN documents are filtered THEN the table SHALL update to show only filtered documents
6. WHEN no documents match filters THEN it SHALL display "No documents found"

### Requirement 8: Document Selection

**User Story:** As a user, I want to select multiple documents, so that I can perform bulk actions on them.

#### Acceptance Criteria

1. WHEN document table is displayed THEN each row SHALL have a checkbox for selection
2. WHEN user clicks a row checkbox THEN that document SHALL be added to selection
3. WHEN user clicks a selected row checkbox THEN that document SHALL be removed from selection
4. WHEN header checkbox is clicked THEN it SHALL select/deselect all visible documents
5. WHEN documents are selected THEN selected count SHALL be displayed

### Requirement 9: Document Overlay

**User Story:** As a user, I want to view document content in detail, so that I can read reports and analysis.

#### Acceptance Criteria

1. WHEN user clicks on a document THEN it SHALL open a document overlay
2. WHEN document overlay opens THEN it SHALL display document title
3. WHEN document overlay opens THEN it SHALL display document date and type
4. WHEN document overlay opens THEN it SHALL display document author if available
5. WHEN document overlay opens THEN it SHALL display document content
6. WHEN document has variants THEN user SHALL be able to switch between variants
7. WHEN document overlay is open THEN user SHALL be able to close it with close button or ESC key
8. WHEN document overlay is open THEN it SHALL overlay the main content with backdrop

### Requirement 10: FLH Display and Access

**User Story:** As a user, I want to see Forward Looking Hypotheses on the timeline, so that I can track investment hypotheses.

#### Acceptance Criteria

1. WHEN FLH data exists THEN it SHALL be displayed as events on the timeline
2. WHEN FLH is displayed THEN it SHALL show FLH type icon and color
3. WHEN user clicks on FLH event THEN it SHALL open the FLH form overlay
4. WHEN FLH form overlay opens THEN it SHALL display FLH description and indicators
5. WHEN FLH form overlay opens THEN it SHALL allow editing if user has permissions

### Requirement 11: Trade Display

**User Story:** As a user, I want to see trades on the timeline, so that I can understand when positions were bought or sold.

#### Acceptance Criteria

1. WHEN trades are loaded THEN they SHALL be displayed as events on the timeline
2. WHEN trades are displayed THEN they SHALL show trade type icon (buy/sell)
3. WHEN trades are displayed THEN they SHALL show trade date
4. WHEN trades are displayed THEN they SHALL show trade direction (PURCHASE/SALE)
5. WHEN user clicks on a trade THEN it SHALL show trade details in tooltip or overlay
6. WHEN trades are displayed THEN buy trades SHALL use one color/style and sell trades another

### Requirement 12: Custom Events Management

**User Story:** As a user, I want to create and manage custom events, so that I can track additional investment activities.

#### Acceptance Criteria

1. WHEN the timeline page is displayed THEN it SHALL show an "Add Event" button
2. WHEN "Add Event" button is clicked THEN it SHALL open event form overlay
3. WHEN event form is displayed THEN user SHALL be able to enter: date, type, title, description
4. WHEN event is created THEN it SHALL appear on the timeline
5. WHEN user clicks on a custom event THEN it SHALL open event form for editing
6. WHEN event is updated THEN timeline SHALL update immediately
7. WHEN event is deleted THEN it SHALL be removed from timeline
8. WHEN custom events are displayed THEN they SHALL be distinguishable from API-sourced events

### Requirement 13: Company Pinning

**User Story:** As a user, I want to pin companies to the sidebar, so that I can quickly access frequently viewed companies.

#### Acceptance Criteria

1. WHEN the timeline page is displayed THEN it SHALL show a pin button in the header
2. WHEN pin button is clicked AND company is not pinned THEN company SHALL be added to pinned items
3. WHEN pin button is clicked AND company is pinned THEN company SHALL be removed from pinned items
4. WHEN pin state changes THEN pin button icon SHALL update to reflect state
5. WHEN pin state changes THEN a toast notification SHALL be displayed

### Requirement 14: Watchlist Management

**User Story:** As a user, I want to add companies to my watchlist, so that I can track them across strategies.

#### Acceptance Criteria

1. WHEN the timeline page is displayed THEN it SHALL show an "Add to Watchlist" option in actions menu
2. WHEN company is added to watchlist THEN it SHALL be added to user's watchlist
3. WHEN company is already in watchlist THEN option SHALL be disabled or show "Remove from Watchlist"
4. WHEN watchlist action is performed THEN a toast notification SHALL be displayed

### Requirement 15: Metric Types Configuration

**User Story:** As a user, I want to see different financial metrics, so that I can analyze various aspects of company performance.

#### Acceptance Criteria

1. WHEN metric types are loaded THEN user SHALL be able to select from available metrics
2. WHEN metric types are displayed THEN they SHALL show display name and description
3. WHEN metric type is selected THEN chart SHALL update to show that metric
4. WHEN metric data is unavailable THEN chart SHALL display appropriate message
5. WHEN metric types fail to load THEN system SHALL fall back to default metrics (Price, Market Cap, P/E, Revenue)

### Requirement 16: Document Variants Support

**User Story:** As a user, I want to view different variants of documents, so that I can see alternative versions or formats.

#### Acceptance Criteria

1. WHEN document has variants THEN document overlay SHALL show variant selector
2. WHEN user selects a variant THEN document content SHALL update to show that variant
3. WHEN variants are displayed THEN they SHALL show variant name
4. WHEN variant has download link THEN user SHALL be able to download the variant file

### Requirement 17: URL Parameters for Document Viewing

**User Story:** As a user, I want to share direct links to documents, so that I can reference specific documents.

#### Acceptance Criteria

1. WHEN URL contains `/docs/:docId` parameter THEN it SHALL open that document overlay on page load
2. WHEN document overlay opens from URL THEN it SHALL display the specified document
3. WHEN document ID is invalid THEN it SHALL display an error message
4. WHEN document is opened from URL THEN URL SHALL update to include docId parameter

### Requirement 18: Chart Zooming and Scrolling

**User Story:** As a user, I want to zoom and scroll the price/metric chart, so that I can explore different time periods and levels of detail.

#### Acceptance Criteria

1. WHEN the chart is displayed THEN user SHALL be able to zoom in using mouse wheel or pinch gesture
2. WHEN the chart is displayed THEN user SHALL be able to zoom out using mouse wheel or pinch gesture
3. WHEN the chart is displayed THEN user SHALL be able to pan/scroll horizontally by dragging
4. WHEN user zooms in THEN the chart SHALL show more detailed data points
5. WHEN user zooms out THEN the chart SHALL show broader time range
6. WHEN chart is zoomed THEN date range picker SHALL update to reflect visible range
7. WHEN chart is panned THEN date range picker SHALL update to reflect visible range
8. WHEN zoom level changes THEN event markers SHALL remain aligned with chart dates

### Requirement 19: Chart Data Optimization

**User Story:** As a user, I want the chart to remain responsive when viewing large date ranges, so that performance doesn't degrade.

#### Acceptance Criteria

1. WHEN chart displays large date range THEN it SHALL reduce data points to maintain performance
2. WHEN data points are reduced THEN chart SHALL use appropriate sampling or aggregation
3. WHEN user zooms in THEN chart SHALL load and display more granular data points
4. WHEN user zooms out THEN chart SHALL reduce data points appropriately
5. WHEN data is reduced THEN chart SHALL maintain visual accuracy of trends
6. WHEN chart is rendered THEN it SHALL maintain smooth interaction (60fps) regardless of data volume

### Requirement 20: Event Marker Positioning Under Chart

**User Story:** As a user, I want to see event markers positioned accurately under the chart, so that I can correlate events with price movements.

#### Acceptance Criteria

1. WHEN events are displayed THEN they SHALL be positioned under the price/metric chart
2. WHEN events are positioned THEN they SHALL align with their event date on the chart x-axis
3. WHEN event date matches chart date THEN marker SHALL be positioned at exact date
4. WHEN event date doesn't match chart date THEN marker SHALL resolve to nearest available chart date
5. WHEN multiple events occur on same date THEN markers SHALL be stacked or offset to avoid overlap
6. WHEN date range is wide AND event dates are filtered out THEN markers SHALL resolve to nearest visible date
7. WHEN markers are positioned THEN they SHALL maintain alignment when chart is zoomed or panned

### Requirement 21: Visual Lines from Events to Chart

**User Story:** As a user, I want to see visual connections from event markers to the chart line, so that I can easily correlate events with price/metric values.

#### Acceptance Criteria

1. WHEN trade markers are displayed THEN they SHALL show a vertical line connecting to the chart line at that date
2. WHEN event markers are displayed THEN they SHALL show a vertical line connecting to the chart line at that date
3. WHEN lines are drawn THEN they SHALL extend from marker to chart line
4. WHEN lines are displayed THEN they SHALL use appropriate styling (dashed, color-coded, etc.)
5. WHEN multiple events occur on same date THEN lines SHALL be clearly distinguishable
6. WHEN chart is zoomed or panned THEN lines SHALL update to maintain connection

### Requirement 22: Key Indicator Toggle

**User Story:** As a user, I want to toggle key indicators display, so that I can focus on important tracking metrics.

#### Acceptance Criteria

1. WHEN FLH data exists THEN the timeline SHALL show a "Key Indicators" toggle control
2. WHEN toggle is enabled THEN key indicators SHALL be displayed
3. WHEN toggle is disabled THEN key indicators SHALL be hidden
4. WHEN key indicators are displayed THEN they SHALL show indicators marked as "key" or "include_in_overall_status"
5. WHEN toggle state changes THEN display SHALL update immediately
6. WHEN key indicators are displayed THEN they SHALL be visually distinct from other indicators

### Requirement 23: Indicator Status Timeline Display

**User Story:** As a user, I want to see the status history of indicators over time, so that I can track how indicator health has changed.

#### Acceptance Criteria

1. WHEN indicator has status history THEN it SHALL display a timeline of status dots
2. WHEN status dots are displayed THEN they SHALL be color-coded: Green, Yellow, Orange, Red
3. WHEN status dots are displayed THEN they SHALL be positioned chronologically along a timeline
4. WHEN status dots are displayed THEN they SHALL show date for each status change
5. WHEN user hovers over status dot THEN it SHALL show tooltip with date and status
6. WHEN status history exists THEN timeline SHALL span from first status to most recent
7. WHEN status changes occur THEN dots SHALL be connected with a line or visual flow
8. WHEN indicator status timeline is displayed THEN it SHALL be visible in FLH form overlay

### Requirement 24: Back Navigation

**User Story:** As a user, I want to navigate back to holdings, so that I can return to the strategy view.

#### Acceptance Criteria

1. WHEN the timeline page is displayed THEN it SHALL show a back button
2. WHEN back button is clicked THEN it SHALL navigate to `/strategies/:strategyCode`
3. WHEN navigation occurs THEN it SHALL preserve strategy context

