import { useQuery, type QueryOptions } from "@tanstack/react-query";
import { apiUrlPrimary, apiUrlSecondary, tokenKey } from "../utils/env";

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
  queryConfig?: Omit<QueryOptions<T>, "queryKey" | "queryFn">
) => {
  const queryKey = [
    options.endpoint,
    options.params ?? null,
    options.method ?? "GET",
  ];

  const fetchFn = async (): Promise<T> => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem(tokenKey || "")
        : undefined;

    const isFormData = options.body instanceof FormData;
    const headers: Record<string, string> = {
      ...(token ? { Authorization: token } : {}),
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
