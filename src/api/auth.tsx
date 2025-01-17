import { AxiosResponse, AxiosError } from "axios";
import axios from "axios";
import {
  apiResponse,
  loginResponse,
  email,
  User,
  existingUser,
  Owner,
  Otp,
} from "@/interfaces/user";

const apiUrl = "https://bhuorder.com.ng/api";

export async function createUser(user: User) {
  return axios
    .post(`${apiUrl}/register`, user, {
      timeout: 90000,
    })
    .then(function (response: AxiosResponse<apiResponse>) {
      return response.data;
    })
    .catch(function (error: AxiosError) {
      console.log(error);
      throw error.response?.data;
    });
}

export async function loginUser(user: existingUser) {
  return axios
    .post(`${apiUrl}/login`, user, {
      timeout: 90000,
    })
    .then(function (response: AxiosResponse<loginResponse>) {
      console.log(response.data);
      return response.data;
    })
    .catch(function (error: AxiosError) {
      if (error.code === "ERR_NETWORK") {
        throw new Error("Network error: Unable to reach the server.");
      }
      console.log(error);
      throw error.response?.data;
    });
}

export async function createRestaurant(restaurant: Owner) {
  return axios
    .post(`${apiUrl}/register`, restaurant, {
      timeout: 90000,
    })
    .then(function (response: AxiosResponse<apiResponse>) {
      return response.data;
    })
    .catch(function (error: AxiosError) {
      if (error.code === "ERR_NETWORK") {
        throw new Error("Network error: Unable to reach the server.");
      }
      console.log(error);
      throw error.response?.data;
    });
}

export async function verifyAccount(code: Otp) {
  return axios
    .post(`${apiUrl}/verify-user`, code, {
      timeout: 90000,
    })
    .then(function (response: AxiosResponse<apiResponse>) {
      return response.data;
    })
    .catch(function (error: AxiosError) {
      if (error.code === "ERR_NETWORK") {
        throw new Error("Network error: Unable to reach the server.");
      }
      console.log(error);
      throw error.response?.data;
    });
}

export async function getOtp(email: email) {
  return axios
    .post(`${apiUrl}/get-otp`, email, {
      timeout: 90000,
    })
    .then(function (response: AxiosResponse<apiResponse>) {
      return response.data;
    })
    .catch(function (error: AxiosError) {
      if (error.code === "ERR_NETWORK") {
        throw new Error("Network error: Unable to reach the server.");
      }
      console.log(error);
      throw error.response?.data;
    });
}

export async function logOut(token: string | null) {
  return axios
    .post(
      `${apiUrl}/logout`,
      {}, // empty body or whatever body your API expects
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 90000,
      }
    )
    .then(function (response: AxiosResponse<apiResponse>) {
      return response.data;
    })
    .catch(function (error: AxiosError) {
      if (error.code === "ERR_NETWORK") {
        throw new Error("Network error: Unable to reach the server.");
      }
      console.log(error);
      throw error.response?.data;
    });
}
