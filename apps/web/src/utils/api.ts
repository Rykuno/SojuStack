import createFetchClient, { Middleware } from "openapi-fetch";
import { getWebRequest } from "@tanstack/react-start/server";
import { createIsomorphicFn } from "@tanstack/react-start";
import { paths } from "api/generated/openapi";

const middleware: Middleware = {
  onResponse({ response }) {
    if (!response.ok) {
      throw new Error(
        `${response.url}: ${response.status} ${response.statusText}`
      );
    }
  }
};

export function apiClient() {
  const apiUrl = import.meta.env.VITE_API_URL;

  return createIsomorphicFn()
    .server(() => {
      const { headers } = getWebRequest();
      return createFetchClient<paths>({
        baseUrl: apiUrl,
        headers: Object.fromEntries(headers)
      });
    })
    .client(() => {
      return createFetchClient<paths>({
        baseUrl: apiUrl,
        fetch: (input: RequestInfo | URL, init?: RequestInit) => {
          return fetch(input, {
            ...init,
            credentials: "include"
          });
        }
      });
    })();
}
