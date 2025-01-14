import { AxiosResponse, AxiosError } from "axios";
import axios from "axios";

interface apiResponse {
  message: string;
}
interface loginResponse {
  message: string;
  token: string;
  account_type: string;
  name: string;
}
interface email {
  email: string;
}

type User = {
  name: string;
  email: string;
  password: string;
  phone_number: string;
  phone_number_type: "whatsapp" | "sms" | "both";
  account_type: "customer";
};

type existingUser = {
  email: string;
  password: string;
};

type Owner = {
  email: string;
  password: string;
  phone_number: string;
  phone_number_type: "whatsapp" | "sms" | "both";
  account_type: "restaurant";
  owners_name: string;
  restaurant_name: string;
};

type Otp = {
  email: string;
  otp: string;
};
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
      console.log(error);
      throw error.response?.data;
    });
}
