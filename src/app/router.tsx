import {
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import type { FC } from "react";
import Layout from "./layout";
import NotFound from "./not-found";
import getTokenFromCookies from "../utils/get-token";

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
            beforeLoad: () => {
              if (!getTokenFromCookies()) {
                throw redirect({ to: "/login" });
              }
            },
          }),
    });
  });

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
