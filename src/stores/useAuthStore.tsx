import { create } from "zustand";

// Define the type for the store's state and actions
interface AuthState {
  isLoggedIn: boolean;
  logIn: () => void;
  logOut: () => void;
}

// Create the Zustand store
const useAuthStore = create<AuthState>(
  (set: (partial: Partial<AuthState>) => void) => ({
    isLoggedIn: true, // Initial state
    logIn: () => {
      set({ isLoggedIn: true }); // No return value (void)
    },
    logOut: () => {
      set({ isLoggedIn: false }); // No return value (void)
    },
  })
);

export default useAuthStore;
