import { AxiosResponse, AxiosError } from "axios";
import axios from "axios";

const apiUrl = "http://bhuorder.com.ng/api";

interface menuItem {
  name: string;
  description: string;
  category_id: number;
  price: number;
  image: File;
}

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

export async function getRestaurantMenu(id: string) {
  return axios
    .get(`${apiUrl}/${id}/menu-list`, {
      timeout: 90000,
    })
    .then(function (response: AxiosResponse) {
      console.log(response.data);
      return response.data.restaurant_list;
    })
    .catch(function (error: AxiosError) {
      console.log(error);
      throw error.response?.data;
    });
}

export async function addMenu(
  token: string | null,
  id: string,
  menu: menuItem
) {
  return axios
    .post(
      `${apiUrl}/${id}/add-menu`,
      menu, // empty body or whatever body your API expects
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
