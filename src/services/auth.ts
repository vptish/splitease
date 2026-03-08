/**
 * Authentication Service
 * Handles user authentication with mock implementations and localforage persistence
 */

import localforage from 'localforage';
import { User } from '../types';
import { generateId } from '../lib/generateId';

const USERS_STORE_KEY = 'mybillsplitter2_users';
const CURRENT_USER_KEY = 'mybillsplitter2_currentUser';

interface AuthCredentials {
  email: string;
  password: string;
}

class AuthService {
  /**
   * Sign in with email and password
   */
  async signInWithEmail(credentials: AuthCredentials): Promise<User> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const users = (await localforage.getItem<User[]>(USERS_STORE_KEY)) || [];
      const user = users.find(u => u.email === credentials.email);

      if (!user) {
        throw new Error('User not found');
      }

      // Mock password validation (in real app, would hash and compare)
      if (credentials.password.length < 6) {
        throw new Error('Invalid password');
      }

      await localforage.setItem(CURRENT_USER_KEY, user);
      return user;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Sign in failed'
      );
    }
  }

  /**
   * Sign up with email and password
   */
  async signUpWithEmail(
    email: string,
    password: string,
    name: string
  ): Promise<User> {
    try {
      // Validate inputs
      if (!email || !password || !name) {
        throw new Error('All fields are required');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      if (!email.includes('@')) {
        throw new Error('Invalid email format');
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const users = (await localforage.getItem<User[]>(USERS_STORE_KEY)) || [];

      // Check if user already exists
      if (users.some(u => u.email === email)) {
        throw new Error('User already exists');
      }

      // Create new user
      const newUser: User = {
        id: generateId(),
        email,
        name,
        provider: 'email',
        verified: false,
      };

      users.push(newUser);
      await localforage.setItem(USERS_STORE_KEY, users);
      await localforage.setItem(CURRENT_USER_KEY, newUser);

      return newUser;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Sign up failed'
      );
    }
  }

  /**
   * Sign in with Google (mock implementation)
   */
  async signInWithGoogle(): Promise<User> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock user from Google
      const users = (await localforage.getItem<User[]>(USERS_STORE_KEY)) || [];

      // For demo, create or fetch a mock Google user
      let user = users.find(u => u.provider === 'google');

      if (!user) {
        user = {
          id: generateId(),
          email: 'user@gmail.com',
          name: 'Google User',
          provider: 'google',
          verified: true,
          avatarUrl: 'https://via.placeholder.com/40',
        };
        users.push(user);
        await localforage.setItem(USERS_STORE_KEY, users);
      }

      await localforage.setItem(CURRENT_USER_KEY, user);
      return user!;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Google sign in failed'
      );
    }
  }

  /**
   * Sign in with Apple (mock implementation)
   */
  async signInWithApple(): Promise<User> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const users = (await localforage.getItem<User[]>(USERS_STORE_KEY)) || [];

      // For demo, create or fetch a mock Apple user
      let user = users.find(u => u.provider === 'apple');

      if (!user) {
        user = {
          id: generateId(),
          email: 'user@apple.com',
          name: 'Apple User',
          provider: 'apple',
          verified: true,
        };
        users.push(user);
        await localforage.setItem(USERS_STORE_KEY, users);
      }

      await localforage.setItem(CURRENT_USER_KEY, user);
      return user!;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Apple sign in failed'
      );
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    try {
      await localforage.removeItem(CURRENT_USER_KEY);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Sign out failed'
      );
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const user = await localforage.getItem<User>(CURRENT_USER_KEY);
      return user || null;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }
}

export const authService = new AuthService();
