import { create } from "zustand";

// Define the type for the store's state and actions
type role = "customer" | "driver" | "admin" | "restaurant" | null;
interface AuthState {
  isLoggedIn: boolean;
  role: role; // "user", "rider", "owner", or null if not logged in
  logIn: (role: role) => void; // Pass the role on login
  logout: () => void;
}

// Create the Zustand store
const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false, // Initial state
  role: null,
  logIn: (role) => {
    set({ isLoggedIn: true, role });
  },
  logout: () => {
    set({ isLoggedIn: false, role: null });
    localStorage.removeItem("token");
  },
}));

export default useAuthStore;
