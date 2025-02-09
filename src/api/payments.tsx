import { AxiosResponse, AxiosError } from "axios";
import api from "./payStackGlobal";
import { subaccount } from "@/interfaces/paymentType";

const secretKey = "sk_test_aed324bcb6181b0f29a204b52010dae9847036af";
function handleError(error: AxiosError) {
  if (error.code === "ERR_NETWORK") {
    throw new Error("Network error: Unable to reach the server.");
  }
  console.error(error);
  throw error.response?.data;
}

export async function makeSubaccount(data: subaccount) {
  return api
    .post("/subaccount", data, {
      headers: { Authorization: `Authorization: Bearer ${secretKey}` },
    })
    .then((response: AxiosResponse) => response.data)
    .catch(handleError);
}

export async function makePayment(data: { email: string; amount: string }) {
  return api
    .post("/transaction/initialize", data, {
      headers: { Authorization: `Authorization: Bearer ${secretKey}` },
    })
    .then((response: AxiosResponse) => response.data)
    .catch(handleError);
}
