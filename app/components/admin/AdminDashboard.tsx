'use client'

import { useState } from 'react'
import { BookOpen, Package, Handshake } from 'lucide-react'
import AdminCarnetsPanel from './AdminCarnetsPanel'
import AdminOrdersPanel from './AdminOrdersPanel'
import AdminPartenariatsPanel from './AdminPartenariatsPanel'

type Tab = 'carnets' | 'commandes' | 'partenariats'

const TABS = [
  { key: 'carnets' as Tab, label: 'Carnets', icon: BookOpen },
  { key: 'commandes' as Tab, label: 'Commandes', icon: Package },
  { key: 'partenariats' as Tab, label: 'Partenariats', icon: Handshake },
]

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('carnets')

  return (
    <div className="space-y-6">
      {/* TABS */}
      <div className="flex gap-1 bg-black/40 p-1 rounded-full border border-white/10 w-fit">
        {TABS.map((t) => {
          const Icon = t.icon
          const active = tab === t.key
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                active
                  ? 'bg-amber-500 text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          )
        })}
      </div>

      {tab === 'carnets' && <AdminCarnetsPanel />}
      {tab === 'commandes' && <AdminOrdersPanel />}
      {tab === 'partenariats' && <AdminPartenariatsPanel />}
    </div>
  )
}