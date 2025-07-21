import { RouterProvider } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { createRouterFn } from "./app/router";
import { useAuth } from "./context/auth-context";
import { applyStoredTheme } from "./utils/toggle-theme";
import { Toaster } from "sonner";

export default function App() {
  useEffect(() => {
    applyStoredTheme();
  }, []);
  const auth = useAuth();
  const router = useMemo(() => createRouterFn(auth.token), [auth.token]);
  return (
    <>
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
      <RouterProvider router={router} />
    </>
  );
}
