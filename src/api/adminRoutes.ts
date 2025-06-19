import api from "./apiClient";

export async function getContacts(page?: string) {
  const token = localStorage.getItem("token");
  return api
    .get(`/contacts?page=${page || "1"}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 90000,
    })
    .then(function (response) {
      console.log(response);
      return response;
    })
    .catch(function (error) {
      if (error.code === "ERR_NETWORK") {
        throw new Error("Network error: Unable to reach the server.");
      }

      throw error.response?.data;
    });
}

export async function setContactStatus(payload: {
  contactId: string;
  status: string;
}) {
  const token = localStorage.getItem("token");
  return api
    .post(
      `/${payload.contactId}/update-contact-status`,
      { status: payload.status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 90000,
      }
    )
    .then(function (response) {
      console.log(response);
      return response;
    })
    .catch(function (error) {
      if (error.code === "ERR_NETWORK") {
        throw new Error("Network error: Unable to reach the server.");
      }

      throw error.response?.data;
    });
}
