import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createRestaurant, createDriver } from "@/api/auth";
import { banksType } from "@/interfaces/paymentType";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { getBanks, resolveBank } from "@/api/auth";

interface createProps {
  isRestaurant: false;
}

export default function CreateUserModal({ isRestaurant }: createProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showRestaurantPassword, setShowRestaurantPassword] = useState(false);
  const [showRestaurantConfirmPassword, setShowRestaurantConfirmPassword] =
    useState(false);
  const [resolvedBankName, setResolvedBankName] = useState(""); //handles storing the name of the account from resolved. May be redundant, but I'm in a hurry rn
  const [resolveBankData, setResolveBankData] = useState<{
    //this state will store the data I will send to the resolve bank route
    bank_code: string;
    account_number: string;
  }>({
    bank_code: "",
    account_number: "",
  });
  const [allBanks, setAllBanks] = useState<banksType[]>([]);
  const [formData, setformData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    phoneType: "whatsapp",
    owners_name: "",
    restaurant_name: "",
    account_no: "",
    bank_code: "",
    bank_name: "",
  });
  const { data: bankList, status: bankListStatus } = useQuery({
    queryKey: ["bankList"],
    queryFn: getBanks,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  const handleRestaurantPhoneTypeChange = (type: "whatsapp" | "sms") => {
    setformData((prev) => ({ ...prev, phoneType: type }));
  };
  const handleCreateRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    if (resolvedBankName === undefined || resolvedBankName === "") {
      toast({
        title: "Couldn't find bank",
        description: "Couldn't find this bank account",
        variant: "destructive",
      });
    }
    console.log("New restaurant:", formData);
    mutate({
      email: formData.email,
      password: formData.password,
      phone_number: formData.phone,
      phone_number_type: formData.phoneType as "whatsapp" | "sms" | "both",
      account_type: "restaurant",
      owners_name: formData.owners_name,
      restaurant_name: formData.restaurant_name,
      account_no: formData.account_no,
      bank_code: formData.bank_code,
      bank_name: formData.bank_name,
    });
  };

  const { status, mutate } = useMutation({
    mutationFn: createRestaurant,
    onSuccess: () => {
      toast({
        title: "Sign-up successful!",
        description: "Verify your account",
      });
      navigate("/verify-otp/", { state: { formData } });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // First update formData
    if (name === "phone" || name === "account_number") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setformData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setformData((prev) => ({ ...prev, [name]: value }));
    }

    // Only update resolveBankData for account_number
    if (name === "account_no") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setResolveBankData((prev) => ({ ...prev, account_number: numericValue }));
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-4 w-full sm:w-auto">
          Create New Restaurant Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] dark:text-cfont-dark">
        <DialogHeader>
          <DialogTitle>Create New Restaurant Account</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[80vh] px-8">
          <form
            onSubmit={handleCreateRestaurant}
            className="space-y-4 w-[90%] pl-3"
          >
            <div>
              <Label htmlFor="restaurantName">Restaurant Name</Label>
              <Input
                id="restaurantName"
                value={formData.restaurant_name}
                onChange={(e) =>
                  setformData({
                    ...formData,
                    restaurant_name: e.target.value,
                  })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="ownerName">Owner's Name</Label>
              <Input
                id="ownerName"
                value={formData.owners_name}
                onChange={(e) =>
                  setformData({
                    ...formData,
                    owners_name: e.target.value,
                  })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="restaurantEmail">Email</Label>
              <Input
                id="restaurantEmail"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setformData({
                    ...formData,
                    email: e.target.value,
                  })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="phone" className="dark:text-cfont-dark">
                Phone Number
              </Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                className="dark:text-cfont-dark"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              <div className="flex space-x-2 mt-2">
                <Button
                  type="button"
                  size="sm"
                  variant={
                    formData.phoneType === "whatsapp" ? "default" : "outline"
                  }
                  onClick={() => handleRestaurantPhoneTypeChange("whatsapp")}
                >
                  WhatsApp
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={formData.phoneType === "sms" ? "default" : "outline"}
                  onClick={() => handleRestaurantPhoneTypeChange("sms")}
                >
                  SMS
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="accountnum" className="dark:text-cfont-dark">
                Bank Account Number
              </Label>
              <Input
                type="tel"
                id="accountnum"
                name="account_no"
                className="dark:text-cfont-dark"
                value={formData.account_no}
                onChange={handleChange}
                required
                maxLength={12}
              />
            </div>

            <div>
              <Label htmlFor="bank">Bank</Label>
              <Select
                onValueChange={(value) => {
                  const selectedBank = allBanks?.find(
                    (bank) => String(bank.code) === value
                  );
                  if (selectedBank) {
                    setformData((prev) => ({
                      ...prev,
                      bank_code: selectedBank.code,
                    }));
                    setResolveBankData((prev) => ({
                      ...prev,
                      bank_code: selectedBank.code,
                    }));
                  }
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Choose Bank" />
                </SelectTrigger>
                <SelectContent>
                  {bankListStatus === "pending" ? (
                    <SelectItem value="" disabled>
                      Loading Banks...
                    </SelectItem>
                  ) : bankListStatus === "error" ? (
                    <SelectItem value="" disabled>
                      Error loading Banks
                    </SelectItem>
                  ) : (
                    bankOptions
                  )}
                </SelectContent>
              </Select>
            </div>
            <div
              className={`relative ${resolvedBankName === "" ? "hidden" : ""}`}
            >
              <p>Matching account: </p>
              <h3>{resolvedBankName?.toLocaleUpperCase()}</h3>
            </div>

            <div className="relative">
              <Label htmlFor="password" className="dark:text-cfont-dark">
                Password
              </Label>
              <Input
                type={showRestaurantPassword ? "text" : "password"}
                id="password"
                name="password"
                className="dark:text-cfont-dark"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-2 h-full px-3 py-2 hover:bg-transparent"
                onClick={() =>
                  setShowRestaurantPassword(!showRestaurantPassword)
                }
              >
                {showRestaurantPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
                <span className="sr-only">
                  {showRestaurantPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
            <div className="relative">
              <Label htmlFor="confirmPassword" className="dark:text-cfont-dark">
                Confirm Password
              </Label>
              <Input
                type={showRestaurantConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                className="dark:text-cfont-dark"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-2 h-full px-3 py-2 hover:bg-transparent"
                onClick={() =>
                  setShowRestaurantConfirmPassword(
                    !showRestaurantConfirmPassword
                  )
                }
              >
                {showRestaurantConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
                <span className="sr-only">
                  {showRestaurantConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"}
                </span>
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={status === "pending"}
            >
              {status === "pending"
                ? "Creating account..."
                : "Create Restaurant Account"}
            </Button>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
