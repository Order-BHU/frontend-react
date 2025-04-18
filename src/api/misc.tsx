import { AxiosResponse, AxiosError } from "axios";
import axios from "axios";
const apiUrl = "https://bhuorder.com.ng/api";

export async function updatePfp(pfp: { profile_picture: File | null }) {
  const token = localStorage.getItem("token");
  console.log(token);
  return axios
    .post(
      `${apiUrl}/update-profile-picture`,
      pfp,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 90000,
      }
    )
    .then(function (response: AxiosResponse) {
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

export async function editProfile(data: {
  profile_picture?: File | null;
  name?: string;
  phone_number_type?: "whatsapp" | "phone";
  cover_photo?: File | null;
}) {
  const token = localStorage.getItem("token");
  console.log(token);
  return axios
    .post(
      `${apiUrl}/edit-profile`,
      data,

      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        timeout: 90000,
      }
    )
    .then(function (response: AxiosResponse) {
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

export async function dashboard() {
  //this function gets the user's data
  const token = localStorage.getItem("token");
  console.log(token);
  return axios
    .get(
      `${apiUrl}/dashboard`,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 90000,
      }
    )
    .then(function (response: AxiosResponse) {
      console.log("db data:", response.data);
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

export async function changePassword(data: {
  current_password: string;
  new_password: string;
  confirm_password: string;
}) {
  const token = localStorage.getItem("token");
  console.log(token);
  return axios
    .post(
      `${apiUrl}/change-password`,
      data,

      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        timeout: 90000,
      }
    )
    .then(function (response: AxiosResponse) {
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

export async function contact(data: { subject: string; message: string }) {
  const token = localStorage.getItem("token");
  return axios
    .post(
      `${apiUrl}/contact`,
      data,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 90000,
      }
    )
    .then(function (response: AxiosResponse) {
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
