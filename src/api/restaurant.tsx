import { AxiosResponse, AxiosError } from "axios";
import axios from "axios";

const apiUrl = "http://bhuorder.com.ng/api";

export async function getRestaurants() {
  return axios
    .get(`${apiUrl}/restaurant-list`, {
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
