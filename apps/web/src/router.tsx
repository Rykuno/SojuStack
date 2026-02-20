import { QueryClient } from '@tanstack/react-query';
import { createRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
import { NotFound } from './components/not-found';

// Import the generated route tree
import { routeTree } from './routeTree.gen';
import { DefaultCatchBoundary } from './components/default-catch-boundry';

// Create a new router instance
export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
  });
  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  });

  return router;
};
