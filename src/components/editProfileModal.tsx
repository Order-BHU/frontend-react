import React, { useState, FormEvent, ChangeEvent } from "react";
import { FiEdit2 } from "react-icons/fi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface UserDetails {
  message?: {
    restaurant_name?: string;
    // Add other user details properties as needed
  };
}

interface RestaurantState {
  name: string;
  phone_number_type: "whatsapp" | "phone";
}

interface PasswordState {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

type MutationStatus = "idle" | "pending" | "success" | "error";

interface RestaurantProfileModalProps {
  userDetails?: UserDetails;
}

const RestaurantProfileModal: React.FC<RestaurantProfileModalProps> = ({
  userDetails = {},
}) => {
  const [restaurant, setRestaurant] = useState<RestaurantState>({
    name: userDetails?.message?.restaurant_name || "",
    phone_number_type: "whatsapp", // Default value
  });

  const [passwordDetails, setPasswordDetails] = useState<PasswordState>({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [editProfileMutateStatus, setEditProfileMutateStatus] =
    useState<MutationStatus>("idle");
  const [passwordStatus, setPasswordStatus] = useState<MutationStatus>("idle");
  const [showEditProfileModal, setShowEditProfileModal] =
    useState<boolean>(false);

  const handlePfpImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    // Handle image change logic
    if (e.target.files && e.target.files[0]) {
      console.log("Image selected:", e.target.files[0]);
    }
  };

  const handlePhoneTypeChange = (type: "whatsapp" | "phone"): void => {
    setRestaurant({
      ...restaurant,
      phone_number_type: type,
    });
  };

  const handleEditProfile = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setEditProfileMutateStatus("pending");

    // Simulate API call
    setTimeout(() => {
      console.log("Profile updated:", restaurant);
      setEditProfileMutateStatus("success");
      setShowEditProfileModal(false);
    }, 1000);
  };

  const handleUpdatePassword = (): void => {
    setPasswordStatus("pending");

    // Password validation
    if (passwordDetails.new_password !== passwordDetails.confirm_password) {
      alert("Passwords don't match!");
      setPasswordStatus("idle");
      return;
    }

    // Simulate API call
    setTimeout(() => {
      console.log("Password updated");
      setPasswordStatus("success");
      setPasswordDetails({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    }, 1000);
  };

  return (
    <Dialog open={showEditProfileModal} onOpenChange={setShowEditProfileModal}>
      <DialogTrigger asChild>
        <button
          onClick={() => setShowEditProfileModal(true)}
          className="inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-medium border border-secondary-200 bg-white text-secondary-700 hover:bg-secondary-50 transition-colors"
        >
          <FiEdit2 className="mr-2" /> Edit Profile
        </button>
      </DialogTrigger>
      <DialogContent className="dark:text-cfont-dark overflow-auto max-h-screen">
        <DialogHeader>
          <DialogTitle>Edit Restaurant Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleEditProfile} className="space-y-4">
          <div>
            <Label htmlFor="restaurantPhoto" className="dark:text-cfont-dark">
              Restaurant Photo
            </Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handlePfpImageChange}
            />
          </div>
          <div>
            <Label htmlFor="restaurantName" className="dark:text-cfont-dark">
              Restaurant Name
            </Label>
            <Input
              id="restaurantName"
              value={restaurant.name}
              className="dark:text-cfont-dark"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setRestaurant({
                  ...restaurant,
                  name: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="phoneNumberType" className="dark:text-cfont-dark">
              Phone Number Type:
            </Label>
            <div className="flex space-x-2 mt-2">
              <Button
                type="button"
                size="sm"
                variant={
                  restaurant.phone_number_type === "whatsapp"
                    ? "default"
                    : "outline"
                }
                onClick={() => handlePhoneTypeChange("whatsapp")}
              >
                WhatsApp
              </Button>
              <Button
                type="button"
                size="sm"
                variant={
                  restaurant.phone_number_type === "phone"
                    ? "default"
                    : "outline"
                }
                onClick={() => handlePhoneTypeChange("phone")}
              >
                Phone
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={editProfileMutateStatus === "pending"}
          >
            {editProfileMutateStatus === "pending"
              ? "Updating..."
              : "Update Profile"}
          </Button>

          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Change Password</AccordionTrigger>
              <AccordionContent>
                <div className="mb-4">
                  <Label htmlFor="oldPassword" className="dark:text-cfont-dark">
                    Old Password
                  </Label>
                  <Input
                    id="oldPassword"
                    type="password"
                    value={passwordDetails.current_password}
                    className="dark:text-cfont-dark max-w-full"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setPasswordDetails({
                        ...passwordDetails,
                        current_password: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-4">
                  <Label htmlFor="newPassword" className="dark:text-cfont-dark">
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordDetails.new_password}
                    className="dark:text-cfont-dark max-w-full"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setPasswordDetails({
                        ...passwordDetails,
                        new_password: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-4">
                  <Label
                    htmlFor="confirmPassword"
                    className="dark:text-cfont-dark"
                  >
                    Confirm Password
                  </Label>
                  <Input
                    type="password"
                    id="confirmPassword"
                    value={passwordDetails.confirm_password}
                    className="dark:text-cfont-dark max-w-full"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setPasswordDetails({
                        ...passwordDetails,
                        confirm_password: e.target.value,
                      })
                    }
                  />
                </div>
                <Button
                  onClick={handleUpdatePassword}
                  disabled={passwordStatus === "pending"}
                >
                  {passwordStatus === "pending"
                    ? "Updating..."
                    : "Update Password"}
                </Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RestaurantProfileModal;
