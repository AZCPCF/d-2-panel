import { useMutation, type MutationOptions } from "@tanstack/react-query";
import { apiUrlPrimary, apiUrlSecondary } from "../utils/env";
import getTokenFromCookies from "../utils/get-token";

type RequestOptions = {
  endpoint: string;
  method?: "POST" | "PUT" | "DELETE" | "PATCH"; // GET is not needed for mutation
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

export const useReactMutation = <
  TData = unknown,
  TVariables extends RequestOptions = RequestOptions
>(
  mutationConfig?: Omit<MutationOptions<TData, Error, TVariables>, "mutationFn">
) => {
  const mutationFn = async (options: TVariables): Promise<TData> => {
    const token = getTokenFromCookies()
    const isFormData = options.body instanceof FormData;
    const headers: Record<string, string> = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const query = buildQueryString(options.params);
    const res = await fetch(
      `${options.apiUrl === "secondary" ? apiUrlSecondary : apiUrlPrimary}${
        options.endpoint
      }${query}`,
      {
        method: options.method || "POST",
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

  return useMutation<TData, Error, TVariables>({
    mutationFn,
    ...mutationConfig,
  });
};
