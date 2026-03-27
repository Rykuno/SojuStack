import { browser } from '$app/environment';
import { api } from '$lib/integrations/api';
import { QueryClient } from '@tanstack/svelte-query';

export async function load({ fetch }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser,
      },
    },
  });

  const apiClient = api(fetch);
  await queryClient.prefetchQuery(apiClient.auth.session());

  return { queryClient, api: apiClient };
}
