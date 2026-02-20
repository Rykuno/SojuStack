import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { useNavigate, useRouter } from '@tanstack/react-router';

const otpSchema = z.string().length(6, 'Please enter the 6-digit code');

interface OTPFormProps extends React.ComponentProps<typeof Card> {
  email: string;
}

export function OTPForm({ email, ...props }: OTPFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const router = useRouter();

  const verifyOtpMutation = useMutation({
    mutationFn: async (otp: string) => api.auth.signInWithOtp(email, otp),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [...api.auth.queryKeys, 'session'],
      });
      await router.invalidate();
      await navigate({ to: '/' });
    },
  });

  const form = useForm({
    defaultValues: { otp: '' },
    onSubmit: async ({ value }) => verifyOtpMutation.mutateAsync(value.otp),
  });

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Enter verification code</CardTitle>
        <CardDescription>We sent a 6-digit code to {email}.</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <form.Field
            name='otp'
            validators={{
              onBlur: ({ value }) => {
                const result = otpSchema.safeParse(value);
                return result.success ? undefined : result.error.issues[0]?.message;
              },
            }}
          >
            {(field) => (
              <Field data-invalid={field.state.meta.errors.length > 0}>
                <FieldLabel htmlFor={field.name}>Verification code</FieldLabel>
                <InputOTP
                  maxLength={6}
                  id={field.name}
                  value={field.state.value}
                  onChange={(value) => field.handleChange(value)}
                  onBlur={field.handleBlur}
                >
                  <InputOTPGroup className='gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border'>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <FieldError
                  errors={field.state.meta.errors.map((e) => ({
                    message: typeof e === 'string' ? e : undefined,
                  }))}
                />
                <FieldDescription>Enter the 6-digit code sent to your email.</FieldDescription>
              </Field>
            )}
          </form.Field>
          <FieldGroup>
            <Button
              onClick={() => form.handleSubmit()}
              disabled={verifyOtpMutation.isPending || !form.state.canSubmit}
            >
              {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify'}
            </Button>
            <FieldDescription className='text-center'>
              Didn&apos;t receive the code? Resend
            </FieldDescription>
          </FieldGroup>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
