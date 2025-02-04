import { create } from "zustand";

interface DriveState {
  state: "online" | "offline"; // Ensure it always has a valid value
  setState: (state: "online" | "offline") => void;
}

// Function to get the initial state safely
const getInitialState = (): "online" | "offline" => {
  const storedState = localStorage.getItem("driverStatus");
  return storedState === "online" || storedState === "offline"
    ? storedState
    : "offline"; // Default to "offline" if no valid state is found
};

// Create the Zustand store
const driverStore = create<DriveState>((set) => ({
  state: getInitialState(),
  setState: (newState) => {
    localStorage.setItem("driverStatus", newState);
    set({ state: newState });
  },
}));

export default driverStore;
