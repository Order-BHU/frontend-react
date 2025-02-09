import { AxiosResponse, AxiosError } from "axios";
import { menuItem, checkoutType } from "@/interfaces/restaurantType";
import api from "./apiClient";

export async function getRestaurants() {
  return api
    .get("/restaurant-list")
    .then((response: AxiosResponse) => response.data.restaurant_list)
    .catch(handleError);
}

export async function getCategories() {
  return api
    .get("/categories")
    .then((response: AxiosResponse) => response.data.categories)
    .catch(handleError);
}

export async function getMenuItems(id: string) {
  return api
    .get(`/${id}/menu-list`)
    .then((response: AxiosResponse) => response.data.menu)
    .catch(handleError);
}

export async function addMenu(menu: menuItem) {
  const token = localStorage.getItem("token");
  return api
    .post(`/${menu.id}/add-menu`, menu, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response: AxiosResponse) => response.data)
    .catch(handleError);
}

export async function editMenu(menu: menuItem) {
  const token = localStorage.getItem("token");
  return api
    .post(`/${menu.id}/edit-menu`, menu, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response: AxiosResponse) => response.data)
    .catch(handleError);
}

export async function addToCart(menuid: number) {
  const token = localStorage.getItem("token");
  return api
    .post(
      `/${menuid}/add-to-cart`,
      { menuid },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then((response: AxiosResponse) => response.data)
    .catch(handleError);
}

export async function removeCartItem(menuid: number) {
  const token = localStorage.getItem("token");
  return api
    .post(
      `/${menuid}/remove-cart-item`,
      { menuid },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then((response: AxiosResponse) => response.data)
    .catch(handleError);
}

export async function viewCart() {
  const token = localStorage.getItem("token");
  return api
    .get("/view-cart", { headers: { Authorization: `Bearer ${token}` } })
    .then((response: AxiosResponse) => response.data)
    .catch(handleError);
}

export async function checkout(checkoutItems: checkoutType) {
  const token = localStorage.getItem("token");
  return api
    .post(`/${checkoutItems.restaurant_id}/checkout`, checkoutItems, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response: AxiosResponse) => response.data)
    .catch(handleError);
}

export async function myOrders(
  ordertype: "pending" | "history" | "accepted" | "ready" | "history"
) {
  const token = localStorage.getItem("token");
  return api
    .get(`/${ordertype}/my-orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response: AxiosResponse) => response.data)
    .catch(handleError);
}

export async function getLocation() {
  return api
    .get("/locations")
    .then((response: AxiosResponse) => response.data)
    .catch(handleError);
}

export async function updateOrderStatus(content: {
  orderId: number;
  status: string;
  code?: string;
}) {
  const token = localStorage.getItem("token");
  return api
    .post(
      `/${content.orderId}/${content.status}/update-order-status`,
      {
        code: content.code,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then((response: AxiosResponse) => response.data)
    .catch(handleError);
}

export async function setDriverStatus(status: "offline" | "online") {
  const token = localStorage.getItem("token");
  return api
    .post(
      `/${status}/driver-status-update`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then((response: AxiosResponse) => response.data)
    .catch(handleError);
}

function handleError(error: AxiosError) {
  if (error.code === "ERR_NETWORK") {
    throw new Error("Network error: Unable to reach the server.");
  }
  console.error(error);
  throw error.response?.data;
}
