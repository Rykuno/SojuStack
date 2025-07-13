import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL,
  basePath: "/auth/client",
  fetchOptions: {
    onResponse: async context => {
      if (!context.response.ok) {
        throw new Error(
          `${context.response.url}: ${context.response.status} ${context.response.statusText}`
        );
      }
    },
    credentials: "include"
  }
});
