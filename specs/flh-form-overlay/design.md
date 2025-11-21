# Design Document: FLH (Forward Looking Hypothesis) Form Overlay

## Overview

This document describes the technical design for the FLH (Forward Looking Hypothesis) form overlay feature, which allows users to create, view, and edit Forward Looking Hypotheses for companies within a strategy. FLHs include a description and tracking indicators with status history.

## Architecture

### Component Structure

```
FLHFormOverlay
├── Header
│   ├── Title ("Forward Looking Hypothesis" or "Edit FLH")
│   └── Close Button
├── Description Section
│   ├── Description Textarea (view/edit)
│   ├── Edit Button (if in view mode)
│   └── Description Version History (expandable)
├── Indicators Section
│   ├── Key Indicator Toggle
│   ├── Indicator List
│   │   ├── Indicator Item
│   │   │   ├── Indicator Text Input
│   │   │   ├── Status Selector
│   │   │   ├── Include in Overall Status Checkbox
│   │   │   ├── Details Field (optional)
│   │   │   ├── Status Timeline (if history exists)
│   │   │   ├── Version History (expandable)
│   │   │   └── Delete Button
│   │   └── [Add Indicator Button]
│   └── Overall Status Display
├── Last Review Section
│   └── Last Review Date and Name
└── Footer
    ├── Cancel Button (if editing)
    └── Save Button
```

### Data Flow

1. Overlay opens with `sedol` and `strategyCode`
2. Fetches FLH data from API (force refresh)
3. If FLH exists: Populates form in view mode
4. If FLH doesn't exist: Shows empty form in edit mode
5. User edits description and indicators
6. On save: Validates and saves to backend
7. Updates timeline on success

## Components and Interfaces

### FLHFormOverlay Component

**Purpose**: Modal overlay for creating/editing FLH.

**Props**:
```typescript
interface FLHFormOverlayProps {
  onClose: () => void;
  sedol: string;
  strategyCode: string;
}
```

**State**:
```typescript
interface FLHFormOverlayState {
  flhData: FLHData | null;
  loading: boolean;
  saving: boolean;
  isEditMode: boolean;
  description: string;
  lastReviewDate: string;
  lastReviewName: string;
  indicators: TrackingIndicator[];
}
```

### TrackingIndicator Interface

```typescript
interface TrackingIndicator {
  id: string;
  text: string;
  status?: 'red' | 'yellow' | 'green' | 'orange';
  details?: string;
  history?: IndicatorHistoryPoint[];
  startDate?: Date;
  versions?: IndicatorVersion[];
  include_in_overall_status?: boolean;
}
```

### FLHData Interface

```typescript
interface FLHData {
  flh_id?: string;
  description: string;
  indicators: TrackingIndicator[];
  hasExistingData?: boolean;
  descriptionVersions?: DescriptionVersion[];
  last_review_date?: string | null;
  last_review_name?: string | null;
}
```

## UI/UX Design

### Overlay Layout

```
┌─────────────────────────────────────────────────────────┐
│ Forward Looking Hypothesis                          [×]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Description                                             │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Investment hypothesis description text...           │ │
│ │                                                      │ │
│ └─────────────────────────────────────────────────────┘ │
│ [Edit] [View History ▼]                                 │
│                                                         │
│ ─────────────────────────────────────────────────────── │
│                                                         │
│ Tracking Indicators                          [Key Only]│
│                                                         │
│ Indicator 1                                            │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Indicator text...                                    │ │
│ └─────────────────────────────────────────────────────┘ │
│ Status: [Green ▼]  ☑ Include in Overall Status        │
│ ─────────────────────────────────────────────────────── │
│ ●──────●──────●──────●                                  │
│ Green  Yellow Orange Red                                │
│ [View History ▼]                              [Delete]  │
│                                                         │
│ [+ Add Indicator]                                       │
│                                                         │
│ ─────────────────────────────────────────────────────── │
│                                                         │
│ Overall Status: [Green]                                │
│                                                         │
│ ─────────────────────────────────────────────────────── │
│                                                         │
│ Last reviewed: 2024-01-15 by John Doe                  │
│                                                         │
│ ─────────────────────────────────────────────────────── │
│                                    [Cancel]  [Save]     │
└─────────────────────────────────────────────────────────┘
```

### View Mode vs Edit Mode

**View Mode** (default when FLH exists):
- Description: Read-only text
- Indicators: Read-only display
- Edit button visible
- Save button hidden

**Edit Mode** (when editing or creating):
- Description: Editable textarea
- Indicators: Editable inputs
- Cancel button visible
- Save button visible

### Description Section

**View Mode**:
- Display description as formatted text
- "Edit" button to switch to edit mode
- "View History" expandable section showing version history

**Edit Mode**:
- Large textarea for description input
- Character count (optional)
- Validation: Required field

### Indicator Management

**Adding Indicators**:
- "+ Add Indicator" button adds new empty indicator
- New indicator starts with empty text, no status, include_in_overall_status checked

**Editing Indicators**:
- Text input for indicator description
- Status dropdown: None, Green, Yellow, Orange, Red
- Checkbox for "Include in Overall Status"
- Optional details field
- Delete button to remove indicator

**Indicator Display**:
- Shows indicator text
- Status badge (color-coded)
- Include checkbox state
- Status timeline if history exists
- Version history expandable section

### Status Timeline Display

**Visual Design**:
```
─────────────────────────────────────────────
●──────●──────●──────●──────●
Green  Yellow Orange Red   Green
2024-01 2024-03 2024-05 2024-07 2024-09
```

**Features**:
- Horizontal timeline with color-coded dots
- Dots positioned chronologically
- Line connecting dots
- Tooltip on hover: date, status, commentary
- Expandable section

### Overall Status Calculation

**Logic**:
- Only considers indicators with `include_in_overall_status: true`
- Determines worst status among included indicators
- Priority: Red > Orange > Yellow > Green
- Displays color-coded badge

**Display**:
- Large badge showing overall status
- Color: Green, Yellow, Orange, or Red
- Updates when indicator statuses change

### Key Indicator Toggle

**Purpose**: Filter to show only key indicators.

**Location**: Top of indicators section

**Behavior**:
- Toggle button/checkbox
- When enabled: Shows only indicators with `include_in_overall_status: true`
- When disabled: Shows all indicators
- Updates display immediately

## API Integration

### Fetch FLH

```typescript
const fetchFLH = async (sedol: string, strategyCode: string, forceRefresh?: boolean): Promise<FLHData | null>
```

**Endpoint**: `GET /api/flh/{sedol}?strategy_code={strategyCode}`

**Force Refresh**: Bypasses cache to ensure latest data

**Response**: FLHData object or null if no FLH exists

### Create FLH

```typescript
const createFLH = async (sedol: string, strategyCode: string, data: FLHCreateRequest): Promise<FLHData>
```

**Endpoint**: `POST /api/flh`

**Request Body**:
```typescript
interface FLHCreateRequest {
  sedol: string;
  strategy_code: string;
  description: string;
  indicators: TrackingIndicator[];
}
```

### Update FLH

```typescript
const updateFLH = async (flhId: string, data: FLHUpdateRequest): Promise<FLHData>
```

**Endpoint**: `PUT /api/flh/{flhId}`

**Request Body**:
```typescript
interface FLHUpdateRequest {
  description: string;
  indicators: TrackingIndicator[];
  last_review_date?: string;
  last_review_name?: string;
}
```

## Validation

### Description Validation

- Required field
- Cannot be empty or whitespace only
- Error message: "Please provide a description"

### Indicator Validation

- Indicator text can be empty (filtered out on save)
- No minimum number of indicators required
- Status is optional

### Save Validation

- Description must be provided
- All validation errors displayed before save attempt
- Form remains open if validation fails

## Optimistic Updates

**Pattern**:
1. User clicks Save
2. Immediately show saved state (optimistic update)
3. Make API call in background
4. On success: Confirm optimistic update
5. On failure: Rollback and show error

**Rollback**:
- Restore previous form state
- Display error message
- Keep form open for user to retry

## Error Handling

### Loading Errors

- Display error message if FLH fetch fails
- Allow user to retry or close overlay
- Don't block overlay from opening

### Save Errors

- Display error message near save button
- Keep form open with user's data
- Provide retry option

### Validation Errors

- Display inline error messages
- Highlight invalid fields
- Prevent save until validation passes

## Performance Considerations

1. **Force Refresh**: Always fetch fresh data when overlay opens
2. **Memoization**: Memoize status calculations
3. **Debouncing**: Debounce indicator text input (optional)
4. **Lazy Loading**: Load version history on expand

## Accessibility

1. **Focus Management**: Focus moves to first field when overlay opens
2. **Keyboard Navigation**: Tab through form fields, ESC to close
3. **Screen Readers**: ARIA labels for all form controls
4. **Form Labels**: Proper labels for all inputs
5. **Error Announcements**: Screen reader announcements for validation errors

