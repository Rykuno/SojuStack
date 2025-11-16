import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { emailOTPClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const $authClient = createIsomorphicFn()
  .server(() => {
    const { headers } = getRequest();
    return createAuthClient({
      baseURL: import.meta.env.VITE_API_URL,
      basePath: "/auth/client",
      plugins: [emailOTPClient()],
      fetchOptions: {
        headers: Object.fromEntries(headers),
        credentials: "include"
      }
    });
  })
  .client(() => {
    return createAuthClient({
      baseURL: import.meta.env.VITE_API_URL,
      basePath: "/auth/client",
      plugins: [emailOTPClient()],
      fetchOptions: {
        credentials: "include"
      }
    });
  })();
