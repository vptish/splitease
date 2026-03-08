# MyBillSplitter2 - Core Files Summary

All core files have been created with full TypeScript typing, Zustand state management, and localforage persistence.

## File Structure

```
src/
├── types/
│   └── index.ts                 # Core type definitions
├── services/
│   ├── auth.ts                  # Authentication service
│   └── billStorage.ts           # Bill storage service with localforage
├── store/
│   ├── authStore.ts             # Zustand auth store
│   ├── billStore.ts             # Zustand bills store
│   ├── splitStore.ts            # Zustand split sessions store
│   └── themeStore.ts            # Zustand theme store
├── hooks/
│   └── useTheme.ts              # Theme hook
└── lib/
    ├── formatCurrency.ts        # Currency formatter utility
    └── generateId.ts            # ID generator utility
```

## Files Created

### 1. Types (`/src/types/index.ts`)
- `User` - User authentication data
- `BillItem`, `Bill` - Bill and items structure
- `Person`, `ItemAssignment`, `SplitSession` - Split session data
- `PersonTotal`, `SplitResult` - Calculation results
- `PERSON_COLORS` - 10 predefined colors for UI

### 2. Auth Service (`/src/services/auth.ts`)
- `signInWithEmail(credentials)` - Email sign in with validation
- `signUpWithEmail(email, password, name)` - User registration
- `signInWithGoogle()` - Mock Google OAuth
- `signInWithApple()` - Mock Apple Sign In
- `signOut()` - Clear current user
- `getCurrentUser()` - Get persisted user data
- Uses localforage for persistence with keys:
  - `mybillsplitter2_users` - User store
  - `mybillsplitter2_currentUser` - Current session user

### 3. Bill Storage Service (`/src/services/billStorage.ts`)
- `saveBill()` - Create new bill
- `getBill(billId)` - Get single bill
- `getAllBills(userId)` - Get user's bills
- `updateBill(billId, updates)` - Update bill
- `deleteBill(billId)` - Delete bill and related split session
- `saveSplitSession()` - Create split session
- `getSplitSession(billId)` - Get session for bill
- `updateSplitSession()` - Update existing session
- `deleteSplitSession()` - Delete session by bill ID
- Uses localforage for persistence with keys:
  - `mybillsplitter2_bills` - Bills store
  - `mybillsplitter2_splitSessions` - Split sessions store

### 4. Auth Store (`/src/store/authStore.ts`)
Zustand store with state and actions:
- State: `user`, `loading`, `error`, `isAuthenticated`
- Actions:
  - `signIn(email, password)`
  - `signUp(email, password, name)`
  - `signInWithGoogle()`
  - `signInWithApple()`
  - `signOut()`
  - `checkAuth()` - Restore session from storage
  - `clearError()` - Clear error message

### 5. Bill Store (`/src/store/billStore.ts`)
Zustand store for bills management:
- State: `bills[]`, `currentBill`, `loading`, `error`
- Actions:
  - `loadBills(userId)` - Load all user bills
  - `createBill()` - Create and add new bill
  - `updateBill(billId, updates)` - Update bill
  - `deleteBill(billId)` - Delete bill
  - `setCurrentBill(bill)` - Set active bill

### 6. Split Store (`/src/store/splitStore.ts`)
Zustand store for bill splitting:
- State: `session`, `people[]`, `itemAssignments[]`, `tipMode`, `tipValue`, `loading`, `error`
- Actions:
  - `initSession(billId, bill)` - Initialize or load split session
  - `addPerson()` - Add person with auto-color assignment
  - `removePerson(personId)` - Remove person and their assignments
  - `assignItem(itemId, personId, quantity)` - Assign item to person
  - `setTipMode(mode)` - Set tip calculation mode ('equal' | 'percentage' | 'custom')
  - `setTipValue(value)` - Set tip amount/percentage
  - `computeTotals(bill)` - Calculate split with tax and tip
  - `saveSession()` - Persist session to storage
  - `clearSession()` - Clear all split state

**Tip Modes:**
- `equal` - Tip split equally among people
- `percentage` - Tip as percentage of total
- `custom` - Fixed tip per person

**Split Calculation Features:**
- Assigned items to specific people
- Unassigned items split equally among all people
- Tax distribution proportional to item amount
- Tip calculation with three modes

### 7. Theme Store (`/src/store/themeStore.ts`)
Zustand store for theme management:
- State: `theme` ('light' | 'dark' | 'system'), `isDark` (boolean)
- Actions:
  - `setTheme(theme)` - Set theme and persist to localStorage
  - `toggleTheme()` - Cycle through light → dark → system
  - `initTheme()` - Initialize from storage and listen for system changes
- Persists to localStorage key: `mybillsplitter2_theme`
- Applies theme via CSS class on `document.documentElement`
- Listens for system theme changes when set to 'system'

### 8. useTheme Hook (`/src/hooks/useTheme.ts`)
React hook providing:
- `theme` - Current theme mode
- `isDark` - Computed boolean (including system preference)
- `setTheme()` - Change theme
- `toggleTheme()` - Cycle themes
- Auto-initializes on mount

### 9. formatCurrency (`/src/lib/formatCurrency.ts`)
Currency formatting utilities:
- `formatCurrency(amount, currency?)` - Basic formatter
  - Supported: ZAR, USD, EUR, GBP (default: ZAR)
  - Example: `formatCurrency(150, 'ZAR')` → "R 150.00"
  - Example: `formatCurrency(25.5, 'USD')` → "$25.50"
- `formatCurrencyLocale(amount, currency, locale?)` - Locale-aware formatting using Intl API
- `parseCurrency(currencyString)` - Parse formatted string back to number

**Currency Formats:**
| Currency | Symbol | Position | Example |
|----------|--------|----------|---------|
| ZAR      | R      | Before   | R 150.00 |
| USD      | $      | Before   | $25.50 |
| EUR      | €      | After    | 25.50 € |
| GBP      | £      | Before   | £25.50 |

### 10. generateId (`/src/lib/generateId.ts`)
ID generation utilities:
- `generateId()` - Full UUID v4 or fallback (Date + random)
- `generateShortId()` - Short alphanumeric ID (9 chars)
- `generateNanoId()` - Nano ID style, URL-safe (21 chars)

## Usage Examples

### Authentication
```typescript
import { useAuthStore } from '@/store/authStore';

const { signUp, signIn, signOut, user, isAuthenticated } = useAuthStore();

// Sign up
await signUp('user@example.com', 'password123', 'John Doe');

// Sign in
await signIn('user@example.com', 'password123');

// Sign out
await signOut();
```

### Bills Management
```typescript
import { useBillStore } from '@/store/billStore';

const { createBill, loadBills, updateBill, deleteBill } = useBillStore();

// Load bills
await loadBills(userId);

// Create bill
const bill = await createBill({
  title: 'Restaurant',
  date: Date.now(),
  currency: 'ZAR',
  items: [...],
  subtotal: 500,
  total: 575,
  userId
});
```

### Bill Splitting
```typescript
import { useSplitStore } from '@/store/splitStore';

const { initSession, addPerson, assignItem, computeTotals } = useSplitStore();

// Initialize split session
await initSession(billId, bill);

// Add people
addPerson(); // Auto-names as "Person 2", assigns color

// Assign items
assignItem(itemId, personId, quantityForThatPerson);

// Calculate totals
const result = computeTotals(bill);
// result.people = [{personId, name, color, amount}, ...]
// result.tipPerPerson = ...
```

### Theming
```typescript
import { useTheme } from '@/hooks/useTheme';

const { theme, isDark, setTheme, toggleTheme } = useTheme();

// Set theme
setTheme('dark');

// Toggle theme
toggleTheme();

// Check if dark
if (isDark) {
  // Apply dark styles
}
```

### Currency Formatting
```typescript
import { formatCurrency, formatCurrencyLocale } from '@/lib/formatCurrency';

formatCurrency(150) // "R 150.00"
formatCurrency(25.5, 'USD') // "$25.50"
formatCurrency(100, 'EUR') // "100.00 €"

formatCurrencyLocale(150, 'ZAR', 'en-ZA') // Uses Intl API
```

## Key Features

- **Full TypeScript Support**: All files are strictly typed
- **Zustand State Management**: Lightweight, hooks-based state management
- **LocalForage Persistence**: Works in browser and Node.js environments
- **Mock Authentication**: Ready for real OAuth integration
- **Advanced Split Calculation**: Handles items, tax, and multiple tip modes
- **Theme System**: Light/dark/system with persistence and system detection
- **Currency Flexibility**: Multiple currencies with locale support
- **Error Handling**: Try-catch blocks and error state in all services and stores

## Dependencies Required

```json
{
  "zustand": "^4.x",
  "localforage": "^1.x",
  "react": "^18.x"
}
```

## Next Steps

1. Install dependencies: `npm install zustand localforage`
2. Create React components using these stores and services
3. Integrate with real OAuth providers (Google, Apple)
4. Add API integration for backend persistence
5. Implement additional features (sharing, reports, etc.)
