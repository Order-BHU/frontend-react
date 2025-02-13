import { AxiosResponse, AxiosError } from "axios";
import {
  apiResponse,
  loginResponse,
  email,
  User,
  existingUser,
  Owner,
  Otp,
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
      console.log("login data:", response.data);
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
