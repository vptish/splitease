/**
 * Bill Storage Service
 * Handles persistent storage of bills and split sessions using localforage
 */

import localforage from 'localforage';
import { Bill, SplitSession } from '../types';
import { generateId } from '../lib/generateId';

const BILLS_STORE_KEY = 'mybillsplitter2_bills';
const SPLIT_SESSIONS_KEY = 'mybillsplitter2_splitSessions';

class BillStorageService {
  /**
   * Save a new bill
   */
  async saveBill(bill: Omit<Bill, 'id' | 'createdAt' | 'updatedAt'>): Promise<Bill> {
    try {
      const bills = (await localforage.getItem<Bill[]>(BILLS_STORE_KEY)) || [];

      const newBill: Bill = {
        ...bill,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      bills.push(newBill);
      await localforage.setItem(BILLS_STORE_KEY, bills);

      return newBill;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to save bill'
      );
    }
  }

  /**
   * Get a single bill by ID
   */
  async getBill(billId: string): Promise<Bill | null> {
    try {
      const bills = (await localforage.getItem<Bill[]>(BILLS_STORE_KEY)) || [];
      const bill = bills.find(b => b.id === billId);
      return bill || null;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to get bill'
      );
    }
  }

  /**
   * Get all bills
   */
  async getAllBills(): Promise<Bill[]> {
    try {
      const bills = (await localforage.getItem<Bill[]>(BILLS_STORE_KEY)) || [];
      return bills.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to get bills'
      );
    }
  }

  /**
   * Delete a bill by ID
   */
  async deleteBill(billId: string): Promise<void> {
    try {
      const bills = (await localforage.getItem<Bill[]>(BILLS_STORE_KEY)) || [];
      const filtered = bills.filter(b => b.id !== billId);
      await localforage.setItem(BILLS_STORE_KEY, filtered);

      // Also delete associated split session
      await this.deleteSplitSession(billId);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to delete bill'
      );
    }
  }

  /**
   * Update an existing bill
   */
  async updateBill(billId: string, updates: Partial<Bill>): Promise<Bill> {
    try {
      const bills = (await localforage.getItem<Bill[]>(BILLS_STORE_KEY)) || [];
      const index = bills.findIndex(b => b.id === billId);

      if (index === -1) {
        throw new Error('Bill not found');
      }

      const updatedBill: Bill = {
        ...bills[index],
        ...updates,
        id: bills[index].id, // Ensure ID doesn't change
        createdAt: bills[index].createdAt, // Ensure createdAt doesn't change
        updatedAt: new Date().toISOString(),
      };

      bills[index] = updatedBill;
      await localforage.setItem(BILLS_STORE_KEY, bills);

      return updatedBill;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to update bill'
      );
    }
  }

  /**
   * Save a split session
   */
  async saveSplitSession(
    session: SplitSession
  ): Promise<SplitSession> {
    try {
      const sessions =
        (await localforage.getItem<SplitSession[]>(SPLIT_SESSIONS_KEY)) || [];

      sessions.push(session);
      await localforage.setItem(SPLIT_SESSIONS_KEY, sessions);

      return session;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to save split session'
      );
    }
  }

  /**
   * Get a split session by bill ID
   */
  async getSplitSession(billId: string): Promise<SplitSession | null> {
    try {
      const sessions =
        (await localforage.getItem<SplitSession[]>(SPLIT_SESSIONS_KEY)) || [];
      const session = sessions.find(s => s.billId === billId);
      return session || null;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to get split session'
      );
    }
  }

  /**
   * Update an existing split session
   */
  async updateSplitSession(
    billId: string,
    updates: Partial<SplitSession>
  ): Promise<SplitSession> {
    try {
      const sessions =
        (await localforage.getItem<SplitSession[]>(SPLIT_SESSIONS_KEY)) || [];
      const index = sessions.findIndex(s => s.billId === billId);

      if (index === -1) {
        throw new Error('Split session not found');
      }

      const updatedSession: SplitSession = {
        ...sessions[index],
        ...updates,
      };

      sessions[index] = updatedSession;
      await localforage.setItem(SPLIT_SESSIONS_KEY, sessions);

      return updatedSession;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to update split session'
      );
    }
  }

  /**
   * Delete a split session by bill ID
   */
  async deleteSplitSession(billId: string): Promise<void> {
    try {
      const sessions =
        (await localforage.getItem<SplitSession[]>(SPLIT_SESSIONS_KEY)) || [];
      const filtered = sessions.filter(s => s.billId !== billId);
      await localforage.setItem(SPLIT_SESSIONS_KEY, filtered);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to delete split session'
      );
    }
  }
}

export const billStorageService = new BillStorageService();
