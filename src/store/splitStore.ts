/**
 * Split Session Zustand Store
 * Manages bill splitting state and calculations
 */

import { create } from 'zustand';
import {
  Person,
  SplitSession,
  ItemAssignment,
  PERSON_COLORS,
  Bill,
  PersonTotal,
} from '../types';
import { billStorageService } from '../services/billStorage';
import { generateId } from '../lib/generateId';

interface SplitState {
  session: SplitSession | null;
  people: Person[];
  itemAssignments: ItemAssignment[];
  tipMode: 'group' | 'individual' | 'none';
  tipValue?: number;
  loading: boolean;
  error: string | null;
}

interface SplitActions {
  initSession: (billId: string, bill: Bill) => Promise<void>;
  addPerson: (name: string) => void;
  removePerson: (personId: string) => void;
  assignItem: (itemId: string, mode: 'single' | 'equal' | 'custom', assignments: { personId: string; share: number }[]) => void;
  setTipMode: (mode: 'group' | 'individual' | 'none') => void;
  setTipValue: (value: number) => void;
  computeTotals: (bill: Bill) => PersonTotal[];
  saveSession: (billId: string, bill: Bill) => Promise<void>;
  clearSession: () => void;
}

type SplitStore = SplitState & SplitActions;

export const useSplitStore = create<SplitStore>((set, get) => ({
  // Initial state
  session: null,
  people: [],
  itemAssignments: [],
  tipMode: 'group',
  tipValue: 0,
  loading: false,
  error: null,

  // Actions
  initSession: async (billId: string) => {
    set({ loading: true, error: null });
    try {
      // Try to load existing session
      let existingSession = await billStorageService.getSplitSession(billId);

      if (existingSession) {
        set({
          session: existingSession,
          people: existingSession.people,
          itemAssignments: existingSession.itemAssignments,
          loading: false,
        });
      } else {
        // Create new session with initial person
        const initialPerson: Person = {
          id: generateId(),
          label: 'Person 1',
          color: PERSON_COLORS[0].bg,
          number: 1,
        };

        const newSession: SplitSession = {
          billId,
          people: [initialPerson],
          itemAssignments: [],
          tips: {
            mode: 'group',
          },
        };

        set({
          session: newSession,
          people: [initialPerson],
          itemAssignments: [],
          tipMode: 'group',
          tipValue: 0,
          loading: false,
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to initialize session';
      set({
        loading: false,
        error: errorMessage,
      });
    }
  },

  addPerson: () => {
    set((state) => {
      const newPerson: Person = {
        id: generateId(),
        label: `Person ${state.people.length + 1}`,
        color: PERSON_COLORS[state.people.length % PERSON_COLORS.length].bg,
        number: state.people.length + 1,
      };

      const updatedPeople = [...state.people, newPerson];

      return {
        people: updatedPeople,
        session: state.session
          ? { ...state.session, people: updatedPeople }
          : null,
      };
    });
  },

  removePerson: (personId: string) => {
    set((state) => {
      const updatedPeople = state.people.filter((p) => p.id !== personId);
      const updatedAssignments = state.itemAssignments.map((a) => ({
        ...a,
        assignments: a.assignments.filter((x) => x.personId !== personId),
      })).filter((a) => a.assignments.length > 0);

      return {
        people: updatedPeople,
        itemAssignments: updatedAssignments,
        session: state.session
          ? {
              ...state.session,
              people: updatedPeople,
              itemAssignments: updatedAssignments,
            }
          : null,
      };
    });
  },

  assignItem: (itemId: string, mode: 'single' | 'equal' | 'custom', assignments: { personId: string; share: number }[]) => {
    set((state) => {
      let updatedAssignments = [...state.itemAssignments];

      // Remove existing assignment for this item
      updatedAssignments = updatedAssignments.filter(
        (a) => a.itemId !== itemId
      );

      // Add new assignment if assignments is not empty
      if (assignments.length > 0) {
        updatedAssignments.push({
          itemId,
          mode,
          assignments,
        });
      }

      return {
        itemAssignments: updatedAssignments,
        session: state.session
          ? {
              ...state.session,
              itemAssignments: updatedAssignments,
            }
          : null,
      };
    });
  },

  setTipMode: (mode: 'group' | 'individual' | 'none') => {
    set((state) => ({
      tipMode: mode,
      session: state.session ? { ...state.session, tips: { mode } } : null,
    }));
  },

  setTipValue: (value: number) => {
    set((state) => ({
      tipValue: value,
      session: state.session
        ? {
            ...state.session,
            tips: {
              ...state.session.tips,
              group: value > 0 ? { rate: 0, amount: value } : undefined,
            },
          }
        : null,
    }));
  },

  computeTotals: (bill: Bill): PersonTotal[] => {
    const state = get();
    const { people, itemAssignments } = state;

    // Initialize totals for each person
    const personTotals: Record<string, number> = {};
    const personTaxes: Record<string, Record<string, number>> = {};
    people.forEach((person) => {
      personTotals[person.id] = 0;
      personTaxes[person.id] = {};
    });

    // Calculate subtotal for tax allocation
    const billSubtotal = bill.subtotal || bill.items.reduce((sum, item) => sum + item.lineTotal, 0);

    // Assign items to people
    bill.items.forEach((item) => {
      const assignment = itemAssignments.find((a) => a.itemId === item.id);

      if (assignment) {
        // Split according to assignments
        assignment.assignments.forEach((alloc) => {
          personTotals[alloc.personId] =
            (personTotals[alloc.personId] || 0) + (item.lineTotal * alloc.share);
        });
      } else {
        // Unassigned items split equally
        const perPerson = item.lineTotal / people.length;
        people.forEach((person) => {
          personTotals[person.id] =
            (personTotals[person.id] || 0) + perPerson;
        });
      }
    });

    // Add taxes - allocate proportionally to each person's subtotal share
    let totalTaxes = 0;
    bill.taxLines.forEach((taxLine) => {
      totalTaxes += taxLine.amount;
    });

    if (totalTaxes > 0 && billSubtotal > 0) {
      bill.taxLines.forEach((taxLine) => {
        people.forEach((person) => {
          const personShare = (personTotals[person.id] / billSubtotal) * taxLine.amount;
          if (!personTaxes[person.id]) {
            personTaxes[person.id] = {};
          }
          personTaxes[person.id][taxLine.label] = (personTaxes[person.id][taxLine.label] || 0) + personShare;
        });
      });
    }

    // Calculate service charge
    let serviceAmount = 0;
    if (bill.serviceCharge.present) {
      serviceAmount = bill.serviceCharge.amount || 0;
    }

    const perPersonService = people.length > 0 ? serviceAmount / people.length : 0;

    // Calculate tip per person
    let tipPerPerson = 0;
    if (bill.tipIncluded.present && bill.tipIncluded.amount) {
      tipPerPerson = people.length > 0 ? bill.tipIncluded.amount / people.length : 0;
    }

    // Build result
    const result: PersonTotal[] = people.map((person) => {
      const subtotal = personTotals[person.id] || 0;
      const taxes = personTaxes[person.id] || {};
      const taxesSum = Object.values(taxes).reduce((a, b) => a + b, 0);
      const service = perPersonService;
      const tip = tipPerPerson;
      const total = subtotal + taxesSum + service + tip;

      return {
        personId: person.id,
        subtotal,
        taxes,
        service,
        tip,
        total,
      };
    });

    return result;
  },

  saveSession: async (billId: string) => {
    set({ loading: true, error: null });
    try {
      const state = get();
      const sessionData: SplitSession = {
        billId,
        people: state.people,
        itemAssignments: state.itemAssignments,
        tips: {
          mode: state.tipMode,
          group: (state.tipValue ?? 0) > 0 ? { rate: 0, amount: state.tipValue ?? 0 } : undefined,
        },
      };

      let savedSession: SplitSession;

      if (state.session) {
        // Update existing session
        savedSession = await billStorageService.updateSplitSession(
          billId,
          sessionData
        );
      } else {
        // Save new session
        savedSession = await billStorageService.saveSplitSession(sessionData);
      }

      set({
        session: savedSession,
        loading: false,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to save session';
      set({
        loading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  clearSession: () => {
    set({
      session: null,
      people: [],
      itemAssignments: [],
      tipMode: 'group',
      tipValue: 0,
    });
  },
}));
