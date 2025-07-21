import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { AuthProvider } from "./auth-context";
import { ClientProvider } from "./client-context";
export default function Provider({
  children,
  client,
}: {
  children: ReactNode;
  client: QueryClient;
}) {
  return (
    <QueryClientProvider client={client}>
      <AuthProvider>
        <ClientProvider>{children}</ClientProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
