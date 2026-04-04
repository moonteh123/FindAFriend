import React, { createContext, useContext, useMemo, useState } from 'react'

type User = { id: number; name: string; role: 'user' | 'admin' }
// Definindo o tipo do contexto de autenticação
type AuthContextValue = {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  login: (data: { token: string; user: User }) => void
  logout: () => void
}
// Criando o contexto de autenticação
const AuthContext = createContext<AuthContextValue | null>(null)
// Criando o provedor de autenticação
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token')) // Inicializa o token a partir do localStorage, se existir
  const [user, setUser] = useState<User | null>(() => { // Inicializa o usuário a partir do localStorage, se existir
    const raw = localStorage.getItem('user')
    return raw ? (JSON.parse(raw) as User) : null
  })

  const login: AuthContextValue['login'] = ({ token, user }) => { // Função de login que salva o token e o usuário no localStorage e no estado
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    setToken(token)
    setUser(user)
  }

  const logout = () => { // Função de logout que remove o token e o usuário do localStorage e do estado
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  const value = useMemo(
    () => ({ token, user, isAuthenticated: !!token, login, logout }), // Memoiza o valor do contexto para evitar re-renderizações desnecessárias
    [token, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}