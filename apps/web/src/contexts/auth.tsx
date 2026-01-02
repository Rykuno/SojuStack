// contexts/auth.tsx
import { createContext, useContext, ReactNode } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { User } from 'better-auth'

type AuthContextType = {
  user: User | null
  refetch: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, refetch } = useSuspenseQuery(api.auth.sessionQueryOptions())

  return (
    <AuthContext.Provider value={{ user: data?.user ?? null, refetch }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
