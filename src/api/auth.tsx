import { AxiosResponse, AxiosError } from "axios";
import {
  apiResponse,
  loginResponse,
  email,
  User,
  existingUser,
  Owner,
  Driver,
  Otp,
  bankResolveResponse,
} from "@/interfaces/user";
import api from "./apiClient";
type UserWithoutId = Omit<User, "id">;
interface UserLogin extends UserWithoutId {
  password: string;
  "g-recaptcha-response": string | null;
}
export async function createUser(user: UserLogin) {
  return api
    .post("/register", user)
    .then((response: AxiosResponse<apiResponse>) => response.data)
    .catch((error: AxiosError) => {
      throw error.response?.data;
    });
}

export async function loginUser(user: existingUser) {
  return api
    .post("/login", user)
    .then((response: AxiosResponse<loginResponse>) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      if (error.code === "ERR_NETWORK") {
        throw new Error("Network error: Unable to reach the server.");
      }

      throw error.response?.data;
    });
}

export async function createNewAccount(account: Owner) {
  return api
    .post("/register", account)
    .then((response: AxiosResponse<apiResponse>) => response.data)
    .catch((error: AxiosError) => {
      if (error.code === "ERR_NETWORK") {
        throw new Error("Network error: Unable to reach the server.");
      }

      throw error.response?.data;
    });
}

export async function createDriver(driver: Driver) {
  return api
    .post("/register", driver)
    .then((response: AxiosResponse<apiResponse>) => response.data)
    .catch((error: AxiosError) => {
      if (error.code === "ERR_NETWORK") {
        throw new Error("Network error: Unable to reach the server.");
      }

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

      throw error.response?.data;
    });
}

export async function getOtp(email: email) {
  return api
    .post("/get-otp", email, {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      },
    })
    .then((response: AxiosResponse<apiResponse>) => response.data)
    .catch((error: AxiosError) => {
      if (error.code === "ERR_NETWORK") {
        throw new Error("Network error: Unable to reach the server.");
      }

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

      throw error.response?.data;
    });
}

export async function getBanks() {
  const token = localStorage.getItem("BHUO-token");
  return api
    .get(`/bank-list`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      if (error.code === "ERR_NETWORK") {
        throw new Error("Network error: Unable to reach the server.");
      }

      throw error.response?.data;
    });
}

export async function resolveBank(data: {
  account_number: string;
  bank_code: string;
}) {
  const token = localStorage.getItem("BHUO-token");
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
      return response.data;
    })
    .catch((error: AxiosError) => {
      if (error.code === "ERR_NETWORK") {
        throw new Error("Network error: Unable to reach the server.");
      }

      throw error.response?.data;
    });
}

export async function googleSignIn() {
  return api
    .get(`/auth/google`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      if (error.code === "ERR_NETWORK") {
        throw new Error("Network error: Unable to reach the server.");
      }

      throw error.response?.data;
    });
}

export async function forgotPassword(data: { email: string }) {
  return api
    .post("/forgot-password", data)
    .then((response: AxiosResponse<bankResolveResponse>) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      if (error.code === "ERR_NETWORK") {
        throw new Error("Network error: Unable to reach the server.");
      }

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
      return response.data;
    })
    .catch((error: AxiosError) => {
      if (error.code === "ERR_NETWORK") {
        throw new Error("Network error: Unable to reach the server.");
      }

      throw error.response?.data;
    });
}
