'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Send, MessageSquare } from 'lucide-react'

type Message = {
  id: string
  order_id: string
  sender_type: 'client' | 'admin'
  message: string
  created_at: string
}

export default function AdminOrderChat({ orderId }: { orderId: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const supabase = createClient()

    async function load() {
      const { data } = await supabase
        .from('order_messages')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true })
      setMessages((data || []) as Message[])
    }

    load()

    const channel = supabase
      .channel(`admin-chat-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'order_messages',
          filter: `order_id=eq.${orderId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [orderId])

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages])

  async function send(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    setSending(true)
    const supabase = createClient()
    const { error } = await supabase.from('order_messages').insert({
      order_id: orderId,
      sender_type: 'admin',
      message: newMessage.trim(),
    })

    if (error) {
  alert('Erreur : ' + error.message)
} else {
  setNewMessage('')
}
setSending(false)
  }

  return (
    <div className="bg-black/60 rounded-xl p-3 border border-amber-500/20 space-y-2">
      <p className="text-[10px] uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
        <MessageSquare className="w-3 h-3" /> Conversation
      </p>

      <div
        ref={chatRef}
        className="h-48 overflow-y-auto space-y-2 pr-1"
      >
        {messages.length === 0 && (
          <p className="text-center text-gray-500 text-[10px] italic py-6">
            Aucun message avec ce client pour l&apos;instant.
          </p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-2 rounded-lg max-w-[85%] text-[11px] ${
              m.sender_type === 'admin'
                ? 'bg-amber-500/20 border border-amber-500/30 text-amber-100 ml-auto text-right'
                : 'bg-white/5 border border-white/10 text-gray-300'
            }`}
          >
            <span className="text-[8px] font-bold text-amber-400 block mb-0.5">
              {m.sender_type === 'admin' ? 'Vous (Admin)' : 'Client'}
            </span>
            {m.message}
          </div>
        ))}
      </div>

      <form onSubmit={send} className="flex gap-1.5">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Répondre au client..."
          className="flex-grow bg-black/60 border border-white/15 rounded-lg px-2 py-1.5 text-[11px] text-white focus:outline-none focus:border-amber-400"
        />
        <button
          type="submit"
          disabled={sending || !newMessage.trim()}
          className="px-3 py-1.5 bg-amber-500 text-black text-[10px] font-bold rounded-lg hover:bg-amber-400 disabled:opacity-50 flex items-center gap-1"
        >
          <Send className="w-3 h-3" /> Envoyer
        </button>
      </form>
    </div>
  )
}