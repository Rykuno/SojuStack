import { HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { TanStackDevtools } from '@tanstack/react-devtools';
import TanStackQueryProvider from '../integrations/tanstack-query/root-provider';
import { TanStackQueryDevtools } from '../integrations/tanstack-query/devtools';
import { MailpitDevtools } from '../integrations/mailpit/devtools';
import { DrizzleStudioDevtools } from '../integrations/drizzle/devtools';
import { ReactEmailDevtools } from '../integrations/react-email/devtools';
import { OpenAPIDevtools } from '../integrations/openapi/devtools';
import { RustFSDevtools } from '../integrations/rust-fs/devtools';
import appCss from '../styles.css?url';
import { type QueryClient } from '@tanstack/react-query';
import { Toaster } from '#/components/ui/sonner';

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
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
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <TanStackQueryProvider>
          {children}
          <Toaster />
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
              TanStackQueryDevtools,
              RustFSDevtools,
              MailpitDevtools,
              DrizzleStudioDevtools,
              ReactEmailDevtools,
              OpenAPIDevtools,
            ]}
          />
        </TanStackQueryProvider>
        <Scripts />
      </body>
    </html>
  );
}
