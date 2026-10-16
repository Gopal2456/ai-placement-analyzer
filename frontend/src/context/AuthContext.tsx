// "use client";

// import { createContext, useContext, useState, ReactNode } from "react";

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

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export const AuthProvider = ({ children }: AuthProviderProps) => {
//   const [token, setToken] = useState<string | null>(() => {
//     if (typeof window === "undefined") {
//       return null;
//     }

//     return localStorage.getItem("token");
//   });

//   const [user, setUser] = useState<User | null>(() => {
//     if (typeof window === "undefined") {
//       return null;
//     }

//     const storedUser = localStorage.getItem("user");

//     if (!storedUser) {
//       return null;
//     }

//     try {
//       return JSON.parse(storedUser) as User;
//     } catch (error) {
//       console.error("Failed to restore user:", error);
//       localStorage.removeItem("user");
//       return null;
//     }
//   });

//   const [loading, setLoading] = useState(false);

//   const login = async (email: string, password: string) => {
//     const response = await api.post("/auth/login", {
//       email,
//       password,
//     });

//     const { token, user } = response.data;

//     if (!token) {
//       throw new Error("Login token was not received");
//     }

//     localStorage.setItem("token", token);
//     localStorage.setItem("user", JSON.stringify(user));

//     setToken(token);
//     setUser(user);
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");

//     setToken(null);
//     setUser(null);
//     setLoading(false);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         token,
//         isAuthenticated: !!token,
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
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import api from "@/api/axios";

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

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
    setLoading(false);

    router.replace("/login");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser) as User);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const interceptorId = api.interceptors.response.use(
      (response) => response,
      (error) => {
        const requestUrl = error.config?.url ?? "";

        // Don't log out for invalid login credentials.
        if (
          error.response?.status === 401 &&
          !requestUrl.includes("/auth/login")
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          setToken(null);
          setUser(null);
          setLoading(false);

          router.replace("/login");
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptorId);
    };
  }, [router]);

  const login = async (email: string, password: string) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { token: newToken, user: newUser } = response.data;

    if (!newToken) {
      throw new Error("Login token was not received");
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
        isAuthenticated: !!token,
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

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
