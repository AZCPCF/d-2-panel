import { useQuery, type QueryObserverOptions } from "@tanstack/react-query";
import { useAuth } from "../context/auth-context";
import { apiUrlPrimary, apiUrlSecondary } from "../utils/env";

type RequestOptions = {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined | string[]>;
  apiUrl?: "primary" | "secondary";
};

const buildQueryString = (params?: RequestOptions["params"]): string => {
  return params
    ? `?${new URLSearchParams(
        Object.entries(params).reduce<Record<string, string>>((acc, [k, v]) => {
          if (v !== undefined) acc[k] = String(v);
          return acc;
        }, {})
      ).toString()}`
    : "";
};

export const useReactQuery = <T>(
  options: RequestOptions,
  queryConfig?: Omit<QueryObserverOptions<T>, "queryKey" | "queryFn">
) => {
  const queryKey = [
    options.endpoint,
    options.params ?? null,
    options.method ?? "GET",
  ];
  const { logout, token } = useAuth();
  const fetchFn = async (): Promise<T> => {
    const isFormData = options.body instanceof FormData;
    const headers: Record<string, string> = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    if (!isFormData && options.method !== "GET") {
      headers["Content-Type"] = "application/json";
    }

    const query = buildQueryString(options.params);
    const res = await fetch(
      `${options.apiUrl === "secondary" ? apiUrlSecondary : apiUrlPrimary}${
        options.endpoint
      }${query}`,
      {
        method: options.method || "GET",
        headers,
        body: isFormData
          ? (options.body as FormData)
          : options.body
          ? JSON.stringify(options.body)
          : undefined,
      }
    );
    if (res.status == 401) {
      logout();
    }
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`API ${res.status}: ${res.statusText} - ${errorText}`);
    }

    return res.json();
  };

  return useQuery<T>({
    queryKey,
    queryFn: fetchFn,
    ...queryConfig,
  });
};
