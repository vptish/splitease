/**
 * Bill Zustand Store
 * Manages bills state and operations
 */

import { create } from 'zustand';
import { Bill } from '../types';
import { billStorageService } from '../services/billStorage';

interface BillState {
  bills: Bill[];
  currentBill: Bill | null;
  loading: boolean;
  error: string | null;
}

interface BillActions {
  loadBills: (userId: string) => Promise<void>;
  createBill: (bill: Omit<Bill, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Bill>;
  updateBill: (billId: string, updates: Partial<Bill>) => Promise<void>;
  deleteBill: (billId: string) => Promise<void>;
  setCurrentBill: (bill: Bill | null) => void;
}

type BillStore = BillState & BillActions;

export const useBillStore = create<BillStore>((set) => ({
  // Initial state
  bills: [],
  currentBill: null,
  loading: false,
  error: null,

  // Actions
  loadBills: async () => {
    set({ loading: true, error: null });
    try {
      const bills = await billStorageService.getAllBills();
      set({
        bills,
        loading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to load bills';
      set({
        bills: [],
        loading: false,
        error: errorMessage,
      });
    }
  },

  createBill: async (bill: Omit<Bill, 'id' | 'createdAt' | 'updatedAt'>) => {
    set({ loading: true, error: null });
    try {
      const newBill = await billStorageService.saveBill(bill);
      set((state) => ({
        bills: [newBill, ...state.bills],
        loading: false,
        error: null,
      }));
      return newBill;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create bill';
      set({
        loading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  updateBill: async (billId: string, updates: Partial<Bill>) => {
    set({ loading: true, error: null });
    try {
      const updatedBill = await billStorageService.updateBill(billId, updates);
      set((state) => ({
        bills: state.bills.map((b) =>
          b.id === billId ? updatedBill : b
        ),
        currentBill: state.currentBill?.id === billId ? updatedBill : state.currentBill,
        loading: false,
        error: null,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update bill';
      set({
        loading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  deleteBill: async (billId: string) => {
    set({ loading: true, error: null });
    try {
      await billStorageService.deleteBill(billId);
      set((state) => ({
        bills: state.bills.filter((b) => b.id !== billId),
        currentBill: state.currentBill?.id === billId ? null : state.currentBill,
        loading: false,
        error: null,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to delete bill';
      set({
        loading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  setCurrentBill: (bill: Bill | null) => {
    set({
      currentBill: bill,
      error: null,
    });
  },
}));
