
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const url = originalRequest?.url || "";

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      url.includes("/user/login") ||
      url.includes("/user/refreshToken")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = api
          .post("/user/refreshToken", {})
          .finally(() => {
            refreshPromise = null;
          });
      }

      await refreshPromise;

      return api(originalRequest);

    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
);

export default api;
