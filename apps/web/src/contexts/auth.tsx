import { createContext, useContext, ReactNode, useMemo } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { User } from 'better-auth';

type AuthContextType = {
  user: User | null;
  refetch: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, refetch } = useSuspenseQuery(api.auth.sessionQueryOptions());

  const value = useMemo(() => ({ user: data?.user ?? null, refetch }), [data, refetch]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
