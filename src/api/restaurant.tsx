import { AxiosResponse, AxiosError } from "axios";
import axios from "axios";

const url: string = "http://bhuorder.com.ng/api/";

export async function getRestaurants() {
  return axios
    .get(`${url}/restaurant-list`, {
      timeout: 90000,
    })
    .then(function (response: AxiosResponse) {
      console.log(response.data);
    })
    .catch(function (error: AxiosError) {
      console.log(error);
      throw error.response?.data;
    });
}
