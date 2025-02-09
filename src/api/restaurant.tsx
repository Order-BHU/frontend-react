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
  return api
    .post(`/${menu.id}/add-menu`, menu, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((response: AxiosResponse) => response.data)
    .catch(handleError);
}

export async function editMenu(menu: menuItem) {
  return api
    .post(`/${menu.id}/edit-menu`, menu, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((response: AxiosResponse) => response.data)
    .catch(handleError);
}

export async function addToCart(menuid: number) {
  return api
    .post(`/${menuid}/add-to-cart`, { menuid })
    .then((response: AxiosResponse) => response.data)
    .catch(handleError);
}

export async function removeCartItem(menuid: number) {
  return api
    .post(`/${menuid}/remove-cart-item`, { menuid })
    .then((response: AxiosResponse) => response.data)
    .catch(handleError);
}

export async function viewCart() {
  return api
    .get("/view-cart")
    .then((response: AxiosResponse) => response.data)
    .catch(handleError);
}

export async function checkout(checkoutItems: checkoutType) {
  return api
    .post(`/${checkoutItems.restaurant_id}/checkout`, checkoutItems)
    .then((response: AxiosResponse) => response.data)
    .catch(handleError);
}

export async function myOrders(
  ordertype: "pending" | "history" | "accepted" | "ready" | "history"
) {
  return api
    .get(`/${ordertype}/my-orders`)
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
  return api
    .post(`/${content.orderId}/${content.status}/update-order-status`, {
      code: content.code,
    })
    .then((response: AxiosResponse) => response.data)
    .catch(handleError);
}

export async function setDriverStatus(status: "offline" | "online") {
  return api
    .post(`/${status}/driver-status-update`, {})
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
