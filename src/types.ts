// ─── Split Granularity ──────────────────────────────────────────────────────
export type SplitGranularity = 'count' | 'fraction';

// ─── Person Colors (expanded palette) ───────────────────────────────────────
export const PERSON_COLORS = [
  { bg: '#3B82F6', light: '#DBEAFE', label: 'Blue' },
  { bg: '#EF4444', light: '#FEE2E2', label: 'Red' },
  { bg: '#10B981', light: '#D1FAE5', label: 'Green' },
  { bg: '#F59E0B', light: '#FEF3C7', label: 'Amber' },
  { bg: '#8B5CF6', light: '#EDE9FE', label: 'Purple' },
  { bg: '#EC4899', light: '#FCE7F3', label: 'Pink' },
  { bg: '#06B6D4', light: '#CFFAFE', label: 'Cyan' },
  { bg: '#84CC16', light: '#ECFCCB', label: 'Lime' },
] as const;

export type PersonColor = (typeof PERSON_COLORS)[number]['bg'];

// ─── Tax & Charges ──────────────────────────────────────────────────────────
export type TaxId = { type: string; value: string };
export type TaxLine = { label: string; rate?: number; amount: number; scope?: string };
export type ServiceCharge = {
  present: boolean;
  taxed: boolean;
  rate?: number;
  amount?: number;
  label?: string;
};
export type TipIncluded = { present: boolean; amount?: number | null };

// ─── Bill Item ──────────────────────────────────────────────────────────────
export type BillItem = {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  splitGranularity: SplitGranularity;
  step?: number;
};

// ─── Bill ───────────────────────────────────────────────────────────────────
export type Bill = {
  id: string;
  createdAt: string;
  updatedAt: string;
  currency: string;
  imageRef?: string;
  metadata: {
    restaurantName?: string;
    date?: string;
    time?: string;
    waiter?: string;
    address?: string;
    country?: string;
    taxIds?: TaxId[];
    phone?: string;
    email?: string;
    fiscalCode?: string;
    geo?: { lat: number; lng: number } | null;
  };
  items: BillItem[];
  subtotal?: number;
  taxMode: 'exclusive' | 'inclusive' | 'unknown';
  taxLines: TaxLine[];
  serviceCharge: ServiceCharge;
  tipIncluded: TipIncluded;
  totalDue?: number;
  rawText?: string;
};

// ─── Person ─────────────────────────────────────────────────────────────────
export type Person = {
  id: string;
  label: string;
  name?: string;
  color: PersonColor;
  number: number;
  avatar?: string;
};

// ─── Allocations ────────────────────────────────────────────────────────────
export type CountAllocation = { personId: string; units: number };
export type FractionAllocation = { personId: string; share: number };
export type ItemSplitMode = 'single' | 'equal' | 'custom';

export type ItemAssignment = {
  itemId: string;
  mode: ItemSplitMode;
  assignments: { personId: string; share: number }[];
};

export type Allocation =
  | { itemId: string; mode: 'count'; splits: CountAllocation[] }
  | { itemId: string; mode: 'fraction'; splits: FractionAllocation[] };

// ─── Split Session ──────────────────────────────────────────────────────────
export type SplitSession = {
  billId: string;
  people: Person[];
  itemAssignments: ItemAssignment[];
  tips: {
    mode: 'group' | 'individual' | 'none';
    group?: { rate: number; amount?: number };
    individual?: { personId: string; rate: number }[];
  };
  computed?: {
    perPersonTotals: PersonTotal[];
  };
};

export type PersonTotal = {
  personId: string;
  subtotal: number;
  taxes: Record<string, number>;
  service: number;
  tip: number;
  total: number;
};

// ─── Tip ────────────────────────────────────────────────────────────────────
export type TipOption = {
  label: string;
  percentage: number;
};

// ─── Auth ───────────────────────────────────────────────────────────────────
export type User = {
  id: string;
  email: string;
  name?: string;
  provider: 'email' | 'google' | 'apple';
  verified: boolean;
  avatarUrl?: string;
};

export type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
};
