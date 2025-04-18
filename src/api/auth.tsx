import { AxiosResponse, AxiosError } from "axios";
import {
  apiResponse,
  loginResponse,
  email,
  User,
  existingUser,
  Owner,
  Otp,
  bankResolveResponse,
} from "@/interfaces/user";
import api from "./apiClient";

export async function createUser(user: User) {
  return api
    .post("/register", user)
    .then((response: AxiosResponse<apiResponse>) => response.data)
    .catch((error: AxiosError) => {
      console.log(error);
      throw error.response?.data;
    });
}

export async function loginUser(user: existingUser) {
  return api
    .post("/login", user)
    .then((response: AxiosResponse<loginResponse>) => {
      console.log("login data:", response?.data);
      return response.data;
    })
    .catch((error: AxiosError) => {
      if (error.code === "ERR_NETWORK") {
        throw new Error("Network error: Unable to reach the server.");
      }
      console.log(error);
      throw error.response?.data;
    });
}

export async function createRestaurant(restaurant: Owner) {
  return api
    .post("/register", restaurant)
    .then((response: AxiosResponse<apiResponse>) => response.data)
    .catch((error: AxiosError) => {
      if (error.code === "ERR_NETWORK") {
        throw new Error("Network error: Unable to reach the server.");
      }
      console.log(error);
      throw error.response?.data;
    });
}

export async function verifyAccount(code: Otp) {
  return api
    .post("/verify-user", code)
    .then((response: AxiosResponse<apiResponse>) => response.data)
    .catch((error: AxiosError) => {
      if (error.code === "ERR_NETWORK") {
        throw new Error("Network error: Unable to reach the server.");
      }
      console.log(error);
      throw error.response?.data;
    });
}

export async function getOtp(email: email) {
  return api
    .post("/get-otp", email)
    .then((response: AxiosResponse<apiResponse>) => response.data)
    .catch((error: AxiosError) => {
      if (error.code === "ERR_NETWORK") {
        throw new Error("Network error: Unable to reach the server.");
      }
      console.log(error);
      throw error.response?.data;
    });
}

export async function logOut(token: string | null) {
  return api
    .post(
      "/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response: AxiosResponse<apiResponse>) => response.data)
    .catch((error: AxiosError) => {
      if (error.code === "ERR_NETWORK") {
        throw new Error("Network error: Unable to reach the server.");
      }
      console.log(error);
      throw error.response?.data;
    });
}

export async function getBanks() {
  const token = localStorage.getItem("token");
  return api
    .get(`/bank-list`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response: AxiosResponse) => {
      console.log("list of banks: ", response.data, token);
      return response.data;
    })
    .catch((error: AxiosError) => {
      if (error.code === "ERR_NETWORK") {
        throw new Error("Network error: Unable to reach the server.");
      }
      console.log(error);
      throw error.response?.data;
    });
}

export async function resolveBank(data: {
  account_number: string;
  bank_code: string;
}) {
  const token = localStorage.getItem("token");
  return api
    .post(
      "/resolve-bank",
      { account_number: data.account_number, bank_code: data.bank_code },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response: AxiosResponse<bankResolveResponse>) => {
      console.log("resolved bank data: ", response.data);
      return response.data;
    })
    .catch((error: AxiosError) => {
      if (error.code === "ERR_NETWORK") {
        throw new Error("Network error: Unable to reach the server.");
      }
      console.log(error);
      throw error.response?.data;
    });
}

export async function googleSignIn() {
  return api
    .get(`/auth/google`)
    .then((response: AxiosResponse) => {
      console.log("google Response: ", response.data);
      return response.data;
    })
    .catch((error: AxiosError) => {
      if (error.code === "ERR_NETWORK") {
        throw new Error("Network error: Unable to reach the server.");
      }
      console.log(error);
      throw error.response?.data;
    });
}

export async function forgotPassword(data: { email: string }) {
  return api
    .post("/forgot-password", data)
    .then((response: AxiosResponse<bankResolveResponse>) => {
      console.log("password data: ", response.data);
      return response.data;
    })
    .catch((error: AxiosError) => {
      if (error.code === "ERR_NETWORK") {
        throw new Error("Network error: Unable to reach the server.");
      }
      console.log(error);
      throw error.response?.data;
    });
}

export async function resetPassword(data: {
  token: string;
  password: string;
  password_confirmation: string;
}) {
  return api
    .post("/reset-password", data)
    .then((response: AxiosResponse<bankResolveResponse>) => {
      console.log("password data: ", response.data);
      return response.data;
    })
    .catch((error: AxiosError) => {
      if (error.code === "ERR_NETWORK") {
        throw new Error("Network error: Unable to reach the server.");
      }
      console.log(error);
      throw error.response?.data;
    });
}
