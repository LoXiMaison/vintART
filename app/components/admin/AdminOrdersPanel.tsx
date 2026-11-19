'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Package, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react'
import AdminOrderChat from './AdminOrderChat'

type Order = {
  id: string
  numero_suivi: string
  client_nom: string
  client_email: string
  client_phone: string
  carnet_titre: string | null
  statut: string
  montant_total: number
  numero_vol: string | null
  date_atterrissage: string | null
  livraison: string | null
  created_at: string
}

const STATUTS = ['En confection', 'Prêt Aéroport', 'Livré']

const STATUT_COLORS: Record<string, string> = {
  'En confection': 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  'Prêt Aéroport': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  'Livré': 'bg-blue-500/20 text-blue-300 border-blue-500/40',
}

export default function AdminOrdersPanel() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [openChat, setOpenChat] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    setOrders((data || []) as Order[])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function changeStatut(orderId: string, statut: string) {
    const supabase = createClient()
    const { error } = await supabase
      .from('orders')
      .update({ statut })
      .eq('id', orderId)
    if (error) return alert('Erreur : ' + error.message)
    load()
  }

  if (loading) return <p className="text-gray-400 text-sm">Chargement...</p>

  return (
    <div className="space-y-4">
      <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
        <Package className="w-4 h-4" /> Commandes ({orders.length})
      </h2>

      {orders.length === 0 && (
        <p className="text-gray-500 text-sm text-center py-8">
          Aucune commande pour l&apos;instant.
        </p>
      )}

      {orders.map((o) => (
        <div
          key={o.id}
          className="bg-gray-900/80 p-4 rounded-xl border border-white/10 space-y-3"
        >
          <div className="flex justify-between items-start gap-4">
            <div className="flex-grow">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs text-amber-300">{o.numero_suivi}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                    STATUT_COLORS[o.statut] || 'bg-white/5 text-gray-400 border-white/10'
                  }`}
                >
                  {o.statut}
                </span>
              </div>
              <p className="text-sm text-white font-bold mt-1">{o.client_nom}</p>
              <p className="text-[11px] text-gray-400">
                {o.carnet_titre || '—'} • {o.montant_total} EUR
              </p>
              <p className="text-[10px] text-gray-500">
                {o.client_email} • {o.client_phone}
              </p>
              <p className="text-[10px] text-gray-400 mt-1">
                {o.livraison === 'aeroport' ? '✈ Retrait Aéroport' : '🚚 Livraison Domicile'}
              </p>
              {o.numero_vol && (
                <p className="text-[10px] text-gray-400 mt-1">
                  ✈ Vol {o.numero_vol}
                  {o.date_atterrissage &&
                    ` • Arrivée ${new Date(o.date_atterrissage).toLocaleDateString('fr-FR')}`}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5 items-end">
              <select
                value={o.statut}
                onChange={(e) => changeStatut(o.id, e.target.value)}
                className="bg-black border border-white/15 rounded px-2 py-1 text-[10px] text-white focus:outline-none focus:border-amber-400"
              >
                {STATUTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setOpenChat(openChat === o.id ? null : o.id)}
                className="px-2.5 py-1.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-semibold hover:bg-amber-500/30 flex items-center gap-1"
              >
                <MessageSquare className="w-3 h-3" />
                Chat
                {openChat === o.id ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>

          {openChat === o.id && <AdminOrderChat orderId={o.id} />}
        </div>
      ))}
    </div>
  )
}