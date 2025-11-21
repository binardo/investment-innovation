# Requirements Document: FLH (Forward Looking Hypothesis) Add/Edit Form Overlay

## Introduction

This document specifies the FLH (Forward Looking Hypothesis) form overlay feature, which allows users to create, view, and edit Forward Looking Hypotheses for companies within a strategy. FLHs are investment hypotheses that include a description and tracking indicators, which are used to monitor investment thesis progress over time.

This feature builds upon the company timeline foundation, allowing users to capture and manage investment hypotheses directly from the company detail page.

## Requirements

### Requirement 1: FLH Form Overlay Display

**User Story:** As a user, I want to open an FLH form overlay, so that I can create or edit Forward Looking Hypotheses.

#### Acceptance Criteria

1. WHEN user clicks "Add FLH" or clicks on existing FLH event THEN it SHALL open FLH form overlay
2. WHEN overlay opens THEN it SHALL display as a modal overlay with backdrop
3. WHEN overlay opens THEN it SHALL be centered on screen
4. WHEN overlay opens THEN it SHALL be scrollable if content exceeds viewport
5. WHEN overlay is open THEN user SHALL be able to close it with close button or ESC key
6. WHEN overlay closes THEN it SHALL return focus to the triggering element

### Requirement 2: FLH Form Loading State

**User Story:** As a user, I want to see loading feedback when FLH data is being fetched, so that I know the system is working.

#### Acceptance Criteria

1. WHEN overlay opens AND FLH data exists THEN it SHALL fetch FLH data from API
2. WHEN FLH data is loading THEN it SHALL display a loading spinner
3. WHEN FLH data loads successfully THEN it SHALL populate form fields with existing data
4. WHEN FLH data does not exist THEN it SHALL display empty form in edit mode
5. WHEN FLH data fails to load THEN it SHALL display an error message

### Requirement 3: FLH Description Field

**User Story:** As a user, I want to enter or edit the FLH description, so that I can document the investment hypothesis.

#### Acceptance Criteria

1. WHEN overlay opens THEN it SHALL display a description textarea field
2. WHEN existing FLH is loaded THEN description field SHALL be populated with current description
3. WHEN description field is empty THEN save button SHALL be disabled or show validation error
4. WHEN user types in description field THEN changes SHALL be saved to form state
5. WHEN description is entered THEN it SHALL support multi-line text input
6. WHEN description is saved THEN it SHALL be persisted to backend

### Requirement 4: FLH Description Version History

**User Story:** As a user, I want to see the version history of FLH descriptions, so that I can track how hypotheses have evolved.

#### Acceptance Criteria

1. WHEN FLH has description versions THEN overlay SHALL display version history section
2. WHEN versions are displayed THEN they SHALL show date and text for each version
3. WHEN user views version history THEN it SHALL be displayed in chronological order (newest first)
4. WHEN version history is displayed THEN user SHALL be able to expand/collapse it

### Requirement 5: Tracking Indicators Management

**User Story:** As a user, I want to add, edit, and remove tracking indicators, so that I can monitor specific aspects of the investment hypothesis.

#### Acceptance Criteria

1. WHEN overlay opens THEN it SHALL display a list of tracking indicators
2. WHEN existing FLH is loaded THEN indicators SHALL be populated from FLH data
3. WHEN no indicators exist THEN it SHALL display one empty indicator row
4. WHEN user clicks "Add Indicator" THEN a new empty indicator SHALL be added
5. WHEN user enters indicator text THEN it SHALL be saved to form state
6. WHEN user deletes an indicator THEN it SHALL be removed from the list
7. WHEN indicator text is empty THEN that indicator SHALL not be saved (filtered out on save)

### Requirement 6: Indicator Status Management

**User Story:** As a user, I want to set status for each indicator, so that I can track the health of different aspects of the hypothesis.

#### Acceptance Criteria

1. WHEN indicator is displayed THEN it SHALL show a status selector
2. WHEN status options are available THEN user SHALL be able to select: Green, Yellow, Orange, Red, or None
3. WHEN status is selected THEN it SHALL be saved to form state
4. WHEN status is displayed THEN it SHALL show color-coded badge or indicator
5. WHEN status is None THEN indicator SHALL not show status badge

### Requirement 7: Indicator Include in Overall Status

**User Story:** As a user, I want to control which indicators contribute to overall FLH status, so that I can focus on key metrics.

#### Acceptance Criteria

1. WHEN indicator is displayed THEN it SHALL show a checkbox for "Include in Overall Status"
2. WHEN checkbox is checked THEN that indicator SHALL contribute to overall status calculation
3. WHEN checkbox is unchecked THEN that indicator SHALL not contribute to overall status
4. WHEN default is applied THEN checkbox SHALL be checked by default for new indicators
5. WHEN existing FLH is loaded THEN checkbox state SHALL reflect saved preference

### Requirement 8: Indicator Version History

**User Story:** As a user, I want to see how indicators have changed over time, so that I can track evolution of tracking criteria.

#### Acceptance Criteria

1. WHEN indicator has version history THEN it SHALL display version information
2. WHEN versions are displayed THEN they SHALL show date and text for each version
3. WHEN indicator status history exists THEN it SHALL display status changes over time
4. WHEN status history is displayed THEN it SHALL show date, status, and commentary for each change
5. WHEN version history is displayed THEN user SHALL be able to expand/collapse it
6. WHEN status history is displayed THEN it SHALL show a timeline of status dots
7. WHEN status dots are displayed THEN they SHALL be color-coded: Green, Yellow, Orange, Red
8. WHEN status dots are displayed THEN they SHALL be positioned chronologically along a timeline
9. WHEN user hovers over status dot THEN it SHALL show tooltip with date, status, and commentary
10. WHEN status changes occur THEN dots SHALL be connected with a line or visual flow

### Requirement 9: Overall FLH Status Display

**User Story:** As a user, I want to see the overall status of the FLH, so that I can quickly assess hypothesis health.

#### Acceptance Criteria

1. WHEN FLH data is loaded THEN overlay SHALL calculate and display overall status
2. WHEN overall status is calculated THEN it SHALL be based on indicators with "Include in Overall Status" checked
3. WHEN overall status is displayed THEN it SHALL show color-coded badge (Green, Yellow, Orange, Red)
4. WHEN overall status history exists THEN it SHALL display status over time
5. WHEN overall status changes THEN it SHALL be recalculated based on current indicator statuses

### Requirement 10: Last Review Information

**User Story:** As a user, I want to see when and by whom the FLH was last reviewed, so that I can track review activity.

#### Acceptance Criteria

1. WHEN FLH has last review date THEN overlay SHALL display "Last reviewed: [date] by [name]"
2. WHEN last review information is available THEN it SHALL be displayed prominently
3. WHEN last review information is not available THEN it SHALL display "Not yet reviewed" or similar
4. WHEN FLH is saved THEN last review date and name SHALL be updated if applicable

### Requirement 11: FLH Form Edit Mode

**User Story:** As a user, I want to edit FLH details, so that I can update hypotheses as new information becomes available.

#### Acceptance Criteria

1. WHEN overlay opens with existing FLH THEN it SHALL start in view mode
2. WHEN user clicks "Edit" button THEN form SHALL switch to edit mode
3. WHEN edit mode is active THEN all fields SHALL become editable
4. WHEN edit mode is active THEN "Edit" button SHALL change to "Cancel" button
5. WHEN user clicks "Cancel" THEN form SHALL revert to view mode and discard changes
6. WHEN no FLH exists THEN form SHALL start in edit mode

### Requirement 12: FLH Form Save Functionality

**User Story:** As a user, I want to save FLH changes, so that my updates are persisted.

#### Acceptance Criteria

1. WHEN user clicks "Save" button THEN form SHALL validate required fields
2. WHEN description is empty THEN save SHALL be prevented with error message
3. WHEN validation passes THEN form SHALL save data to backend
4. WHEN save is in progress THEN save button SHALL show loading state
5. WHEN save succeeds THEN overlay SHALL close and show success toast
6. WHEN save fails THEN form SHALL display error message and remain open
7. WHEN save fails THEN form SHALL not lose user's entered data
8. WHEN save succeeds THEN timeline SHALL refresh to show updated FLH

### Requirement 13: FLH Form Create Mode

**User Story:** As a user, I want to create a new FLH, so that I can document new investment hypotheses.

#### Acceptance Criteria

1. WHEN user clicks "Add FLH" THEN overlay SHALL open in create mode
2. WHEN create mode is active THEN all fields SHALL be empty and editable
3. WHEN create mode is active THEN it SHALL show one empty indicator row
4. WHEN FLH is created THEN it SHALL be associated with current strategy and SEDOL
5. WHEN FLH is created successfully THEN it SHALL appear on timeline
6. WHEN FLH creation fails THEN error message SHALL be displayed

### Requirement 14: Indicator Details Field

**User Story:** As a user, I want to add details to indicators, so that I can provide additional context.

#### Acceptance Criteria

1. WHEN indicator is displayed THEN it SHALL have an optional details field
2. WHEN details are entered THEN they SHALL be saved with the indicator
3. WHEN details are displayed THEN they SHALL be shown in indicator view
4. WHEN details field is empty THEN it SHALL not prevent saving

### Requirement 15: FLH Form Validation

**User Story:** As a user, I want clear validation feedback, so that I know what needs to be fixed before saving.

#### Acceptance Criteria

1. WHEN description is empty AND user attempts to save THEN it SHALL show "Please provide a description" error
2. WHEN validation errors exist THEN they SHALL be displayed near relevant fields
3. WHEN validation passes THEN error messages SHALL be cleared
4. WHEN form is submitted THEN all validation SHALL be performed before API call

### Requirement 16: FLH Form Optimistic Updates

**User Story:** As a user, I want immediate feedback when saving, so that the interface feels responsive.

#### Acceptance Criteria

1. WHEN user saves FLH THEN form SHALL immediately show saved state (optimistic update)
2. WHEN save API call succeeds THEN optimistic update SHALL be confirmed
3. WHEN save API call fails THEN optimistic update SHALL be rolled back
4. WHEN rollback occurs THEN form SHALL restore previous state and show error

### Requirement 17: FLH Data Refresh

**User Story:** As a user, I want to see the latest FLH data, so that I'm always working with current information.

#### Acceptance Criteria

1. WHEN overlay opens THEN it SHALL fetch fresh FLH data from API (force refresh)
2. WHEN FLH data is fetched THEN it SHALL bypass cache to ensure latest data
3. WHEN fresh data is loaded THEN form SHALL update with latest values
4. WHEN data conflicts with local changes THEN system SHALL handle conflict appropriately

### Requirement 18: FLH Form Accessibility

**User Story:** As a user with accessibility needs, I want the FLH form to be accessible, so that I can use it with assistive technologies.

#### Acceptance Criteria

1. WHEN overlay opens THEN focus SHALL move to first form field
2. WHEN overlay closes THEN focus SHALL return to triggering element
3. WHEN form fields are displayed THEN they SHALL have proper labels
4. WHEN form is navigated with keyboard THEN focus SHALL move logically
5. WHEN ESC key is pressed THEN overlay SHALL close
6. WHEN form is displayed THEN it SHALL have proper ARIA labels and roles

