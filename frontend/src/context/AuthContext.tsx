// "use client";

// import {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   ReactNode,
// } from "react";
// import { useRouter } from "next/navigation";
// import api from "@/api/axios";

// interface User {
//   _id: string;
//   name: string;
//   email: string;
// }

// interface AuthContextType {
//   user: User | null;
//   token: string | null;
//   isAuthenticated: boolean;
//   loading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({
//   children,
// }: {
//   children: ReactNode;
// }) => {
//   const router = useRouter();

//   const [token, setToken] = useState<string | null>(() => {
//     if (typeof window === "undefined") return null;
//     return localStorage.getItem("token");
//   });

//   const [user, setUser] = useState<User | null>(() => {
//     if (typeof window === "undefined") return null;

//     const storedUser = localStorage.getItem("user");

//     if (!storedUser) return null;

//     try {
//       return JSON.parse(storedUser) as User;
//     } catch {
//       localStorage.removeItem("user");
//       localStorage.removeItem("token");
//       return null;
//     }
//   });

//   const [loading, setLoading] = useState(false);

//   const clearSession = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");

//     setToken(null);
//     setUser(null);
//     setLoading(false);
//   };

//   const logout = () => {
//     clearSession();
//     router.replace("/login");
//   };

//   useEffect(() => {
//     const interceptorId = api.interceptors.response.use(
//       (response) => response,
//       (error) => {
//         const requestUrl = error.config?.url ?? "";

//         if (
//           error.response?.status === 401 &&
//           !requestUrl.includes("/auth/login")
//         ) {
//           clearSession();
//           router.replace("/login");
//         }

//         return Promise.reject(error);
//       }
//     );

//     return () => {
//       api.interceptors.response.eject(interceptorId);
//     };
//   }, [router]);

//   const login = async (email: string, password: string) => {
//     const response = await api.post("/auth/login", {
//       email,
//       password,
//     });

//     const {
//       token: newToken,
//       user: newUser,
//     } = response.data;

//     if (!newToken || !newUser) {
//       throw new Error("Login response is missing token or user");
//     }

//     localStorage.setItem("token", newToken);
//     localStorage.setItem("user", JSON.stringify(newUser));

//     setToken(newToken);
//     setUser(newUser);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         token,
//         isAuthenticated: Boolean(token),
//         loading,
//         login,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);

//   if (!context) {
//     throw new Error("useAuth must be used inside AuthProvider");
//   }

//   return context;
// };

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import api, { setUnauthorizedHandler } from "@/api/axios";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Returns the expiry time in ms, or null if the token has no exp / can't be decoded
const getTokenExpiry = (token: string): number | null => {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
};

const isTokenExpired = (token: string) => {
  const exp = getTokenExpiry(token);
  return exp !== null && exp <= Date.now();
};

const readStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("token");
  if (!stored) return null;
  if (isTokenExpired(stored)) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return null;
  }
  return stored;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(readStoredToken);

  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    if (!readStoredToken()) return null;

    const storedUser = localStorage.getItem("user");
    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser) as User;
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return null;
    }
  });

  const [loading] = useState(false);

  const clearSession = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    router.replace("/login");
  }, [clearSession, router]);

  // Any 401 from the API → log out
  useEffect(() => {
    setUnauthorizedHandler(logout);
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  // Log out automatically the moment the token expires

  useEffect(() => {
    if (!token) return;

    const exp = getTokenExpiry(token);
    if (exp === null) return;

    // Clamp to the setTimeout max (~24.8 days). If the delay is 0 or negative,
    // the timer fires on the next tick, so no synchronous setState happens here.
    const delay = Math.min(Math.max(exp - Date.now(), 0), 2_147_483_647);
    const timer = setTimeout(logout, delay);

    return () => clearTimeout(timer);
  }, [token, logout]);

  const login = async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    const { token: newToken, user: newUser } = response.data;

    if (!newToken || !newUser) {
      throw new Error("Login response is missing token or user");
    }

    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token),
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
