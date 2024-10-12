import axios from "@/api/axios";
import React, { createContext, useState, ReactNode, useEffect } from "react";

export interface AuthContextType {
  auth: AuthState;
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
  isAuthenticated: () => boolean;
  logout: () => void;
}

export interface AuthState {
  user?: string;
  accessToken?: string;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const storedToken = localStorage.getItem("accessToken");
    return storedToken ? { accessToken: storedToken } : {};
  });

  useEffect(() => {
    if (auth.accessToken) {
      localStorage.setItem("accessToken", auth.accessToken);
    } else {
      localStorage.removeItem("accessToken");
    }
  }, [auth.accessToken]);

  const isAuthenticated = () => !!auth.accessToken;

  const logout = async () => {
    try {
      const response = await axios.post("/auth/logout", {}, { withCredentials: true });
      if (response.status === 204) {
        setAuth({});
        localStorage.removeItem("accessToken");
        window.location.href = "/";
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
