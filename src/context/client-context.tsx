import { createContext, useContext, useEffect } from "react";
import { useReactQuery } from "../hooks/use-query";
import { useAuth } from "./auth-context";

export type ClientContextType = {
  unread_ticket: number;
  cart_count: number;
  unread_discount: number;
  unread_message: number;
};

const ClientContext = createContext<ClientContextType | null>(null);

export const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const { data, refetch } = useReactQuery<ClientContextType>(
    { endpoint: "stats" },
    { enabled: false }
  );
  useEffect(() => {
    if (isAuthenticated) {
      refetch();
    }
  }, [isAuthenticated]);
  return (
    <ClientContext.Provider
      value={
        data || {
          cart_count: 0,
          unread_discount: 0,
          unread_message: 0,
          unread_ticket: 0,
        }
      }
    >
      {children}
    </ClientContext.Provider>
  );
};
// eslint-disable-next-line react-refresh/only-export-components
export const useClient = () => {
  const ctx = useContext(ClientContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
