import { queryOptions } from '@tanstack/react-query'
import { authClient } from '../auth-client'

export class AuthApi {
  private queryKeys = ['auth'] as const

  sessionQueryOptions() {
    return queryOptions({
      queryKey: [...this.queryKeys, 'session'],
      queryFn: async () => {
        const res = await authClient.getSession()
        return res.data
      },
    })
  }

  signOut() {
    return authClient.signOut()
  }

  sendSignInOtp(email: string) {
    return authClient.emailOtp.sendVerificationOtp({ email, type: 'sign-in' })
  }

  signInWithOtp(email: string, otp: string) {
    return authClient.signIn.emailOtp({
      email,
      otp,
    })
  }
}
