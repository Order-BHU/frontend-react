import { AxiosResponse, AxiosError } from "axios";
import axios from "axios";
import { menuItem, checkoutType } from "@/interfaces/restaurantType";

const apiUrl = "https://bhuorder.com.ng/api";

export async function getRestaurants() {
  return axios
    .get(`${apiUrl}/restaurant-list`, {
      timeout: 90000,
    })
    .then(function (response: AxiosResponse) {
      return response.data.restaurant_list;
    })
    .catch(function (error: AxiosError) {
      console.log(error);
      throw error.response?.data;
    });
}

export async function getCategories() {
  return axios
    .get(`${apiUrl}/categories`, {
      timeout: 90000,
    })
    .then(function (response: AxiosResponse) {
      return response.data.categories;
    })
    .catch(function (error: AxiosError) {
      throw error.response?.data;
    });
}

export async function getMenuItems(id: string) {
  return axios
    .get(`${apiUrl}/${id}/menu-list`, {
      timeout: 90000,
    })
    .then(function (response: AxiosResponse) {
      console.log(response.data);
      return response.data.menu;
    })
    .catch(function (error: AxiosError) {
      console.log(error);
      throw error.response?.data;
    });
}

export async function addMenu(menu: menuItem) {
  const token = localStorage.getItem("token");
  return axios
    .post(
      `${apiUrl}/${menu.id}/add-menu`,
      menu, // empty body or whatever body your API expects
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        timeout: 90000,
      }
    )
    .then(function (response: AxiosResponse) {
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

export async function editMenu(menu: menuItem) {
  const token = localStorage.getItem("token");
  return axios
    .post(
      `${apiUrl}/${menu.id}/edit-menu`,
      menu, // empty body or whatever body your API expects
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        timeout: 90000,
      }
    )
    .then(function (response: AxiosResponse) {
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

export async function addToCart(menuid: number) {
  const token = localStorage.getItem("token");
  return axios
    .post(
      `${apiUrl}/${menuid}/add-to-cart`,
      menuid, // empty body or whatever body your API expects
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 90000,
      }
    )
    .then(function (response: AxiosResponse) {
      console.log(response.data);
      console.log(token);
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

export async function removeCartItem(menuid: number) {
  const token = localStorage.getItem("token");
  return axios
    .post(
      `${apiUrl}/${menuid}/remove-cart-item`,
      menuid, // empty body or whatever body your API expects
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 90000,
      }
    )
    .then(function (response: AxiosResponse) {
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

export async function viewCart() {
  const token = localStorage.getItem("token");
  return axios
    .get(
      `${apiUrl}/view-cart`, // empty body or whatever body your API expects
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 90000,
      }
    )
    .then(function (response: AxiosResponse) {
      console.log(response.data);
      return response.data;
    })
    .catch(function (error: AxiosError) {
      if (error.code === "ERR_NETWORK") {
        throw new Error("Network error: Unable to reach the server.");
      }
      console.log(error, "token: ", token);
      throw error.response?.data;
    });
}

export async function checkout(checkoutItems: checkoutType) {
  const token = localStorage.getItem("token");
  return axios
    .post(
      `${apiUrl}/${checkoutItems.restaurant_id}/checkout`,
      checkoutItems, // request body
      {
        // config object
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 90000,
      }
    )
    .then(function (response: AxiosResponse) {
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

export async function myOrders(
  ordertype: "pending" | "history" | "accepted" | "ready" | "history"
) {
  const token = localStorage.getItem("token");
  console.log(token);
  return axios
    .get(`${apiUrl}/${ordertype}/my-orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 90000,
    })
    .then(function (response: AxiosResponse) {
      console.log(response.data);
      return response.data;
    })
    .catch(function (error: AxiosError) {
      if (error.code === "ERR_NETWORK") {
        throw new Error("Network error: Unable to reach the server.");
      }
      console.log(error, "token: ", token);
      throw error.response?.data;
    });
}

export async function getLocation() {
  const token = localStorage.getItem("token");
  return axios
    .get(
      `${apiUrl}/locations`, // empty body or whatever body your API expects
      {
        timeout: 90000,
      }
    )
    .then(function (response: AxiosResponse) {
      console.log("locations", response.data);
      return response.data;
    })
    .catch(function (error: AxiosError) {
      if (error.code === "ERR_NETWORK") {
        throw new Error("Network error: Unable to reach the server.");
      }
      console.log(error, "token: ", token);
      throw error.response?.data;
    });
}

export async function updateOrderStatus(content: {
  orderId: number;
  status: string;
  code?: number;
}) {
  const token = localStorage.getItem("token");
  console.log(token);
  return axios
    .post(
      `${apiUrl}/${content.orderId}/${content.status}/update-order-status`,
      {
        code: content.code,
      },

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 90000,
      }
    )
    .then(function (response: AxiosResponse) {
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

export async function setDriverStatus(status: "offline" | "online") {
  const token = localStorage.getItem("token");
  console.log(token);
  return axios
    .post(
      `${apiUrl}/${status}/driver-status-update`,
      {},

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 90000,
      }
    )
    .then(function (response: AxiosResponse) {
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
