//this function helps to hide the toast whenever a user taps on the screen since shadcn doesn't really have this.

import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const ToastAutoDismiss = () => {
  const { dismiss } = useToast();

  useEffect(() => {
    const handleClick = () => dismiss(); // Dismiss toast when screen is tapped

    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick); // Cleanup on unmount
  }, [dismiss]);

  return null; // This component only manages behavior, no UI needed
};

export default ToastAutoDismiss;
