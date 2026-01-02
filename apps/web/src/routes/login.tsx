import { Container } from '@/components/container'
import { Login } from '@/components/login'
import { isNotAuthenticated } from '@/middleware/auth'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
  server: {
    middleware: [isNotAuthenticated],
  },
})

function RouteComponent() {
  return (
    <Container className="max-w-md mt-[10vh]">
      <Login />
    </Container>
  )
}
