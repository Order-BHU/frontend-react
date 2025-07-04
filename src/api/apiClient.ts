/*I had an issue where i had to check if the response was 401 and for that, I'll need my api calls to share a single axios
instance instead of creating a new instance for every api call. So now they all use this*/
import axios, { AxiosError } from "axios";
import useAuthStore from "@/stores/useAuthStore"; // Import auth store

const api = axios.create({
  baseURL: "https://bhuorder.com.ng/api",
  timeout: 90000,
});

// Interceptor to handle 401 responses
api.interceptors.response.use(
  (response) => response, // Return response if successful
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      const { logout } = useAuthStore.getState(); // Get logout function
      logout(); // Clear session
      if (window.location.pathname !== "/login") {
        // Redirect to login page only if we aren't already in the login page
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export function handleError(error: AxiosError) {
  if (error.code === "ERR_NETWORK") {
    throw new Error("Network error: Unable to reach the server.");
  }

  throw error.response?.data;
}

export default api;
