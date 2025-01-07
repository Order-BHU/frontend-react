import { AxiosResponse, AxiosError } from "axios";
import axios from "axios";

interface apiResponse {
  message: string;
}
interface email {
  email: "string";
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
  name: string;
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

export async function createUser(user: User) {
  return axios
    .post("http://bhuorder.com.ng/api/register", user)
    .then(function (response: AxiosResponse<apiResponse>) {
      console.log(response);
      return response;
    })
    .catch(function (error: AxiosError) {
      console.log(error);
      throw error.response?.data;
    });
}

export async function loginUser(user: existingUser) {
  return axios
    .post("http://bhuorder.com.ng/api/login", user)
    .then(function (response: AxiosResponse<apiResponse>) {
      console.log(response);
      return response;
    })
    .catch(function (error: AxiosError) {
      console.log(error);
      throw error.response?.data;
    });
}

export async function createRestaurant(restaurant: Owner) {
  return axios
    .post("http://bhuorder.com.ng/api/register", restaurant)
    .then(function (response: AxiosResponse<apiResponse>) {
      console.log(response);
    })
    .catch(function (error: AxiosError) {
      console.log(error);
      throw error.response?.data;
    });
}

export async function verifyAccount(code: Otp) {
  return axios
    .post("http://bhuorder.com.ng/api/verify-user", code)
    .then(function (response: AxiosResponse<apiResponse>) {
      console.log(response);
    })
    .catch(function (error: AxiosError) {
      console.log(error);
      throw error.response?.data;
    });
}

export async function getOtp(email: email) {
  return axios
    .post("http://bhuorder.com.ng/api/get-otp", email)
    .then(function (response: AxiosResponse<apiResponse>) {
      console.log(response);
    })
    .catch(function (error: AxiosError) {
      console.log(error);
      throw error.response?.data;
    });
}
