'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Building2, CheckCircle2 } from 'lucide-react'

const TYPES = [
  'Dépôt-Vente Boutique',
  'Édition Spéciale Marque',
  'Cadeau VIP Établissement',
]

export default function PartenariatPage() {
  const [etablissement, setEtablissement] = useState('')
  const [type, setType] = useState(TYPES[0])
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.from('partnerships').insert({
      etablissement,
      type_partenariat: type,
      email,
      message,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="max-w-3xl mx-auto p-6 sm:p-8 py-16">
        <div className="bg-gradient-to-b from-gray-900 to-black p-8 rounded-2xl border border-amber-500/40 gold-glow text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="font-cinzel text-2xl font-bold text-white">
            Demande envoyée
          </h2>
          <p className="text-sm text-gray-400">
            Merci pour votre intérêt. Notre équipe B2B vous recontactera sous 48h à l&apos;adresse <strong className="text-amber-300">{email}</strong>.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-8 py-16 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
          Espace Marques & Hôtels
        </span>
        <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-white flex items-center justify-center gap-3">
          <Building2 className="w-7 h-7 text-amber-400" /> Devenir Partenaire Officiel
        </h1>
        <p className="text-xs text-gray-400 max-w-xl mx-auto">
          Hôtels de charme, maisons d&apos;hôtes, conciergerie ou concept-stores : personnalisez des séries exclusives pour vos clients.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-gradient-to-b from-gray-900 to-black p-6 sm:p-8 rounded-2xl border border-white/10 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Nom de l&apos;Établissement / Marque *</label>
            <input
              type="text"
              value={etablissement}
              onChange={(e) => setEtablissement(e.target.value)}
              required
              placeholder="ex: Dar El Jeld"
              className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Type de Partenariat</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Email Professionnel *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="contact@etablissement.tn"
            className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Message / Volume Souhaité</label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Décrivez votre besoin : volumes, personnalisation, délais..."
            className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 resize-none"
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
          {loading ? 'Envoi en cours...' : 'Envoyer la Demande Partenaire'}
        </button>
      </form>
    </div>
  )
}