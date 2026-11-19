'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import CurrencySwitch from './CurrencySwitch'
import { Crown, User, ShieldCheck } from 'lucide-react'

const navItems = [
  { href: '/', label: '1. Accueil' },
  { href: '/catalogue', label: '2. Catalogue' },
  { href: '/vip', label: '3. Service VIP', icon: Crown },
  { href: '/partenariat', label: 'X. Partenariat' },
]

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 bg-[#0b0c10]/90 backdrop-blur-md border-b border-amber-900/30 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* BRAND */}
        <Link href="/" className="flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 rounded-full border border-amber-500/40 flex items-center justify-center bg-amber-950/20 gold-glow">
            <span className="font-cinzel text-xl font-bold text-amber-400">V</span>
          </div>
          <div>
            <h1 className="font-cinzel text-lg tracking-widest text-amber-100 font-bold">
              VINT&apos;ART<span className="text-amber-500">.</span>
            </h1>
            <p className="text-[9px] uppercase tracking-widest text-amber-400/60">
              Éditions Limitées & Collection
            </p>
          </div>
        </Link>

        {/* NAV DESKTOP */}
        <nav className="hidden md:flex items-center space-x-1 bg-black/40 p-1.5 rounded-full border border-white/5">
          {navItems.map((item) => {
            const active = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-5 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  active
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    : 'text-gray-400 hover:text-white border border-transparent'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5 text-amber-400" />}
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center space-x-3">
          <Link
            href="/compte"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-amber-500/40 transition-all text-xs font-medium"
          >
            <User className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Ma Cabine Privée</span>
          </Link>
          <CurrencySwitch />
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-950/30 border border-red-500/40 text-red-400 hover:bg-red-900/40 transition-all text-xs font-semibold"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin</span>
          </Link>
        </div>
      </div>

      {/* NAV MOBILE */}
      <div className="flex md:hidden justify-around mt-4 pt-3 border-t border-white/5 text-[11px]">
        {navItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={active ? 'text-amber-400 font-semibold' : 'text-gray-400'}
            >
              {item.label.split('. ')[1] || item.label}
            </Link>
          )
        })}
      </div>
    </header>
  )
}