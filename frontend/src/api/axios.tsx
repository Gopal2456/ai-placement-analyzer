// import axios from "axios";
// import router from "next/router";

// console.log(
//   "NEXT_PUBLIC_API_URL:",
//   process.env.NEXT_PUBLIC_API_URL
// );

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//    headers: {
//     "Content-Type": "application/json",
//   },
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");

//       if (typeof window !== "undefined") {
//         router.push("/login");
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// AuthProvider registers its logout function here, so a 401 clears
// the React state as well as localStorage.
let onUnauthorized: (() => void) | null = null;

export const setUnauthorizedHandler = (fn: (() => void) | null) => {
  onUnauthorized = fn;
};

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url: string = error.config?.url ?? "";

    if (error.response?.status === 401 && !url.includes("/auth/login")) {
      if (onUnauthorized) {
        onUnauthorized(); // AuthProvider's logout: clears state + redirects
      } else if (typeof window !== "undefined") {
        // Fallback if the provider hasn't mounted yet
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;