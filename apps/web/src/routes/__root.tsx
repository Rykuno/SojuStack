import { lazy, Suspense } from 'react';
import { HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';
import { DefaultCatchBoundary } from '@/components/default-catch-boundary';
import { NotFound } from '@/components/not-found';
import { AuthProvider } from '@/contexts/auth';
import { Spinner } from '@/components/ui/spinner';
import { api } from '@/lib/api';
import appCss from '../styles.css?url';

const AppDevtools = import.meta.env.DEV
  ? lazy(() =>
      import('@/lib/devtools/app-devtools').then((m) => ({
        default: m.AppDevtools,
      })),
    )
  : null;

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'SojuStack',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(api.auth.sessionQueryOptions());
  },
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <HeadContent />
      </head>
      <body>
        <Suspense
          fallback={
            <div className='flex min-h-screen items-center justify-center'>
              <Spinner className='h-10 w-10' />
            </div>
          }
        >
          <AuthProvider>{children}</AuthProvider>
        </Suspense>
        {AppDevtools ? <AppDevtools /> : null}
        <Scripts />
      </body>
    </html>
  );
}
