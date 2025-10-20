import { AxiosResponse } from "axios";
import { menuItem } from "@/interfaces/restaurantType";
import api from "./apiClient";
import { handleError } from "./apiClient";
export { setDriverStatus } from "./driverRoutes";
export { trackOrder } from "./userRoutes";
export {
  myOrders,
  addToCart,
  removeCartItem,
  viewCart,
  paymentVerify,
  getLocation,
  initializeCheckout,
} from "./misc";

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
