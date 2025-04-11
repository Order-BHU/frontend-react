import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";
import UseAuthStore from "@/stores/useAuthStore";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { logOut } from "@/api/auth";
import { useState } from "react";
import { notifyHeaderDropdownState } from "./header"; // Import the function from Header
//this component has some claude stuff to fix the dropdown making the header twitch and glitch. I don't get it, but it works. It doesn't actually work, but it does make the glitching less evident

export function ModeToggle() {
  const { toast } = useToast();
  const usertoken = localStorage.getItem("token");
  const navigate = useNavigate();
  const { logout } = UseAuthStore();
  const { setTheme } = useTheme();
  const { role } = UseAuthStore();
  const username = localStorage.getItem("name")?.slice(0, 2).toUpperCase();
  const [open, setOpen] = useState<boolean>(false);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);

    // Notify Header component about dropdown state changes
    notifyHeaderDropdownState(isOpen);
  };

  const { status, mutate } = useMutation({
    mutationFn: logOut,
    onSuccess: (data) => {
      logout();
      navigate("/login/");
      toast({
        title: "success!",
        description: data.message,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    },
  });

  const handleLogout = () => {
    if (!usertoken) {
      toast({
        title: "Error",
        description: "Not authenticated",
        variant: "destructive",
      });
      return;
    }
    mutate(usertoken);
  };

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <div className="h-10 w-10 mr-[1rem]">
          <Avatar className="w-full h-full">
            <AvatarImage src={localStorage.getItem("pfp") || ""} />
            <AvatarFallback className="text-gray-900 dark:text-gray-300">
              {username}
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {role === "admin" && (
          <DropdownMenuItem onClick={() => navigate("/admin-dashboard")}>
            <span>Dashboard</span>
          </DropdownMenuItem>
        )}
        {role === "customer" && (
          <DropdownMenuItem onClick={() => navigate("/customer-dashboard")}>
            <span>Dashboard</span>
          </DropdownMenuItem>
        )}

        {role === "restaurant" && (
          <DropdownMenuItem onClick={() => navigate("/restaurant-dashboard")}>
            <span>Dashboard</span>
          </DropdownMenuItem>
        )}

        {role === "driver" && (
          <DropdownMenuItem onClick={() => navigate("/driver-dashboard")}>
            <span>Dashboard</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        {status != "pending" && (
          <DropdownMenuItem onClick={handleLogout} className="text-red-600">
            Logout
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
