import { createContext, useContext } from "react";
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
  const { token } = useAuth();
  const { data } = useReactQuery<ClientContextType>(
    { endpoint: "stats" },
    { enabled: Boolean(token), retry: 1 }
  );
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
