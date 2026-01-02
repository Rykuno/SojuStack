import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useMutation } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { api } from '@/lib/api'

const emailSchema = z.object({
  email: z.email('Please enter a valid email address'),
})

interface LoginFormProps extends React.ComponentProps<'div'> {
  onOtpSent: (email: string) => void
}

export function LoginForm({ className, onOtpSent, ...props }: LoginFormProps) {
  const sendOtpMutation = useMutation({
    mutationFn: async (email: string) => api.auth.sendSignInOtp(email),
    onSuccess: (_data, email) => {
      onOtpSent(email)
    },
  })

  const form = useForm({
    defaultValues: { email: '' },
    validators: {
      onBlur: emailSchema,
    },
    onSubmit: async ({ value }) => sendOtpMutation.mutateAsync(value.email),
  })

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <form.Field name="email">
              {(field) => (
                <Field data-invalid={field.state.meta.errors.length > 0}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    id={field.name}
                    type="email"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    autoComplete="email"
                  />
                  <FieldError />
                </Field>
              )}
            </form.Field>
            <Button
              onClick={() => form.handleSubmit()}
              disabled={sendOtpMutation.isPending || !form.state.canSubmit}
            >
              {sendOtpMutation.isPending ? 'Sending...' : 'Sign in'}
            </Button>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  )
}
