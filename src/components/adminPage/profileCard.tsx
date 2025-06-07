import { LogOut, ChevronRight } from "lucide-react";
import { PageWrapper } from "../pagewrapper";
import { Button } from "../ui/button";

interface Props {
  logoutStatus: string;
  handleLogout: () => void;
}
function ProfileCard({ logoutStatus, handleLogout }: Props) {
  return (
    <PageWrapper>
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 dark:text-cfont-dark">
        Admin Dashboard
      </h1>

      <Button
        variant="outline"
        className=" justify-between rounded-xl border-gray-200 bg-gray hover:bg-orange-600 shadow-sm"
        disabled={logoutStatus === "pending"}
        onClick={handleLogout}
      >
        <span className="flex items-center">
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </PageWrapper>
  );
}
export default ProfileCard;
