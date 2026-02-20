import { lazy, Suspense } from 'react'
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import appCss from '../styles.css?url'
import { QueryClient } from '@tanstack/react-query'
import { DefaultCatchBoundary } from '@/components/default-catch-boundry'
import { NotFound } from '@/components/not-found'
import { AuthProvider } from '@/contexts/auth'
import { Spinner } from '@/components/ui/spinner'

// Lazy load devtools - only loaded in development
const TanStackDevtools = lazy(() =>
  import('@tanstack/react-devtools').then((m) => ({
    default: m.TanStackDevtools,
  })),
)
const TanStackRouterDevtoolsPanel = lazy(() =>
  import('@tanstack/react-router-devtools').then((m) => ({
    default: m.TanStackRouterDevtoolsPanel,
  })),
)
const ReactQueryDevtoolsPanel = lazy(() =>
  import('@tanstack/react-query-devtools').then((m) => ({
    default: m.ReactQueryDevtoolsPanel,
  })),
)
const FormDevtoolsPanel = lazy(() =>
  import('@tanstack/react-form-devtools').then((m) => ({
    default: m.FormDevtoolsPanel,
  })),
)

const MailpitDevtoolsPanel = lazy(() =>
  import('@/lib/devtools/mailpit-devtools-panel').then((m) => ({
    default: m.MailpitDevtoolsPanel,
  })),
)
const RustFSDevtoolsPanel = lazy(() =>
  import('@/lib/devtools/rustfs-devtools-panel').then((m) => ({
    default: m.RustFSDevtoolsPanel,
  })),
)
const ReactEmailDevtoolsPanel = lazy(() =>
  import('@/lib/devtools/react-email-devtools-panel').then((m) => ({
    default: m.ReactEmailDevtoolsPanel,
  })),
)

const DrizzleStudioDevtoolsPanel = lazy(() =>
  import('@/lib/devtools/drizzle-studio-devtools.panel').then((m) => ({
    default: m.DrizzleStudioDevtoolsPanel,
  })),
)

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
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
    errorComponent: (props) => {
      return (
        <RootDocument>
          <DefaultCatchBoundary {...props} />
        </RootDocument>
      )
    },
    notFoundComponent: () => <NotFound />,
    shellComponent: RootDocument,
  },
)

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Suspense
          fallback={
            <div className="flex min-h-screen items-center justify-center">
              <Spinner className="h-10 w-10" />
            </div>
          }
        >
          <AuthProvider>{children}</AuthProvider>
        </Suspense>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
            // openHotkey: ['Control', '~'],
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            {
              name: 'React Query',
              render: <ReactQueryDevtoolsPanel />,
            },
            {
              name: 'TanStack Form',
              render: <FormDevtoolsPanel />,
            },
            {
              name: 'RustFS',
              render: <RustFSDevtoolsPanel />,
            },
            {
              name: 'Mailpit',
              render: <MailpitDevtoolsPanel />,
            },
            {
              name: 'React Email',
              render: <ReactEmailDevtoolsPanel />,
            },
            {
              name: 'Drizzle Studio',
              render: <DrizzleStudioDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
