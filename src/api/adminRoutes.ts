import api from "./apiClient";
import { AxiosResponse, AxiosError } from "axios";
import { handleError } from "./apiClient";

export async function getContacts(page?: string) {
  const token = localStorage.getItem("BHUO-token");
  return api
    .get(`/contacts?page=${page || "1"}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 90000,
    })
    .then(function (response) {
      console.log(response);
      return response;
    })
    .catch(function (error) {
      if (error.code === "ERR_NETWORK") {
        throw new Error("Network error: Unable to reach the server.");
      }

      throw error.response?.data;
    });
}

export async function setContactStatus(payload: {
  contactId: string;
  status: string;
}) {
  const token = localStorage.getItem("BHUO-token");
  return api
    .post(
      `/${payload.contactId}/update-contact-status`,
      { status: payload.status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 90000,
      }
    )
    .then(function (response) {
      console.log(response);
      return response;
    })
    .catch(function (error) {
      if (error.code === "ERR_NETWORK") {
        throw new Error("Network error: Unable to reach the server.");
      }

      throw error.response?.data;
    });
}

export async function updateOrder(data: {
  driver_id: string;
  status: string;
  orderId: string;
}) {
  const token = localStorage.getItem("BHUO-token");
  return api
    .post(
      `/update-order/${data.orderId}`,
      { driver_id: data.driver_id, status: data.status },

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

      throw error.response?.data;
    });
}

export async function allOrders() {
  //this function gets all orders for the admin page to manipulate
  const token = localStorage.getItem("BHUO-token");
  return api
    .get(
      `/all-orders`,

      {
        headers: {
          Authorization: `Bearer ${token}`, //set this to token variable later
        },
        timeout: 90000,
      }
    )
    .then(function (response: AxiosResponse) {
      return response.data.orders;
    })
    .catch(function (error: AxiosError) {
      if (error.code === "ERR_NETWORK") {
        throw new Error("Network error: Unable to reach the server.");
      }

      throw error.response?.data;
    });
}

export async function driverList(status: string) {
  //this function gets all orders for the admin page to manipulate
  const token = localStorage.getItem("BHUO-token");
  return api
    .get(
      `/${status}/driver-list`,

      {
        headers: {
          Authorization: `Bearer ${token}`, //set this to token variable later
        },
        timeout: 90000,
      }
    )
    .then(function (response: AxiosResponse) {
      return status === "online"
        ? response.data.onlinedrivers
        : response.data.offlinedrivers;
    })
    .catch(function (error: AxiosError) {
      if (error.code === "ERR_NETWORK") {
        throw new Error("Network error: Unable to reach the server.");
      }

      throw error.response?.data;
    });
}

export async function adminSetDriverStatus(data: {
  driverID: number;
  status: "offline" | "online";
}) {
  const token = localStorage.getItem("BHUO-token");
  return api
    .post(
      `/${data.status}/${data.driverID}/driver-status-update`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then((response: AxiosResponse) => response.data)
    .catch(handleError);
}
