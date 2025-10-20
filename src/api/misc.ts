import { AxiosResponse } from "axios";
import api from "./apiClient";
import { CartItem } from "@/pages/Menupage/Menupage";
import { handleError } from "./apiClient";
import { paymentVerifyType } from "@/interfaces/restaurantType";

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

export async function getLocation() {
  return api
    .get("/locations")
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
