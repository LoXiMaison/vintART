'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ShieldCheck } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0c10] px-6">
      <div className="w-full max-w-md bg-gradient-to-b from-gray-900 to-black p-8 rounded-2xl border border-amber-500/30 gold-glow">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-950/30 border border-red-500/40 flex items-center justify-center mb-4">
            <ShieldCheck className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="font-cinzel text-2xl font-bold text-white">Accès Admin</h1>
          <p className="text-xs text-gray-400 mt-2">Espace réservé à l&apos;équipe Vint&apos;ART</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-400 focus:outline-none"
              placeholder="admin@vintart.tn"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-400 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-950/30 border border-red-500/30 rounded-lg p-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-xs tracking-wider uppercase bg-gold-btn text-black shadow-lg hover:brightness-110 transition-all disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}