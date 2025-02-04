import { create } from "zustand";

interface driveState {
  state: "online" | "offline" | null;
  setState: (state: "online" | "offline" | null) => void;
}

// Create the Zustand store
const driverStore = create<driveState>((set) => {
  return {
    state: null,
    setState: (state) => {
      const newstate = { state };
      set(newstate);
    },
  };
});

export default driverStore;
