'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useCurrency } from '@/lib/currency/CurrencyContext'
import type { CurrencyCode } from '@/lib/currency/CurrencyContext'

type Carnet = {
  id: string
  titre: string
  description: string | null
  prix: number
  devise: string | null  
  image_recto: string
  saison: string | null
  ville: string | null
  reliure: string | null
  is_star: boolean
}

const SAISONS = ['Toutes', 'Printemps', 'Été', 'Automne', 'Hiver']
const VILLES = ['Toutes', 'Tunis', 'Sidi Bou Saïd', 'Carthage', 'Grand Sud']


export default function CataloguePage() {
  const { format } = useCurrency()
  const [carnets, setCarnets] = useState<Carnet[]>([])
  const [loading, setLoading] = useState(true)
  const [saison, setSaison] = useState('Toutes')
  const [ville, setVille] = useState('Toutes')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('carnets')
        .select('*')
        .eq('is_star', false)
        .order('created_at', { ascending: true })
      setCarnets((data || []) as Carnet[])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = carnets.filter((c) => {
    const matchSaison = saison === 'Toutes' || c.saison === saison
    const matchVille = ville === 'Toutes' || c.ville === ville
    return matchSaison && matchVille
  })

  return (
    <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="font-cinzel text-3xl font-bold text-white">
            Showroom & Catalogue Global
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Explorez toutes nos pièces selon la saison ou la ville.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">Saison</p>
          <div className="flex flex-wrap gap-2">
            {SAISONS.map((s) => (
              <button
                key={s}
                onClick={() => setSaison(s)}
                className={`px-4 py-1.5 rounded-full text-xs transition-all ${
                  saison === s
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">Ville</p>
          <div className="flex flex-wrap gap-2">
            {VILLES.map((v) => (
              <button
                key={v}
                onClick={() => setVille(v)}
                className={`px-4 py-1.5 rounded-full text-xs transition-all ${
                  ville === v
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs text-amber-300">
        {loading ? 'Chargement...' : `${filtered.length} pièce(s) trouvée(s)`}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl bg-gradient-to-b from-gray-900 to-black p-4 border border-white/10 hover:border-amber-500/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div
                className="h-60 rounded-xl bg-cover bg-center mb-4"
                style={{ backgroundImage: `url('${c.image_recto}')` }}
              />
              <span className="text-[9px] uppercase tracking-widest text-amber-400 font-bold">
                {c.saison} • {c.ville}
              </span>
              <h3 className="font-cinzel text-lg font-bold text-white">{c.titre}</h3>
              <p className="text-xs text-gray-400 mt-2 line-clamp-2">{c.description}</p>
            </div>
            <div className="mt-6 flex justify-between items-center pt-4 border-t border-white/5">
              <span className="text-sm font-bold text-white">
  {format(c.prix, (c.devise as CurrencyCode) || 'EUR')}
</span>
              <Link
                href={`/commande/${c.id}`}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-amber-500 hover:text-black text-xs font-semibold transition-all"
              >
                Commander
              </Link>
            </div>
          </div>
        ))}
      </div>

      {!loading && filtered.length === 0 && (
        <p className="text-center text-gray-500 text-sm py-12">
          Aucune pièce ne correspond à ces filtres.
        </p>
      )}
    </div>
  )
}