import {
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import type { FC } from "react";
import Layout from "./layout";
import NotFound from "./not-found";

// --- Router Context Type ---
export type RouterContext = {
  auth: {
    isAuthenticated: boolean;
    token: string | null;
  };
};

const rootRoute = createRootRoute({
  component: Layout,
});

// --- Load all pages dynamically ---
const pages = import.meta.glob("./**/page.tsx", { eager: true });

// --- Create Router Factory ---
export const createRouterFn = (token: string | null) => {
  const routes = Object.entries(pages).map(([filePath, mod]) => {
    const component = (mod as { default: FC }).default;

    // Convert file path to route path
    let path = filePath
      .replace("./", "")
      .replace("page.tsx", "")
      .replace(/\/$/, "")
      .replace(/\[([^\]]+)\]/g, (_match, p1) => `$${p1}`);

    path = path === "" ? "/" : path;
    const isLogin = path === "login";

    return createRoute({
      path,
      getParentRoute: () => rootRoute,
      component,
      ...(isLogin
        ? {}
        : {
            beforeLoad: ({ context }) => {
              if (!context.auth.isAuthenticated) {
                throw redirect({ to: "/login" });
              }
            },
          }),
    });
  });

  // Separate login and protected routes

  // Build route tree
  const routeTree = rootRoute.addChildren(routes);

  // Create and return router
  return createRouter({
    routeTree,
    context: {
      auth: {
        isAuthenticated: !!token,
        token,
      },
    } satisfies RouterContext,
    defaultNotFoundComponent: NotFound,
  });
};
