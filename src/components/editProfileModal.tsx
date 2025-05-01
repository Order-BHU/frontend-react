import React, { useState, ChangeEvent, useEffect } from "react";
import { User, ChevronRight } from "lucide-react";
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
import { editProfile, changePassword } from "@/api/misc";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface UserDetails {
  restaurant_name?: string;
  name?: string;
  profile_picture?: File | null;
  restaurant_logo?: File | null;
  cover_picture?: File | null;
  phone_number_type?: "whatsapp" | "sms";
  // Add other user details properties as needed
}

interface PasswordState {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

interface EditProfileModalProps {
  userDetails?: UserDetails;
  successFn: () => void; //this is the function passed to run onSuccess when mutate is done so it refetches user Data. I don't want to have to query for user details in this modal as well the actual dashboard page
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  userDetails = {},
  successFn,
}) => {
  const [formData, setFormData] = useState<UserDetails>({
    name: userDetails.name || "",
    restaurant_name: userDetails.restaurant_name || "",
    profile_picture: null,
    phone_number_type: userDetails.phone_number_type || "sms", // Default valu
    cover_picture: null,
  });

  useEffect(() => {
    //this is here to set the form details whenever we get themfrom the api
    setFormData((prevData) => ({
      ...prevData,
      name: userDetails.name || "",
      restaurant_name: userDetails.restaurant_name || "",
    }));
  }, [userDetails]);
  const { toast } = useToast();
  const [showEditProfileModal, setShowEditProfileModal] =
    useState<boolean>(false);

  const { mutate: editProfileMutate, status: editProfileMutateStatus } =
    useMutation({
      mutationFn: editProfile,
      onSuccess: (data) => {
        successFn();
        toast({
          title: "Success",
          description: data.message,
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });

  const filteredData = Object.fromEntries(
    //this is here to filter only the truthy values from the edit profile form and we pass it to mutate, since the api can't accept empty strings as they'll override whatever is already there
    Object.entries(formData).filter(([_, value]) => value)
  );

  const handlePfpImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    fn: keyof typeof formData
  ): void => {
    // Handle image change logic
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        [fn]: e.target.files[0],
      });
    }
  };

  const handlePhoneTypeChange = (type: "whatsapp" | "sms"): void => {
    setFormData({
      ...formData,
      phone_number_type: type,
    });
  };

  const handleEditProfile = (e: React.FormEvent) => {
    e.preventDefault();
    editProfileMutate(filteredData);
    console.log("filtered: ", filteredData);
  };
  const { mutate: passwordMutate, status: passwordStatus } = useMutation({
    mutationFn: changePassword,
    onSuccess: (data) => {
      setPasswordDetails({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
      toast({
        title: "Success",
        description: data.message,
      });
      successFn();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  const [passwordDetails, setPasswordDetails] = useState<PasswordState>({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const handleUpdatePassword = () => {
    passwordMutate(passwordDetails);
  };
  return (
    <Dialog open={showEditProfileModal} onOpenChange={setShowEditProfileModal}>
      <DialogTrigger asChild>
        <Button
          className="w-full justify-between rounded-xl bg-orange-500 hover:bg-orange-600 shadow-sm shadow-orange-200"
          onClick={() => setShowEditProfileModal(true)}
        >
          <span className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Edit Profile
          </span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="dark:text-cfont-dark overflow-auto max-h-screen">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleEditProfile} className="space-y-4">
          {userDetails.cover_picture && (
            <div>
              <Label htmlFor="coverPhoto" className="dark:text-cfont-dark">
                Cover Photo
              </Label>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={(e) => handlePfpImageChange(e, "cover_picture")}
              />
            </div>
          )}
          {userDetails.restaurant_logo ? (
            <div>
              <Label htmlFor="restaurantLogo" className="dark:text-cfont-dark">
                Restaurant Logo
              </Label>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={(e) => handlePfpImageChange(e, "profile_picture")}
              />
            </div>
          ) : (
            <div>
              <Label htmlFor="profilePhoto" className="dark:text-cfont-dark">
                Profile Picture
              </Label>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={(e) => handlePfpImageChange(e, "profile_picture")}
              />
            </div>
          )}

          {userDetails.restaurant_name ? (
            <div>
              <Label htmlFor="restaurantName" className="dark:text-cfont-dark">
                Restaurant Name
              </Label>
              <Input
                id="restaurantName"
                value={formData.restaurant_name}
                className="dark:text-cfont-dark"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFormData({
                    ...formData,
                    restaurant_name: e.target.value,
                  })
                }
              />
            </div>
          ) : (
            <div>
              <Label htmlFor="Name" className="dark:text-cfont-dark">
                Name
              </Label>
              <Input
                id="Name"
                value={formData.name}
                className="dark:text-cfont-dark"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
              />
            </div>
          )}

          <div>
            <Label htmlFor="phoneNumberType" className="dark:text-cfont-dark">
              Phone Number Type:
            </Label>
            <div className="flex space-x-2 mt-2">
              <Button
                type="button"
                size="sm"
                variant={
                  formData.phone_number_type === "whatsapp"
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
                  formData.phone_number_type === "sms" ? "default" : "outline"
                }
                onClick={() => handlePhoneTypeChange("sms")}
              >
                SMS
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

export default EditProfileModal;
