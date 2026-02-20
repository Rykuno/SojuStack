import { useState } from 'react';
import { LoginForm } from './login-form';
import { Container } from './container';
import { OTPForm } from './otp-form';

export function Login() {
  const [email, setEmail] = useState('');

  return (
    <Container>{email ? <OTPForm email={email} /> : <LoginForm onOtpSent={setEmail} />}</Container>
  );
}
