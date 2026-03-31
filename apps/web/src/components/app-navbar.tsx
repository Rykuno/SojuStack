import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { Button, buttonVariants } from '@/components/ui/button';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getUserAvatar } from '#/lib/helpers';
import { api } from '#/integrations/api';
import { Container } from './container';

export function AppNavbar() {
  const { data: user } = useQuery(api.auth.user());

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const signOutMutation = useMutation({
    ...api.auth.signOut(),
    onSuccess: () => {
      queryClient.clear();
      void navigate({ to: '/login' });
    },
  });

  const avatarSrc = useMemo(() => {
    if (!user) return undefined;
    return getUserAvatar(user);
  }, [user]);

  return (
    <header className='border-b'>
      <Container className='flex h-16 items-center justify-between'>
        <Link to='/' className='text-sm font-semibold tracking-wide'>
          <Button size='lg'>KimchiStack</Button>
        </Link>

        <div className='flex items-center gap-2'>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={avatarSrc} alt={user.name ?? user.email ?? 'User'} />
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => signOutMutation.mutate()}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to='/login' className={buttonVariants({ size: 'sm' })}>
              Login
            </Link>
          )}
        </div>
      </Container>
    </header>
  );
}
