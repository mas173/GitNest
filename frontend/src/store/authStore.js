import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginUser, registerUser, getMe } from '../api/authApi';

/**
 * Helper function to extract and validate user data from API response
 * Ensures safe access to nested data structure
 */
const extractUserData = (responseData) => {
  if (!responseData || !responseData.data) {
    return null;
  }
  const { _id, username, email, token } = responseData.data;
  return { _id, username, email, token };
};

/**
 * Extract message from normalized API errors
 */
const extractErrorMessage = (error) => {
  if (error?.errors && Array.isArray(error.errors) && error.errors.length > 0) {
    return error.errors.map((err) => err.message).join(', ');
  }
  return error?.message || 'An error occurred';
};

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      /**
       * Login with email and password
       * Stores user data and token in persistent storage
       */
      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const res = await loginUser({ email, password });
          const userData = extractUserData(res);

          if (!userData?.token) {
            throw new Error('Invalid response: token not found');
          }

          set({
            user: { _id: userData._id, username: userData.username, email: userData.email },
            token: userData.token,
            isAuthenticated: true,
            loading: false,
          });
        } catch (error) {
          const errorMessage = extractErrorMessage(error);
          set({
            error: errorMessage,
            loading: false,
          });
          throw error;
        }
      },

      /**
       * Register with username, email, and password
       * Automatically logs in user after successful registration
       */
      register: async (userData) => {
        set({ loading: true, error: null });
        try {
          const res = await registerUser(userData);
          const extractedData = extractUserData(res);

          if (!extractedData?.token) {
            throw new Error('Invalid response: token not found');
          }

          set({
            user: {
              _id: extractedData._id,
              username: extractedData.username,
              email: extractedData.email,
            },
            token: extractedData.token,
            isAuthenticated: true,
            loading: false,
          });
        } catch (error) {
          const errorMessage = extractErrorMessage(error);
          set({
            error: errorMessage,
            loading: false,
          });
          throw error;
        }
      },

      /**
       * Logout: Clear all auth state
       */
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false, error: null });
      },

      /**
       * Clear error message
       */
      clearError: () => {
        set({ error: null });
      },

      /**
       * Check authentication: Verify token is still valid with backend
       * Called on app initialization to restore auth state safely
       */
      checkAuth: async () => {
        set({ loading: true, error: null });
        try {
          const res = await getMe();
          if (res.data) {
            set({
              user: res.data,
              isAuthenticated: true,
              loading: false,
            });
          } else {
            throw new Error('Invalid response structure');
          }
        } catch {
          // Token is invalid or expired - clear auth state
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage', // local storage key
    }
  )
);
