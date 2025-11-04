import { AxiosResponse } from "axios";
import { menuItem, paymentVerifyType } from "@/interfaces/restaurantType";
import api from "./apiClient";
import { CartItem } from "@/pages/Menupage/Menupage";
import { handleError } from "./apiClient";

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
      return response.data;
    })
    .catch(handleError);
}

export async function addMenu(menu: menuItem) {
  const token = localStorage.getItem("BHUO-token");
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
  const token = localStorage.getItem("BHUO-token");

  return api
    .post(`/${menu.id}/edit-menu`, menu, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response: AxiosResponse) => {
      console.log("resposn: ", response.data);
      return response.data;
    })
    .catch(handleError);
}

export async function addToCart(menuid: number) {
  const token = localStorage.getItem("BHUO-token");
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
  const token = localStorage.getItem("BHUO-token");
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
  const token = localStorage.getItem("BHUO-token");
  return api
    .get("/view-cart", { headers: { Authorization: `Bearer ${token}` } })
    .then((response: AxiosResponse) => {
      return response.data.cart_items;
    })
    .catch(handleError);
}

export async function paymentVerify(verifyItems: paymentVerifyType) {
  const token = localStorage.getItem("BHUO-token");
  return api
    .post(
      `/${verifyItems.restaurant_id}/checkout`,
      { reference: verifyItems.reference },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch(handleError);
}

export async function myOrders(
  ordertype: "pending" | "delivering" | "accepted" | "ready" | "history"
) {
  const token = localStorage.getItem("BHUO-token");
  return api
    .get(`/${ordertype}/my-orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch(handleError);
}

export async function trackOrder() {
  const token = localStorage.getItem("BHUO-token");
  return api
    .get(`/track-order`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response: AxiosResponse) => {
      console.log(response.data);
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
  const token = localStorage.getItem("BHUO-token");
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
  const token = localStorage.getItem("BHUO-token");
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
  const token = localStorage.getItem("BHUO-token");
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
  value: 1 | 0;
}) {
  const token = localStorage.getItem("BHUO-token");
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
  location: string;
  items: CartItem[];
}) {
  const token = localStorage.getItem("BHUO-token");
  return api
    .post(
      `/${data.restaurantId}/initialize-checkout`,
      {
        total: data.total,
        callback_id: data.callback_id,
        location: data.location,
        items: data.items,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch(handleError);
}
