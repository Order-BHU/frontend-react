import { create } from "zustand";

// Define the type for the store's state and actions
interface AuthState {
  isLoggedIn: boolean;
  role: string | null; // "user", "rider", "owner", or null if not logged in
  logIn: (role: string) => void; // Pass the role on login
  logOut: () => void;
  setRole: (role: string) => void; // For updating the role dynamically
}

// Create the Zustand store
const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: true, // Initial state
  role: "rider",
  logIn: (role) => {
    set({ isLoggedIn: true, role });
  },
  logOut: () => {
    set({ isLoggedIn: false, role: null });
  },
  setRole: (role) => {
    set({ role });
  },
}));

export default useAuthStore;
