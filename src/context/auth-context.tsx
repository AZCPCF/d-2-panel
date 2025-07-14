import { createContext, useContext, useState, useEffect } from "react";
import getTokenFromCookies from "../utils/get-token";
import { tokenKey } from "../utils/env";

type AuthContextType = {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const cookieToken = getTokenFromCookies();
    setToken(cookieToken);
  }, []);
  const login = (newToken: string) => {
    const oneYearInSeconds = 60 * 60 * 24 * 365;
    document.cookie = `${tokenKey}=${newToken}; path=/; max-age=${oneYearInSeconds}; secure; SameSite=Lax`;
    setToken(newToken);
  };

  const logout = () => {
    document.cookie = `${tokenKey}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
