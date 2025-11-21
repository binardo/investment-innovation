# Requirements Document: Subscriptions Management

## Introduction

This document specifies the Subscriptions management feature, which allows users to create, view, edit, and delete email notification subscriptions. Subscriptions can be configured for different notification types and scoped to either a specific strategy or the user's watchlist.

This feature builds upon the app setup foundation, providing users with control over email notifications they receive about investment activities.

## Requirements

### Requirement 1: Subscriptions Page Display

**User Story:** As a user, I want to see my subscriptions, so that I can manage my email notification preferences.

#### Acceptance Criteria

1. WHEN user navigates to `/subscriptions` THEN it SHALL display the subscriptions page
2. WHEN subscriptions are loading THEN it SHALL display a loading spinner
3. WHEN subscriptions fail to load THEN it SHALL display an error message
4. WHEN subscriptions page loads THEN it SHALL display "Subscription Management" as page title
5. WHEN subscriptions page loads THEN it SHALL show description: "Manage your email notification preferences"

### Requirement 2: Subscriptions Table Display

**User Story:** As a user, I want to see my subscriptions in a table, so that I can quickly review them.

#### Acceptance Criteria

1. WHEN subscriptions exist THEN they SHALL be displayed in a table format
2. WHEN subscriptions table is displayed THEN it SHALL show columns: Name, Email, Strategy
3. WHEN subscription name is displayed THEN it SHALL show subscription type name
4. WHEN subscription email is displayed THEN it SHALL show the email address
5. WHEN subscription strategy is displayed THEN it SHALL show strategy name or "Watchlist"
6. WHEN no subscriptions exist THEN it SHALL display empty state with "Add Subscription" button

### Requirement 3: Subscription Type Display

**User Story:** As a user, I want to see what type of subscription each is, so that I understand what notifications I'll receive.

#### Acceptance Criteria

1. WHEN subscription type is displayed THEN it SHALL show subscription type name
2. WHEN user hovers over subscription type THEN it SHALL show tooltip with description
3. WHEN subscription type description is long THEN tooltip SHALL wrap text appropriately
4. WHEN subscription types are loaded THEN they SHALL be fetched from API

### Requirement 4: Subscription Scope Display

**User Story:** As a user, I want to see the scope of each subscription, so that I know what it covers.

#### Acceptance Criteria

1. WHEN subscription has strategy_code THEN it SHALL display strategy name
2. WHEN subscription has watchlist_name THEN it SHALL display "Watchlist"
3. WHEN subscription scope is displayed THEN it SHALL be clear whether it's strategy or watchlist
4. WHEN strategy name cannot be found THEN it SHALL display strategy code as fallback

### Requirement 5: Add Subscription

**User Story:** As a user, I want to add new subscriptions, so that I can receive notifications about investment activities.

#### Acceptance Criteria

1. WHEN subscriptions page is displayed THEN it SHALL show "Add Subscription" button
2. WHEN "Add Subscription" is clicked THEN it SHALL open add subscription dialog
3. WHEN dialog opens THEN it SHALL display form fields: Subscription Type, Email, Scope
4. WHEN dialog opens THEN email field SHALL be pre-filled with current user's email
5. WHEN dialog opens THEN scope SHALL default to "Watchlist"
6. WHEN form is submitted THEN it SHALL create new subscription
7. WHEN subscription is created THEN it SHALL appear in table immediately (optimistic update)
8. WHEN subscription creation succeeds THEN success toast SHALL be displayed
9. WHEN subscription creation fails THEN error toast SHALL be displayed and update rolled back

### Requirement 6: Subscription Type Selection

**User Story:** As a user, I want to select a subscription type, so that I can choose what notifications to receive.

#### Acceptance Criteria

1. WHEN add/edit dialog is displayed THEN it SHALL show subscription type dropdown
2. WHEN dropdown is opened THEN it SHALL display all available subscription types
3. WHEN subscription types are displayed THEN they SHALL show type name
4. WHEN subscription type is selected THEN it SHALL be saved to form state
5. WHEN subscription type is required THEN form SHALL validate that it's selected
6. WHEN validation fails THEN error message SHALL be displayed: "Please select a subscription type"

### Requirement 7: Email Address Input

**User Story:** As a user, I want to specify an email address for subscriptions, so that notifications are sent to the right place.

#### Acceptance Criteria

1. WHEN add/edit dialog is displayed THEN it SHALL show email input field
2. WHEN dialog opens for new subscription THEN email SHALL be pre-filled with user's email
3. WHEN email is entered THEN it SHALL be validated for proper email format
4. WHEN email is required THEN form SHALL validate that it's provided
5. WHEN validation fails THEN error message SHALL be displayed: "Please enter an email address"
6. WHEN email format is invalid THEN validation error SHALL be displayed

### Requirement 8: Subscription Scope Selection

**User Story:** As a user, I want to choose subscription scope, so that I can target notifications to specific strategies or my watchlist.

#### Acceptance Criteria

1. WHEN add/edit dialog is displayed THEN it SHALL show scope dropdown
2. WHEN scope options are available THEN user SHALL be able to select: "Watchlist" or a specific strategy
3. WHEN "Watchlist" is selected THEN subscription SHALL be scoped to watchlist
4. WHEN strategy is selected THEN subscription SHALL be scoped to that strategy
5. WHEN strategy scope is selected AND no strategy chosen THEN form SHALL show validation error
6. WHEN validation fails THEN error message SHALL be displayed: "Please select a strategy"

### Requirement 9: Strategy Selection in Scope

**User Story:** As a user, I want to select a specific strategy for subscription scope, so that I can target notifications precisely.

#### Acceptance Criteria

1. WHEN scope dropdown shows strategies THEN it SHALL list all available strategies
2. WHEN strategies are displayed THEN they SHALL be sorted alphabetically by name
3. WHEN strategy is selected THEN it SHALL be saved to form state
4. WHEN strategy is selected THEN strategy_code SHALL be stored with subscription
5. WHEN watchlist is selected THEN strategy_code SHALL be null and watchlist_name SHALL be set

### Requirement 10: Edit Subscription

**User Story:** As a user, I want to edit existing subscriptions, so that I can update my notification preferences.

#### Acceptance Criteria

1. WHEN subscription row is clicked THEN it SHALL open edit dialog
2. WHEN subscription row menu is opened THEN it SHALL show "Edit" option
3. WHEN "Edit" is clicked THEN it SHALL open edit dialog with subscription data pre-filled
4. WHEN edit dialog opens THEN form fields SHALL be populated with current subscription values
5. WHEN form is submitted THEN it SHALL update existing subscription
6. WHEN subscription is updated THEN table SHALL update immediately (optimistic update)
7. WHEN update succeeds THEN success toast SHALL be displayed
8. WHEN update fails THEN error toast SHALL be displayed and update rolled back

### Requirement 11: Delete Subscription

**User Story:** As a user, I want to delete subscriptions, so that I can stop receiving unwanted notifications.

#### Acceptance Criteria

1. WHEN subscription row menu is opened THEN it SHALL show "Delete" option
2. WHEN "Delete" is clicked THEN subscription SHALL be removed from table immediately (optimistic update)
3. WHEN delete succeeds THEN success toast SHALL be displayed: "Subscription removed"
4. WHEN delete fails THEN subscription SHALL be restored and error toast displayed
5. WHEN delete action is performed THEN confirmation SHALL not be required (optimistic update pattern)

### Requirement 12: Subscription Filtering

**User Story:** As a user, I want to filter subscriptions, so that I can quickly find specific subscriptions.

#### Acceptance Criteria

1. WHEN subscriptions table is displayed THEN it SHALL show a filter input field
2. WHEN user types in filter field THEN it SHALL filter by subscription type name, email, or strategy
3. WHEN filter is applied THEN table SHALL update immediately
4. WHEN filter matches are found THEN count SHALL be displayed (e.g., "5 of 10")
5. WHEN no matches are found THEN it SHALL display "No subscriptions match your search"

### Requirement 13: Subscription Sorting

**User Story:** As a user, I want to sort subscriptions, so that I can organize them in a useful way.

#### Acceptance Criteria

1. WHEN table headers are clicked THEN it SHALL toggle sort direction
2. WHEN "Name" header is clicked THEN it SHALL sort by subscription type name
3. WHEN "Email" header is clicked THEN it SHALL sort by email address
4. WHEN "Strategy" header is clicked THEN it SHALL sort by strategy name or "Watchlist"
5. WHEN sort is applied THEN table SHALL update immediately
6. WHEN sort direction changes THEN sort indicator SHALL update
7. WHEN default sort is applied THEN it SHALL sort by Name ascending

### Requirement 14: Subscription Types Loading

**User Story:** As a user, I want subscription types to load, so that I can see available notification types.

#### Acceptance Criteria

1. WHEN subscriptions page loads THEN it SHALL fetch subscription types from API
2. WHEN subscription types are loaded THEN they SHALL be available in dropdown
3. WHEN subscription types fail to load THEN error message SHALL be displayed
4. WHEN subscription types are displayed THEN they SHALL show name and description

### Requirement 15: Portfolios Loading for Strategy Selection

**User Story:** As a user, I want to see available strategies, so that I can select one for subscription scope.

#### Acceptance Criteria

1. WHEN subscriptions page loads THEN it SHALL fetch portfolios from API
2. WHEN portfolios are loaded THEN they SHALL be available in strategy dropdown
3. WHEN portfolios are displayed THEN they SHALL be sorted alphabetically by name
4. WHEN portfolios fail to load THEN error message SHALL be displayed

### Requirement 16: Subscription Form Validation

**User Story:** As a user, I want clear validation feedback, so that I know what needs to be fixed.

#### Acceptance Criteria

1. WHEN subscription type is not selected AND form is submitted THEN it SHALL show error: "Please select a subscription type"
2. WHEN email is empty AND form is submitted THEN it SHALL show error: "Please enter an email address"
3. WHEN email format is invalid AND form is submitted THEN it SHALL show email format error
4. WHEN scope is strategy AND no strategy selected THEN it SHALL show error: "Please select a strategy"
5. WHEN validation errors exist THEN they SHALL be displayed near relevant fields
6. WHEN validation passes THEN error messages SHALL be cleared

### Requirement 17: Subscription Optimistic Updates

**User Story:** As a user, I want immediate feedback when managing subscriptions, so that the interface feels responsive.

#### Acceptance Criteria

1. WHEN subscription is created THEN it SHALL appear in table immediately (optimistic update)
2. WHEN subscription is updated THEN table SHALL update immediately (optimistic update)
3. WHEN subscription is deleted THEN it SHALL be removed immediately (optimistic update)
4. WHEN API call succeeds THEN optimistic update SHALL be confirmed
5. WHEN API call fails THEN optimistic update SHALL be rolled back
6. WHEN rollback occurs THEN previous state SHALL be restored and error displayed

### Requirement 18: Subscription Empty State

**User Story:** As a user, I want helpful guidance when I have no subscriptions, so that I know how to get started.

#### Acceptance Criteria

1. WHEN no subscriptions exist THEN it SHALL display empty state message
2. WHEN empty state is displayed THEN message SHALL say: "No subscriptions yet. Click 'Add Subscription' to get started."
3. WHEN empty state is displayed THEN it SHALL show "Add Your First Subscription" button
4. WHEN button is clicked THEN it SHALL open add subscription dialog

### Requirement 19: Back Navigation

**User Story:** As a user, I want to navigate back from subscriptions page, so that I can return to previous page.

#### Acceptance Criteria

1. WHEN subscriptions page is displayed THEN it SHALL show a back button
2. WHEN back button is clicked THEN it SHALL navigate to previous page in history
3. WHEN navigation occurs THEN browser history SHALL be used

### Requirement 20: Subscription Dialog Close

**User Story:** As a user, I want to close subscription dialogs, so that I can cancel changes.

#### Acceptance Criteria

1. WHEN subscription dialog is open THEN it SHALL show close button (X)
2. WHEN close button is clicked THEN dialog SHALL close without saving
3. WHEN ESC key is pressed THEN dialog SHALL close without saving
4. WHEN backdrop is clicked THEN dialog SHALL close without saving
5. WHEN dialog closes THEN form state SHALL be reset

### Requirement 21: Subscription Data Refresh

**User Story:** As a user, I want to see the latest subscription data, so that I'm always working with current information.

#### Acceptance Criteria

1. WHEN subscriptions page loads THEN it SHALL fetch fresh data from API
2. WHEN subscription types are loaded THEN they SHALL be cached appropriately
3. WHEN portfolios are loaded THEN they SHALL be cached appropriately
4. WHEN data is stale THEN it SHALL be refreshed automatically

