import axios, { AxiosError } from "axios";
import useAuthStore from "@/stores/useAuthStore"; // Import auth store

const api = axios.create({
  baseURL: "https://api.paystack.co",
  timeout: 90000,
});

// Interceptor to handle 401 responses
api.interceptors.response.use(
  (response) => response, // Return response if successful
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      const { logout } = useAuthStore.getState(); // Get logout function
      logout(); // Clear session
      window.location.href = "/login"; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default api;
