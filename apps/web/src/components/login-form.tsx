import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { z } from 'zod/v4';
import { useForm } from '@tanstack/react-form';
import { api } from '#/integrations/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

const emailSchema = z.object({
  email: z.email(),
});

const otpSchema = z.object({
  otp: z.string().length(6),
});

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const [email, setEmail] = useState<string | null>(null);

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      {email ? <OtpForm email={email} /> : <EmailForm setEmail={setEmail} />}
    </div>
  );
}

function EmailForm({ setEmail }: { setEmail: (email: string) => void }) {
  const sendSignInOtpMutation = useMutation(api.auth.sendSignInOtp());

  const form = useForm({
    defaultValues: {
      email: '',
    },
    validators: {
      onBlur: emailSchema,
      onSubmit: emailSchema,
    },
    onSubmit: ({ value }) => {
      sendSignInOtpMutation.mutate(value.email);
      setEmail(value.email);
      form.reset();
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enter your email</CardTitle>
        <CardDescription>Enter your email below to login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log('submit');
            void form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field
              name='email'
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder='Email'
                      required
                      autoComplete='off'
                    />
                  </Field>
                );
              }}
            />
            <Button type='submit'>Login</Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}

export function OtpForm({ email }: { email: string }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const verifySignInOtpMutation = useMutation({
    ...api.auth.verifySignInOtp(),
    onSuccess: () => {
      queryClient.clear();
      void navigate({ to: '/' });
    },
  });

  const form = useForm({
    defaultValues: {
      otp: '',
    },
    validators: {
      onBlur: otpSchema,
      onSubmit: otpSchema,
    },
    onSubmit: ({ value }) => {
      verifySignInOtpMutation.mutate({ email, otp: value.otp });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>Enter your email below to login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field
              name='otp'
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>OTP</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder='OTP'
                      required
                      autoComplete='off'
                    />
                  </Field>
                );
              }}
            />
            <Button type='submit'>Verify</Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
