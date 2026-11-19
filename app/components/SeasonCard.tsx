'use client'

import Link from 'next/link'
import { useCurrency, CurrencyCode } from '@/lib/currency/CurrencyContext'

type SeasonCardProps = {
  titre: string
  saison: string
  prix: number
  devise?: string | null
  imageRecto: string
  ville?: string | null
}

export default function SeasonCard({ titre, saison, prix, devise, imageRecto, ville }: SeasonCardProps) {
  const { format } = useCurrency()

  return (
    <Link
      href="/catalogue"
      className="bg-white/5 rounded-xl p-3 border border-white/10 hover:border-amber-500/40 transition-all group cursor-pointer block"
    >
      <div
        className="h-40 rounded-lg bg-cover bg-center mb-3 group-hover:scale-[1.02] transition-transform"
        style={{ backgroundImage: `url('${imageRecto}')` }}
      />
      <span className="text-[9px] uppercase tracking-widest text-amber-400 font-bold">
        {saison}
      </span>
      <h4 className="text-xs font-bold text-white">{titre}</h4>
      <p className="text-[11px] text-gray-400 mt-1">
        {format(prix, (devise as CurrencyCode) || 'EUR')}
        {ville ? ` • ${ville}` : ''}
      </p>
    </Link>
  )
}