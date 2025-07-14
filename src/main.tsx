import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { StrictMode, useMemo } from "react";
import ReactDOM from "react-dom/client";
import { createRouterFn } from "./app/router";
import { AuthProvider, useAuth } from "./context/auth-context";
import { applyStoredTheme } from "./utils/toggle-theme";
import { Toaster } from "sonner";
import "./index.css";
const queryClient = new QueryClient();
applyStoredTheme();
function RouterWithAuth() {
  const auth = useAuth();
  const router = useMemo(() => createRouterFn(auth.token), [auth.token]);

  return <RouterProvider router={router} />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster
      position="top-center"
      gap={4}
      duration={2000}
      toastOptions={{
        classNames: {
          toast: "!bg-gray-50 dark:!bg-slate-900 dark:!border-slate-900",
          title: "text-lg font-bold",
          success: "!text-teal-500",
          error: "!text-red-500",
          warning: "!text-yellow-500",
          info: "!text-blue-500",
          description: "!text-sm !text-zinc-400",
        },
      }}
    />
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterWithAuth />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
