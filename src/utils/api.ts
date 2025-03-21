import axios from "axios";

const API_URL = "https://tseep-backend.onrender.com";

const APIClientPrivate = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

APIClientPrivate.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

APIClientPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const res = await axios.post(`${API_URL}/api/refresh`, { refreshToken });

        if (res.status === 200) {
          const newAccessToken = res.data.accessToken;
          localStorage.setItem("accessToken", newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return APIClientPrivate(originalRequest);
        }
      } catch (err) {
        console.error("Refresh token failed", err);
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const APIClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
export default APIClientPrivate;