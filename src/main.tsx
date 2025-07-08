import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { StrictMode, useMemo } from "react";
import ReactDOM from "react-dom/client";
import { createRouterFn } from "./app/router";
import { AuthProvider, useAuth } from "./context/auth-context";
import { applyStoredTheme } from "./utils/toggle-theme";
import "./index.css"
const queryClient = new QueryClient();
applyStoredTheme();
function RouterWithAuth() {
  const auth = useAuth();
  const router = useMemo(() => createRouterFn(auth.token), [auth.token]);

  return <RouterProvider router={router} />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterWithAuth />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
