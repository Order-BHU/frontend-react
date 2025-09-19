// Re-export shared types for backward compatibility
export type {
  BaseApiResponse as apiResponse,
  User,
  LoginCredentials as existingUser,
  SignupData,
  OwnerSignupData as Owner,
  DriverSignupData as Driver,
  OtpVerification as Otp,
} from "@/types/shared";

export interface loginResponse {
  message: string;
  token: string;
  account_type: string;
  name: string;
  restaurant_name: string;
  restaurant_id: string;
  status: "offline" | "online"; //for the driver's status
  profile_image: string;
}

export interface email {
  email: string;
}

export type bankResolveResponse = {
  //this is used for the response we get if a bank gets resolved
  data: {
    account_name: string;
    account_number: string;
    bank_id: number;
  };

  message: string;
  status: boolean;
};
