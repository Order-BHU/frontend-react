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
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createNewAccount } from "@/api/auth";
import { banksType } from "@/interfaces/paymentType";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { getBanks, resolveBank } from "@/api/auth";

interface createProps {
  isDriver: boolean;
}
interface formDataType {
  //just here so i can set the type for phoneNumberType
  email: string;
  password: string;
  confirmPassword: string;
  phone_number: string;
  phone_number_type: "whatsapp" | "sms" | "both";
  owners_name: string;
  restaurant_name: string;
  account_no: string;
  bank_code: string;
  bank_name: string;
  name: string;
}

export default function CreateUserModal({ isDriver }: createProps) {
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
  const [formData, setformData] = useState<formDataType>({
    email: "",
    password: "",
    confirmPassword: "",
    phone_number: "",
    phone_number_type: "whatsapp",
    owners_name: "",
    restaurant_name: "",
    account_no: "",
    bank_code: "",
    bank_name: "",
    name: "", //for driver
  });
  const { data: bankList, status: bankListStatus } = useQuery({
    queryKey: ["bankList"],
    queryFn: getBanks,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  const handleRestaurantphone_number_typeChange = (
    type: "whatsapp" | "sms"
  ) => {
    setformData((prev) => ({ ...prev, phone_number_type: type }));
  };
  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (resolvedBankName === undefined || resolvedBankName === "") {
      toast({
        title: "Couldn't find bank",
        description: "Couldn't find this bank account",
        variant: "destructive",
      });
    }
    console.log("New restaurant:", formData);
    mutate({ ...formData, account_type: isDriver ? "driver" : "restaurant" });
  };

  const { status, mutate } = useMutation({
    mutationFn: createNewAccount,
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
    if (name === "phone_number" || name === "account_number") {
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

  const { mutate: resolveBankMutate } = useMutation({
    mutationFn: resolveBank,
    onSuccess: (data) => {
      //setFoundResolvedBank(data);
      setResolvedBankName(data?.data?.account_name);
      const matchingbank = allBanks.find(
        (bank) => bank.id === data?.data?.bank_id
      );
      setformData((prev) => ({
        ...prev,
        bank_name: matchingbank?.name || prev.bank_name,
      }));
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
  const handleResolveBankMutate = (bank: {
    bank_code: string;
    account_number: string;
  }) => {
    if (bank.account_number && bank.bank_code) {
      console.log("bank sending:", bank);
      resolveBankMutate(bank);
    }
    return;
  };

  useEffect(() => {
    //this sets the allbanks array thingy
    if (bankList?.data && Array.isArray(bankList.data)) {
      const processed = bankList.data.map((bank: banksType) => ({
        ...bank,
      }));
      setAllBanks(processed);
    }
  }, [bankList]);

  useEffect(() => {
    //this will handle the mutations. I'm not doing it directly because something something asynchronous programming
    if (
      resolveBankData.account_number.length >= 10 &&
      resolveBankData.bank_code
    ) {
      handleResolveBankMutate(resolveBankData);
    }
  }, [resolveBankData]);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-4 w-full sm:w-auto">
          {isDriver ? "Add New Driver" : "Add New Restaurant"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] dark:text-cfont-dark">
        <DialogHeader>
          <DialogTitle>
            {isDriver
              ? "Create a New Driver Account"
              : "Create a New Restaurant Account"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[80vh] px-8">
          <form
            onSubmit={handleCreateAccount}
            className="space-y-4 w-[90%] pl-3"
          >
            {!isDriver ? (
              <>
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
              </>
            ) : (
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setformData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>
            )}

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
              <Label htmlFor="phone_number" className="dark:text-cfont-dark">
                Phone Number
              </Label>
              <Input
                type="tel"
                id="phone_number"
                name="phone_number"
                className="dark:text-cfont-dark"
                value={formData.phone_number}
                onChange={handleChange}
                required
              />
              <div className="flex space-x-2 mt-2">
                <Button
                  type="button"
                  size="sm"
                  variant={
                    formData.phone_number_type === "whatsapp"
                      ? "default"
                      : "outline"
                  }
                  onClick={() =>
                    handleRestaurantphone_number_typeChange("whatsapp")
                  }
                >
                  WhatsApp
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={
                    formData.phone_number_type === "sms" ? "default" : "outline"
                  }
                  onClick={() => handleRestaurantphone_number_typeChange("sms")}
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
                    <>
                      {allBanks.map((bank) => (
                        <SelectItem
                          key={`${bank.id}-${bank.code}-${bank.name}`}
                          value={String(bank.code)}
                        >
                          {bank.name}
                        </SelectItem>
                      ))}
                    </>
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
            {!isDriver && (
              <Button
                type="submit"
                className="w-full"
                disabled={status === "pending"}
              >
                {status === "pending"
                  ? "Creating account..."
                  : "Create Restaurant"}
              </Button>
            )}

            {isDriver && (
              <Button
                type="submit"
                className="w-full"
                disabled={status === "pending"}
              >
                {status === "pending" ? "Creating account..." : "Create Driver"}
              </Button>
            )}
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
