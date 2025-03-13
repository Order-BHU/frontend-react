import { AxiosResponse, AxiosError } from "axios";
import { menuItem, checkoutType } from "@/interfaces/restaurantType";
import api from "./apiClient";

function handleError(error: AxiosError) {
  if (error.code === "ERR_NETWORK") {
    throw new Error("Network error: Unable to reach the server.");
  }
  console.error(error);
  throw error.response?.data;
}

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
    .then((response: AxiosResponse) => {
      console.log("menuItems: ", response.data);
      return response.data.menu;
    })
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
    .then((response: AxiosResponse) => {
      console.log("cart data: ", response.data);
      return response.data;
    })
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
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch(handleError);
}

export async function trackOrder(orderId: number) {
  const token = localStorage.getItem("token");
  return api
    .get(`/${orderId}/track-order`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response: AxiosResponse) => {
      return response.data;
    })
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

export async function deleteMenuItem(menuid: number) {
  const token = localStorage.getItem("token");
  return api
    .post(
      `/${menuid}/delete-menu`,
      { menuid },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then((response: AxiosResponse) => response.data)
    .catch(handleError);
}

export async function updateItemAvailability(data: {
  menuid: number;
  value: "1" | "0";
}) {
  const token = localStorage.getItem("token");
  return api
    .post(
      `/${data.menuid}/update-availability`,
      { is_available: data.value },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then((response: AxiosResponse) => response.data)
    .catch(handleError);
}

//PAYMENTS
export async function initializeCheckout(data: {
  restaurantId: string;
  total: number;
  callback_id: string;
}) {
  const token = localStorage.getItem("token");
  return api
    .post(
      `/${data.restaurantId}/initialize-checkout`,
      { total: data.total, callback_id: data.callback_id },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then((response: AxiosResponse) => {
      console.log("checkout stuff: ", response.data);
      return response.data;
    })
    .catch(handleError);
}
