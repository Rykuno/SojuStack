import { useAuth } from '@/contexts/auth';
import { api } from '@/lib/api';
import { isAuthenticated } from '@/middleware/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(api.auth.sessionQueryOptions());
  },
  component: HomePage,
  server: {
    middleware: [isAuthenticated],
  },
});

function HomePage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const sessionQueryKey = [...api.auth.queryKeys, 'session'];
  const logoutMutation = useMutation({
    mutationFn: () => api.auth.signOut(),
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: sessionQueryKey });
      await router.invalidate();
      await router.navigate({ to: '/login' });
    },
  });

  const { user } = useAuth();
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1>Hello World</h1>
      <p>{user?.email}</p>
      <br />
      <button onClick={() => logoutMutation.mutate()}>logout</button>
    </div>
  );
}
