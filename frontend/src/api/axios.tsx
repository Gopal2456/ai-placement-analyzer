import axios from "axios";
import router from "next/router";

console.log(
  "NEXT_PUBLIC_API_URL:",
  process.env.NEXT_PUBLIC_API_URL
);

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
   headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (typeof window !== "undefined") {
        router.push("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
