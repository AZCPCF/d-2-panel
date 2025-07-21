import { createContext, useContext, useEffect, useState } from "react";
import { tokenKey } from "../utils/env";
import getTokenFromCookies from "../utils/get-token";
import Cookies from "js-cookie";
type AuthContextType = {
  token: string | undefined;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | undefined>(undefined);
  useEffect(() => {
    const cookieToken = getTokenFromCookies();
    setToken(cookieToken);
  }, []);
  const login = (newToken: string) => {
    Cookies.set(tokenKey || "", newToken, {
      expires: 365,
      // domain: ".vercel.app",
    });
    setToken(newToken);
  };

  const logout = () => {
    Cookies.remove(tokenKey || "");
    setToken(undefined);
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
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
