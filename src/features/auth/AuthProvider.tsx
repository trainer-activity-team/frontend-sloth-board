import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { clearSession, getStoredUser, setSession } from '../../lib/authStorage'
import { AuthContext } from './authContext'
import type { AuthUser } from './types'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser())

  const login = useCallback((nextUser: AuthUser) => {
    setSession(nextUser)
    setUser(nextUser)
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      login,
      logout,
    }),
    [user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
