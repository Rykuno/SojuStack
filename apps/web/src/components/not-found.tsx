import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty';
import { Link } from '@tanstack/react-router';
import { Button } from './ui/button';

export function NotFoundDocument() {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <Empty>
        <EmptyHeader>
          <EmptyTitle>404 - Not Found</EmptyTitle>
          <EmptyDescription>
            The page you&apos;re looking for doesn&apos;t exist. Try searching for what you need
            below.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link to='/'>
            <Button variant='outline'>Go to home</Button>
          </Link>
          <EmptyDescription>
            Need help? <a href='#'>Contact support</a>
          </EmptyDescription>
        </EmptyContent>
      </Empty>
    </div>
  );
}
