import { AxiosResponse } from "axios";
import api, { handleError } from "./apiClient";

export async function updatePfp(pfp: { profile_picture: File | null }) {
  const token = localStorage.getItem("BHUO-token");

  return api
    .post("/update-profile-picture", pfp, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response: AxiosResponse) => response.data)
    .catch(handleError);
}

export async function editProfile(data: {
  profile_picture?: File | null;
  name?: string;
  phone_number_type?: "whatsapp" | "sms";
  cover_picture?: File | null;
  phone_number?: string;
}) {
  const token = localStorage.getItem("BHUO-token");

  return api
    .post("/edit-profile", data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response: AxiosResponse) => response.data)
    .catch(handleError);
}

export async function dashboard() {
  const token = localStorage.getItem("BHUO-token");
  return api
    .get("/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response: AxiosResponse) => response.data)
    .catch(handleError);
}

export async function changePassword(data: {
  current_password: string;
  new_password: string;
  confirm_password: string;
}) {
  const token = localStorage.getItem("BHUO-token");

  return api
    .post("/change-password", data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response: AxiosResponse) => response.data)
    .catch(handleError);
}

export async function contact(data: { subject: string; message: string }) {
  const token = localStorage.getItem("BHUO-token");
  return api
    .post("/contact", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response: AxiosResponse) => response.data)
    .catch(handleError);
}

export async function transactions() {
  const token = localStorage.getItem("BHUO-token");

  return api
    .get("/transaction-list", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response: AxiosResponse) => response.data.transactions)
    .catch(handleError);
}
