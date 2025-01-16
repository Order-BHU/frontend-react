import { create } from "zustand";

// Define the AuthState interface
interface AuthState {
  isLoggedIn: boolean;
  role: string | null; // "user", "rider", "owner", or null if not logged in
  logIn: (role: string) => void; // Pass the role on login
  logout: () => void;
}

// Create the Zustand store
const useAuthStore = create<AuthState>((set) => {
  // Check localStorage for saved state
  const savedAuth = JSON.parse(localStorage.getItem("authState") || "{}");

  return {
    isLoggedIn: savedAuth?.isLoggedIn || false, // Load saved isLoggedIn state
    role: savedAuth?.role || null, // Load saved role state

    // Log in and save the state to localStorage
    logIn: (role) => {
      const newState = { isLoggedIn: true, role };
      set(newState);
      localStorage.setItem("authState", JSON.stringify(newState));
    },

    // Log out and clear the state from localStorage
    logout: () => {
      const newState = { isLoggedIn: false, role: null };
      set(newState);
      localStorage.removeItem("authState");
      localStorage.removeItem("token");
      localStorage.removeItem("name");
    },
  };
});

export default useAuthStore;
