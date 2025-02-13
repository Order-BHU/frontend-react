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
  // Define the logout function first
  const logout = () => {
    set({ isLoggedIn: false, role: null });
    localStorage.removeItem("authState");
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("restaurant_id");
    localStorage.removeItem("pfp");
  };

  // Check localStorage for saved state
  const savedAuth = JSON.parse(localStorage.getItem("authState") || "{}");
  const token = localStorage.getItem("token");

  // Logout if the token is invalid
  if (token === "undefined" || token === "null" || token === "") {
    logout();
    return { isLoggedIn: false, role: null, logIn: () => {}, logout };
  }

  return {
    isLoggedIn: savedAuth?.isLoggedIn || false, // Load saved isLoggedIn state
    role: savedAuth?.role || null, // Load saved role state

    logIn: (role) => {
      const newState = { isLoggedIn: true, role };
      set(newState);
      localStorage.setItem("authState", JSON.stringify(newState));
    },

    logout, // Use the logout function
  };
});

export default useAuthStore;
