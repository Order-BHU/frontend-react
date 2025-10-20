import { AxiosResponse } from "axios";
import api from "./apiClient";
import { handleError } from "./apiClient";

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
