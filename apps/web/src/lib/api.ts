import createFetchClient, { Middleware } from "openapi-fetch";
import { getWebRequest, setCookie } from "@tanstack/react-start/server";
import { createIsomorphicFn } from "@tanstack/react-start";
import { paths } from "api/generated/openapi";
import createClient from "openapi-react-query";

const middleware: Middleware = {
  async onResponse({ response }) {
    if (!response.ok) {
      throw new Error(
        `${response.url}: ${response.status} ${response.statusText}`
      );
    }
  }
};

export function $api() {
  const apiUrl = import.meta.env.VITE_API_URL;

  return createIsomorphicFn()
    .server(() => {
      const { headers } = getWebRequest();
      const client = createFetchClient<paths>({
        baseUrl: apiUrl,
        headers: Object.fromEntries(headers),
        credentials: "include"
      });
      client.use(middleware);
      return createClient(client);
    })
    .client(() => {
      const client = createFetchClient<paths>({
        baseUrl: apiUrl,
        fetch: (input: RequestInfo | URL, init?: RequestInit) => {
          return fetch(input, {
            ...init,
            credentials: "include"
          });
        }
      });
      client.use(middleware);
      return createClient(client);
    })();
}

export function fetchClient() {
  const apiUrl = import.meta.env.VITE_API_URL;

  return createIsomorphicFn()
    .server(() => {
      const { headers } = getWebRequest();
      const client = createFetchClient<paths>({
        baseUrl: apiUrl,
        headers: Object.fromEntries(headers),
        credentials: "include"
      });
      client.use(middleware);
      return client;
    })
    .client(() => {
      const client = createFetchClient<paths>({
        baseUrl: apiUrl,
        fetch: (input: RequestInfo | URL, init?: RequestInit) => {
          return fetch(input, {
            ...init,
            credentials: "include"
          });
        }
      });
      client.use(middleware);
      return client;
    })();
}
