import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";
import { Link } from "react-router-dom";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="h-12 w-12 mr-[1rem]">
          <Avatar className="w-full h-full">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>
              CN{/*make this the username first letters */}
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Link to="/user-dashboard">User-DB</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to="/restaurant-dashboard">Owner-DB</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to="/rider-dashboard">Rider-DB</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
