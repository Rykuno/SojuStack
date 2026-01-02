import createClient, { Middleware } from 'openapi-fetch'
import { getRequest } from '@tanstack/react-start/server'
import { createIsomorphicFn } from '@tanstack/react-start'
import { paths } from 'api/generated/openapi'

const middleware: Middleware = {
  async onResponse({ response }) {
    if (!response.ok) {
      throw new Error(
        `${response.url}: ${response.status} ${response.statusText}`,
      )
    }
  },
}

export function apiClient() {
  const apiUrl = import.meta.env.VITE_API_URL

  return createIsomorphicFn()
    .server(() => {
      const { headers } = getRequest()
      const client = createClient<paths>({
        baseUrl: apiUrl,
        headers: Object.fromEntries(headers),
        credentials: 'include',
      })
      client.use(middleware)

      return client
    })
    .client(() => {
      const client = createClient<paths>({
        baseUrl: apiUrl,
        fetch: (input: RequestInfo | URL, init?: RequestInit) => {
          // const sessionId = posthog.get_session_id?.();
          return fetch(input, {
            ...init,
            credentials: 'include',
            headers: {
              ...init?.headers,
              ...Object.fromEntries((input as Request).headers),
              // ...(sessionId && { "x-posthog-session-id": sessionId }),
            },
          })
        },
      })
      client.use(middleware)
      return client
    })()
}
