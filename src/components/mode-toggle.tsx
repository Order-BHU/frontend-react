import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";
import { Link } from "react-router-dom";
import UseAuthStore from "@/stores/useAuthStore";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { logOut } from "@/api/auth";

export function ModeToggle() {
  const { toast } = useToast();
  const usertoken = localStorage.getItem("token");
  const navigate = useNavigate();
  const { logout } = UseAuthStore();
  const { setTheme } = useTheme();
  const { role } = UseAuthStore();
  const username = localStorage.getItem("name")?.slice(0, 2).toUpperCase();

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
    onError: (error) => {
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="h-12 w-12 mr-[1rem]">
          <Avatar className="w-full h-full">
            <AvatarImage src="" />
            <AvatarFallback className="text-white">{username}</AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {role === "admin" && (
          <DropdownMenuItem>
            <Link to="/admin-dashboard">Admin-DB</Link>
          </DropdownMenuItem>
        )}
        {role === "customer" && (
          <DropdownMenuItem>
            <Link to="/customer-dashboard">User-DB</Link>
          </DropdownMenuItem>
        )}

        {role === "restaurant" && (
          <DropdownMenuItem>
            <Link to="/restaurant-dashboard">Owner-DB</Link>
          </DropdownMenuItem>
        )}

        {role === "driver" && (
          <DropdownMenuItem>
            <Link to="/rider-dashboard">Rider-DB</Link>
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
