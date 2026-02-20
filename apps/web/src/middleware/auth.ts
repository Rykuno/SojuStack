import { redirect } from '@tanstack/react-router';
import { createMiddleware } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import { authClient } from '@/lib/auth-client';

export const isNotAuthenticated = createMiddleware().server(async ({ next }) => {
  const headers = getRequestHeaders();
  const session = await authClient().getSession({ fetchOptions: { headers } });
  if (session.data?.session) throw redirect({ to: '/' });

  return await next();
});

export const isAuthenticated = createMiddleware().server(async ({ next }) => {
  const headers = getRequestHeaders();
  const session = await authClient().getSession({ fetchOptions: { headers } });

  if (!session.data?.session) throw redirect({ to: '/login' });

  return await next({
    context: {
      session: session.data.session,
    },
  });
});
