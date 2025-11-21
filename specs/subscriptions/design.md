# Design Document: Subscriptions Management

## Overview

This document describes the technical design for the Subscriptions management feature, which allows users to create, view, edit, and delete email notification subscriptions. Subscriptions can be configured for different notification types and scoped to either a specific strategy or the user's watchlist.

## Architecture

### Component Structure

```
SubscriptionsPage
├── Header
│   ├── Back Button
│   ├── Title and Description
│   └── Add Subscription Button
├── Content Area
│   ├── Empty State (if no subscriptions)
│   └── Subscriptions Table
│       ├── Filter Input
│       ├── Table Header (sortable)
│       ├── Table Rows
│       └── Row Menu (Edit, Delete)
└── Add/Edit Dialog
    ├── Subscription Type Select
    ├── Email Input
    ├── Scope Select (Watchlist/Strategy)
    └── Action Buttons
```

### Data Flow

1. Page loads
2. Fetches subscription types, user subscriptions, and portfolios in parallel
3. Displays subscriptions in table
4. User clicks "Add Subscription" → Opens dialog
5. User fills form and submits → Creates subscription (optimistic update)
6. User clicks row or "Edit" → Opens dialog with pre-filled data
7. User submits → Updates subscription (optimistic update)
8. User clicks "Delete" → Removes subscription (optimistic update)

## Components and Interfaces

### SubscriptionsPage Component

**Purpose**: Main page component for subscription management.

**Props**: None

**State**:
```typescript
interface SubscriptionsPageState {
  subscriptions: Subscription[];
  subscriptionTypes: SubscriptionType[];
  portfolios: Portfolio[];
  loading: boolean;
  isDialogOpen: boolean;
  editingSubscription: Subscription | null;
  searchText: string;
  sortField: SortField | null;
  sortDirection: SortDirection;
  formData: SubscriptionFormData;
}
```

### Subscription Interface

```typescript
interface Subscription {
  subscription_id: number;
  subscription_type_id: string;
  subscription_type_name?: string;
  email: string;
  strategy_code?: string | null;
  watchlist_name?: string | null;
  created_date: string;
}
```

### SubscriptionType Interface

```typescript
interface SubscriptionType {
  subscription_type_id: string;
  subscription_type_name: string;
  description: string;
}
```

### SubscriptionFormData Interface

```typescript
interface SubscriptionFormData {
  subscription_type_id: string;
  email: string;
  scope: 'strategy' | 'watchlist';
  strategy_code: string;
}
```

## UI/UX Design

### Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Sidebar │                                                    │
│         │  [←] Subscription Management                       │
│         │  Manage your email notification preferences       │
│         │                                    [+ Add Sub]    │
│         │                                                    │
│         │  Active Subscriptions                             │
│         │  Filter: [____________]  5 of 10                  │
│         │  ┌─────────────────────────────────────────────┐ │
│         │  │ Name │ Email │ Strategy │ Actions            │ │
│         │  │ Type1│ user@ │ Strategy│ [⋮]                │ │
│         │  │ Type2│ user@ │ Watchlist│ [⋮]               │ │
│         │  └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Table Columns

1. **Name**: Subscription type name (with tooltip showing description)
2. **Email**: Email address
3. **Strategy**: Strategy name or "Watchlist"
4. **Actions**: Dropdown menu (Edit, Delete)

### Add/Edit Dialog Layout

```
┌─────────────────────────────────────────────────────────┐
│ Add New Subscription                                [×]  │
├─────────────────────────────────────────────────────────┤
│ Create a new email notification subscription            │
│                                                         │
│ Subscription Type *                                     │
│ [Select subscription type ▼]                           │
│                                                         │
│ Email Address *                                         │
│ [user@example.com________________]                      │
│                                                         │
│ Scope *                                                 │
│ [Watchlist ▼]                                           │
│   Watchlist                                             │
│   ─────────────────                                     │
│   Strategy 1                                            │
│   Strategy 2                                            │
│                                                         │
│ ─────────────────────────────────────────────────────── │
│                                    [Cancel]  [Add]      │
└─────────────────────────────────────────────────────────┘
```

### Empty State

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│         No subscriptions yet. Click "Add                │
│         Subscription" to get started.                   │
│                                                         │
│              [+ Add Your First Subscription]            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Subscription Types

**Purpose**: Define what notifications the subscription will receive.

**Display**:
- Dropdown select in dialog
- Shows subscription type name
- Tooltip on hover shows description
- Required field

**Loading**:
- Fetched from API on page load
- Cached for dialog use
- Fallback if load fails

## Email Address Input

**Purpose**: Specify email address for notifications.

**Default**: Pre-filled with current user's email from AuthContext

**Validation**:
- Required field
- Email format validation
- Error message if invalid format

**Display**:
- Text input with email type
- Placeholder: "Enter email address"

## Scope Selection

**Purpose**: Choose subscription scope (strategy or watchlist).

**Options**:
- Watchlist: Scoped to user's watchlist
- Strategy: Scoped to specific strategy

**Display**:
- Dropdown select
- Shows "Watchlist" or strategy name
- Strategies sorted alphabetically
- Separator between Watchlist and strategies

**Behavior**:
- Default: "Watchlist"
- When "Watchlist" selected: strategy_code is null, watchlist_name is set
- When strategy selected: strategy_code is set, watchlist_name is null
- Validation: Strategy must be selected if scope is "strategy"

## Table Features

### Sorting

**Sortable Columns**:
- Name: Sort by subscription type name
- Email: Sort by email address
- Strategy: Sort by strategy name or "Watchlist"

**Sort Behavior**:
- Click header to sort
- First click: ascending
- Second click: descending
- Sort indicator shows current sort column and direction
- Default: Name ascending

### Filtering

**Filter Input**:
- Text input above table
- Filters by: subscription type name, email, strategy name
- Updates table immediately
- Shows count: "X of Y"

**Filter Logic**:
- Case-insensitive matching
- Searches across all filterable fields
- Updates filtered count

## Dialog Behavior

### Opening Dialog

**Add Mode**:
- Click "Add Subscription" button
- Dialog opens with empty form
- Email pre-filled with user email
- Scope defaults to "Watchlist"

**Edit Mode**:
- Click subscription row or "Edit" in menu
- Dialog opens with pre-filled form data
- All fields populated from subscription

### Closing Dialog

**Methods**:
- Click close button (X)
- Click "Cancel" button
- Press ESC key
- Click backdrop (optional)

**Behavior**:
- Closes without saving
- Resets form state
- No confirmation needed if no changes

## Form Validation

### Validation Rules

1. **Subscription Type**: Required
   - Error: "Please select a subscription type"

2. **Email**: Required and valid format
   - Error: "Please enter an email address"
   - Error: "Please enter a valid email address"

3. **Scope**: Required
   - If scope is "strategy": Strategy must be selected
   - Error: "Please select a strategy"

### Validation Display

- Error messages displayed below relevant fields
- Errors cleared when field becomes valid
- All validation performed before save attempt
- Form cannot be submitted with validation errors

## Optimistic Updates

### Create Subscription

1. User clicks "Add"
2. Validate form
3. Create temporary subscription with temp ID
4. Add to table immediately (optimistic)
5. Close dialog
6. Show success toast
7. Make API call in background
8. Replace temp subscription with real one on success
9. Rollback and show error on failure

### Update Subscription

1. User clicks "Save"
2. Validate form
3. Update subscription in table immediately (optimistic)
4. Close dialog
5. Show success toast
6. Make API call in background
7. Update with server response on success
8. Rollback and show error on failure

### Delete Subscription

1. User clicks "Delete"
2. Remove from table immediately (optimistic)
3. Show success toast
4. Make API call in background
5. Confirm deletion on success
6. Restore and show error on failure

## API Integration

### Fetch Subscription Types

```typescript
const getSubscriptionTypes = async (): Promise<SubscriptionType[]>
```

**Endpoint**: `GET /api/subscription-types`

**Caching**: Cache for session

### Fetch Subscriptions

```typescript
const getSubscriptions = async (): Promise<Subscription[]>
```

**Endpoint**: `GET /api/subscriptions`

**Response**: Array of user's subscriptions

### Create Subscription

```typescript
const createSubscription = async (request: SubscriptionCreateRequest): Promise<Subscription>
```

**Endpoint**: `POST /api/subscriptions`

**Request Body**:
```typescript
interface SubscriptionCreateRequest {
  subscription_type_id: string;
  email: string;
  strategy_code?: string | null;
  watchlist_name?: string | null;
}
```

### Update Subscription

```typescript
const updateSubscription = async (id: number, request: SubscriptionUpdateRequest): Promise<Subscription>
```

**Endpoint**: `PUT /api/subscriptions/{id}`

**Request Body**: Same as create request

### Delete Subscription

```typescript
const deleteSubscription = async (id: number): Promise<void>
```

**Endpoint**: `DELETE /api/subscriptions/{id}`

## Error Handling

### Loading Errors

- Display error message if data fails to load
- Allow user to retry
- Don't block page from displaying

### Save Errors

- Display error toast with error details
- Rollback optimistic update
- Keep form open for user to retry (if applicable)

### Validation Errors

- Display inline error messages
- Highlight invalid fields
- Prevent form submission

## Performance Considerations

1. **Data Loading**: Load subscription types and portfolios in parallel
2. **Caching**: Cache subscription types and portfolios for session
3. **Optimistic Updates**: Immediate UI feedback for better UX
4. **Debouncing**: Debounce filter input (300ms, optional)

## Accessibility

1. **Keyboard Navigation**: Tab through form fields and table
2. **Screen Readers**: ARIA labels for all form controls and table
3. **Focus Management**: Focus moves to dialog when opened, returns on close
4. **Form Labels**: Proper labels for all inputs
5. **Error Announcements**: Screen reader announcements for validation errors
6. **Dialog**: Proper ARIA dialog role and focus trap

