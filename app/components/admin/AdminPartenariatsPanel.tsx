'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Handshake, Mail } from 'lucide-react'

type Partnership = {
  id: string
  etablissement: string
  type_partenariat: string
  email: string
  message: string | null
  statut: string
  created_at: string
}

export default function AdminPartenariatsPanel() {
  const [items, setItems] = useState<Partnership[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('partnerships')
        .select('*')
        .order('created_at', { ascending: false })
      setItems((data || []) as Partnership[])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <p className="text-gray-400 text-sm">Chargement...</p>

  return (
    <div className="space-y-4">
      <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
        <Handshake className="w-4 h-4" /> Demandes de Partenariat ({items.length})
      </h2>

      {items.length === 0 && (
        <p className="text-gray-500 text-sm text-center py-8">
          Aucune demande pour l&apos;instant.
        </p>
      )}

      {items.map((p) => (
        <div
          key={p.id}
          className="bg-gray-900/80 p-4 rounded-xl border border-white/10 space-y-2"
        >
          <div className="flex justify-between items-start gap-4">
            <div>
              <p className="font-bold text-white text-sm">{p.etablissement}</p>
              <p className="text-[10px] uppercase tracking-wider text-amber-400">
                {p.type_partenariat}
              </p>
              <a
                href={`mailto:${p.email}`}
                className="text-[11px] text-gray-400 hover:text-amber-300 flex items-center gap-1 mt-1"
              >
                <Mail className="w-3 h-3" /> {p.email}
              </a>
            </div>
            <span className="text-[9px] uppercase tracking-wider text-gray-500">
              {new Date(p.created_at).toLocaleDateString('fr-FR')}
            </span>
          </div>
          {p.message && (
            <p className="text-[11px] text-gray-300 bg-black/40 p-2 rounded border border-white/5">
              {p.message}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}