export interface apiResponse {
  message: string;
}
export interface loginResponse {
  message: string;
  token: string;
  account_type: string;
  name: string;
  restaurant_name: string;
  restaurant_id: string;
}

export interface email {
  email: string;
}

export type User = {
  name: string;
  email: string;
  password: string;
  phone_number: string;
  phone_number_type: "whatsapp" | "sms" | "both";
  account_type: "customer";
};

export type existingUser = {
  email: string;
  password: string;
};

export type Owner = {
  email: string;
  password: string;
  phone_number: string;
  phone_number_type: "whatsapp" | "sms" | "both";
  account_type: "restaurant";
  owners_name: string;
  restaurant_name: string;
};

export type Otp = {
  email: string;
  otp: string;
};
