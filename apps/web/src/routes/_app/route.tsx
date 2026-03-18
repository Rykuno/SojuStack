import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { AppNavbar } from '#/components/app-navbar';
import { api } from '#/integrations/api';

export const Route = createFileRoute('/_app')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.fetchQuery(api.auth.user());
    if (!user) throw redirect({ to: '/login' });
  },
});

function RouteComponent() {
  return (
    <div className='min-h-screen flex flex-col'>
      <AppNavbar />
      <main className='flex-1'>
        <Outlet />
      </main>
    </div>
  );
}
