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
      const data = error.response.data as { message?: string };

      if (data.message?.includes("verified")) {
        console.log("not ver ", error);
      } else if (!error.message.includes("verified")) {
        console.log(error);
        const { logout } = useAuthStore.getState();
        logout();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
