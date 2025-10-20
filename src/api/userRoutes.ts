import { AxiosResponse } from "axios";
import api from "./apiClient";
import { handleError } from "./apiClient";

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
