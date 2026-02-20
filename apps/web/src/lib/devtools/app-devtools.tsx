import { lazy } from 'react';
import { TanStackDevtools } from '@tanstack/react-devtools';

const TanStackRouterDevtoolsPanel = lazy(() =>
  import('@tanstack/react-router-devtools').then((m) => ({
    default: m.TanStackRouterDevtoolsPanel,
  })),
);
const ReactQueryDevtoolsPanel = lazy(() =>
  import('@tanstack/react-query-devtools').then((m) => ({
    default: m.ReactQueryDevtoolsPanel,
  })),
);
const FormDevtoolsPanel = lazy(() =>
  import('@tanstack/react-form-devtools').then((m) => ({
    default: m.FormDevtoolsPanel,
  })),
);
const MailpitDevtoolsPanel = lazy(() =>
  import('@/lib/devtools/mailpit-devtools-panel').then((m) => ({
    default: m.MailpitDevtoolsPanel,
  })),
);
const RustFSDevtoolsPanel = lazy(() =>
  import('@/lib/devtools/rustfs-devtools-panel').then((m) => ({
    default: m.RustFSDevtoolsPanel,
  })),
);
const ReactEmailDevtoolsPanel = lazy(() =>
  import('@/lib/devtools/react-email-devtools-panel').then((m) => ({
    default: m.ReactEmailDevtoolsPanel,
  })),
);
const DrizzleStudioDevtoolsPanel = lazy(() =>
  import('@/lib/devtools/drizzle-studio-devtools.panel').then((m) => ({
    default: m.DrizzleStudioDevtoolsPanel,
  })),
);
const OpenAPIDevtoolsPanel = lazy(() =>
  import('@/lib/devtools/openapi-devtools').then((m) => ({
    default: m.OpenAPIDevtoolsPanel,
  })),
);

export function AppDevtools() {
  return (
    <TanStackDevtools
      config={{
        position: 'bottom-right',
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
        {
          name: 'OpenAPI',
          render: <OpenAPIDevtoolsPanel />,
        },
      ]}
    />
  );
}
