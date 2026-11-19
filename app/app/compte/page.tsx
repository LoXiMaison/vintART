'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { KeyRound, LogIn } from 'lucide-react'
import CompteDashboard from './CompteDashboard'

export default function ComptePage() {
  const [numeroSuivi, setNumeroSuivi] = useState('')
  const [phone, setPhone] = useState('')
  const [order, setOrder] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('numero_suivi', numeroSuivi.trim().toUpperCase())
      .eq('client_phone', phone.trim())
      .single()

    if (error || !data) {
      setError('Numéro de suivi ou téléphone invalide.')
      setLoading(false)
      return
    }

    setOrder(data)
    setLoading(false)
  }

  if (order) {
    return <CompteDashboard order={order} onLogout={() => setOrder(null)} />
  }

  return (
    <div className="max-w-md mx-auto p-6 py-24">
      <div className="bg-gradient-to-b from-gray-900 to-black p-8 rounded-2xl border border-amber-500/30 gold-glow space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <KeyRound className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="font-cinzel text-2xl font-bold text-white">
            Ma Cabine Privée
          </h1>
          <p className="text-xs text-gray-400">
            Entrez votre numéro de suivi et votre téléphone pour accéder à votre espace.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[10px] text-gray-400 uppercase tracking-wider mb-1.5">
              Numéro de suivi
            </label>
            <input
              type="text"
              value={numeroSuivi}
              onChange={(e) => setNumeroSuivi(e.target.value)}
              required
              placeholder="#CMD-12345 ou #VIP-67890"
              className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="block text-[10px] text-gray-400 uppercase tracking-wider mb-1.5">
              Téléphone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="+216 20 123 456"
              className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
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
            className="w-full py-3 rounded-xl font-semibold text-xs tracking-wider uppercase bg-gold-btn text-black shadow-lg hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Vérification...' : 'Accéder à ma Cabine'}
          </button>
        </form>

        <p className="text-[10px] text-gray-500 text-center italic">
          Le numéro de suivi vous a été communiqué lors de votre commande.
        </p>
      </div>
    </div>
  )
}