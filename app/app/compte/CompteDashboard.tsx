'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useCurrency, CurrencyCode } from '@/lib/currency/CurrencyContext'
import {
  Package,
  MessageSquare,
  LogOut,
  Send,
  CheckCircle2,
  Scissors,
  Plane,
  Truck,
} from 'lucide-react'

type Order = {
  id: string
  numero_suivi: string
  client_nom: string
  carnet_titre: string | null
  statut: string
  montant_total: number
  initiales_gravure: string | null
  numero_vol: string | null
  date_atterrissage: string | null
  created_at: string
  livraison: string | null  
}

type Message = {
  id: string
  order_id: string
  sender_type: 'client' | 'admin'
  message: string
  created_at: string
}


export default function CompteDashboard({
  order,
  onLogout,
}: {
  order: Order
  onLogout: () => void
}) {
  const { format } = useCurrency()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)

  // Déterminer l'étape actuelle (0, 1, ou 2)
  const currentStep =
    order.statut === 'Prêt Aéroport' ? 2 : order.statut === 'En confection' ? 1 : 0

  const isAeroport = order.livraison === 'aeroport'
  const STEPS = [
    { label: 'Reçue', icon: Package },
    { label: 'Reliure / Embossage', icon: Scissors },
    {
      label: isAeroport ? 'Retrait Aéroport' : 'Livraison Domicile',
      icon: isAeroport ? Plane : Truck,
    },
  ]

  // Charge les messages
  useEffect(() => {
    const supabase = createClient()

    async function loadMessages() {
      const { data } = await supabase
        .from('order_messages')
        .select('*')
        .eq('order_id', order.id)
        .order('created_at', { ascending: true })
      setMessages((data || []) as Message[])
    }

    loadMessages()

    // Realtime : écoute les nouveaux messages
    const channel = supabase
      .channel(`chat-${order.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'order_messages',
          filter: `order_id=eq.${order.id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [order.id])

  // Scroll automatique vers le bas
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    setSending(true)
    const supabase = createClient()
    const { error } = await supabase.from('order_messages').insert({
      order_id: order.id,
      sender_type: 'client',
      message: newMessage.trim(),
    })

    if (!error) setNewMessage('')
    setSending(false)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8 py-12 space-y-6">
      {/* HEADER COMPTE */}
      <div className="bg-gradient-to-b from-gray-900 to-black p-6 rounded-2xl border border-white/10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-cinzel text-xl font-bold">
              VIP
            </div>
            <div>
              <h1 className="font-cinzel text-xl font-bold text-white">
                Bonjour, {order.client_nom}
              </h1>
              <p className="text-xs text-gray-400 font-mono">{order.numero_suivi}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-[11px] hover:bg-white/10 flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" /> Déconnexion
          </button>
        </div>

        {/* COMMANDE */}
        <div className="mt-6 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <Package className="w-4 h-4" /> Votre commande
          </h2>
          <div className="bg-black/60 p-4 rounded-xl border border-white/5 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Carnet</span>
              <span className="text-white font-bold">{order.carnet_titre || '—'}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Montant</span>
              <span className="text-amber-300 font-bold">
                {format(order.montant_total, 'EUR')}
              </span>
            </div>
            {order.numero_vol && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Vol</span>
                <span className="text-white font-mono">{order.numero_vol}</span>
              </div>
            )}
            {order.date_atterrissage && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Arrivée</span>
                <span className="text-white">
                  {new Date(order.date_atterrissage).toLocaleDateString('fr-FR')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* TRACKER */}
        <div className="mt-6 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Suivi de confection
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              const done = i <= currentStep
              const current = i === currentStep
              return (
                <div
                  key={step.label}
                  className={`p-3 rounded-xl border text-center space-y-1.5 transition-all ${
                    done
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                      : 'bg-white/5 border-white/10 text-gray-500'
                  } ${current ? 'animate-pulse' : ''}`}
                >
                  {done ? (
                    <CheckCircle2 className="w-4 h-4 mx-auto" />
                  ) : (
                    <Icon className="w-4 h-4 mx-auto" />
                  )}
                  <p className="text-[10px] font-bold">{step.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* CHAT */}
      <div className="bg-gradient-to-b from-gray-900 to-black p-6 rounded-2xl border border-white/10 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
          <MessageSquare className="w-4 h-4" /> Atelier & Service Client
        </h2>

        <div
          ref={chatRef}
          className="h-72 bg-black/60 rounded-xl p-3 border border-white/10 overflow-y-auto space-y-2"
        >
          {messages.length === 0 && (
            <p className="text-center text-gray-500 text-xs italic py-8">
              Aucun message pour l&apos;instant. Écrivez-nous pour toute question.
            </p>
          )}
          {messages.map((m) => (
            <div
              key={m.id}
              className={`p-2.5 rounded-lg max-w-[80%] text-xs ${
                m.sender_type === 'client'
                  ? 'bg-amber-500/20 border border-amber-500/30 text-amber-100 ml-auto text-right'
                  : 'bg-white/5 border border-white/10 text-gray-300'
              }`}
            >
              <span
                className={`text-[9px] font-bold block mb-0.5 ${
                  m.sender_type === 'client' ? 'text-amber-400' : 'text-amber-400'
                }`}
              >
                {m.sender_type === 'client' ? 'Vous' : 'Atelier Vint\'ART'}
              </span>
              {m.message}
            </div>
          ))}
        </div>

        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écrire un message à l'atelier..."
            className="flex-grow bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="px-4 py-2 bg-amber-500 text-black text-xs font-bold rounded-xl hover:bg-amber-400 disabled:opacity-50 flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" /> Envoyer
          </button>
        </form>
      </div>
    </div>
  )
}