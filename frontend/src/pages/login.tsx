import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { authSchema, type AuthSchema  } from '../schemas/auth.schema'
import { useAuth } from '../context/auth.context'
import * as authService from '../services/auth.service'
import { getErrorMessage } from '../services/http-error'

export function LoginPage() {
  const navigate = useNavigate()
  const auth = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<AuthSchema>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: '', password: '' }
  })

  async function onSubmit(data: AuthSchema) {
    try {
      setServerError(null)

      const result = await authService.login(data) // Promise<LoginResponse>
      auth.login(result) // salva token/user no localStorage + contexto

      navigate('/', { replace: true }) // vai pra rota protegida
    } catch (err) {
      setServerError(getErrorMessage(err))
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[1.2fr_1fr]">
      {/* LEFT (branding + imagem + gradiente) */}
      <aside className="hidden lg:block relative overflow-hidden p-10 text-white bg-gradient-to-br from-orange-500 via-orange-400 to-pink-500">
        {/* topo esquerda: logo + nome */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/20 grid place-items-center text-lg">
            🐾
          </div>
          <div>
            <div className="font-bold leading-tight">PetLove</div>
            <div className="text-xs opacity-90">Adote um amigo</div>
          </div>
        </div>

        {/* centro: foto do pet em card */}
        <div className="h-[70%] grid place-items-center">
          <div className="w-[320px] h-[400px] rounded-2xl overflow-hidden shadow-2xl bg-black/10">
            <img
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=80"
              alt="Cachorro"
            />
          </div>
        </div>

        {/* texto inferior */}
        <div className="absolute left-10 bottom-8">
          <h2 className="text-xl font-bold">Encontre seu melhor amigo</h2>
          <p className="opacity-90 text-sm">
            Milhares de pets esperando por um lar cheio de amor
          </p>
        </div>
      </aside>

      {/* RIGHT (formulário) */}
      <main className="bg-white grid place-items-center p-8">
        <div className="w-full max-w-md rounded-2xl border border-zinc-200 shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-7">
          <div className="w-10 h-10 rounded-xl bg-orange-500 text-white grid place-items-center font-extrabold mx-auto">
            ♥
          </div>

          <h1 className="mt-4 text-center text-2xl font-bold text-zinc-900">
            Bem-vindo de volta!
          </h1>
          <p className="mt-2 text-center text-sm text-zinc-500">
            Entre para continuar sua jornada de amor
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-4">
            {/* erro do servidor (ex: 401) */}
            {serverError && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">
                {serverError}
              </div>
            )}

            <label className="grid gap-1 text-xs text-zinc-700">
              Email
              <input
                className="h-11 rounded-xl border border-zinc-200 px-3 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20"
                type="email"
                placeholder="seu@email.com"
                {...register('email')}
              />
              {errors.email && (
                <span className="text-[11px] text-red-600">
                  {errors.email.message}
                </span>
              )}
            </label>

            <label className="grid gap-1 text-xs text-zinc-700">
              Senha
              <input
                className="h-11 rounded-xl border border-zinc-200 px-3 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20"
                type="password"
                placeholder="••••••••"
                {...register('password')}
              />
              {errors.password && (
                <span className="text-[11px] text-red-600">
                  {errors.password.message}
                </span>
              )}
            </label>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-zinc-700">
                <input type="checkbox" className="accent-orange-500" />
                Lembrar-me
              </label>

              <button type="button" className="text-orange-500 hover:underline">
                Esqueci minha senha
              </button>
            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className="h-11 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 to-orange-400 shadow-lg shadow-orange-500/25 hover:brightness-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>

            <div className="relative grid place-items-center text-xs text-zinc-400 my-1">
              <div className="absolute inset-x-0 top-1/2 h-px bg-zinc-200" />
              <span className="relative bg-white px-3">ou</span>
            </div>

            <p className="text-center text-xs text-zinc-500">
              Ainda não tem uma conta?{' '}
              <button type="button" className="text-orange-500 hover:underline">
                Cadastre-se gratuitamente
              </button>
            </p>
          </form>
        </div>
      </main>
    </div>
  )
}