import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/auth/sign-in')({
  component: SignInPage,
});

function SignInPage() {
  return (
    <div className='flex min-h-[50vh] flex-col items-center justify-center gap-4'>
      <h1 className='text-2xl font-semibold'>Sign in</h1>
      <p className='text-muted-foreground text-sm'>
        Sign-in flow coming soon. Configure your auth routes to enable this.
      </p>
    </div>
  );
}
