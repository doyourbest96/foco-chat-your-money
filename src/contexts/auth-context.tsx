"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setCookie, deleteCookie } from "cookies-next";

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  isAuthenticated: false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token");
    }
    return null;
  });
  const router = useRouter();

  const setToken = (newToken: string | null) => {
    setTokenState(newToken);
    if (newToken) {
      localStorage.setItem("auth_token", newToken);
    } else {
      localStorage.removeItem("auth_token");
      deleteCookie("auth_token");
    }
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem("auth_token", token);
      setCookie("auth_token", token);
    } else {
      localStorage.removeItem("auth_token");
      deleteCookie("auth_token");
    }
  }, [token]);

  const isAuthenticated = !!token;

  const logout = () => {
    setToken(null);
    localStorage.removeItem("auth_token");
    deleteCookie("auth_token");
    router.push("/sign-in");
  };

  const value = {
    token,
    setToken,
    isAuthenticated,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
