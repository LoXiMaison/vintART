'use client'

import { useState } from 'react'
import { Clock, ShoppingBag } from 'lucide-react'
import Countdown from './Countdown'
import { useCurrency, CurrencyCode } from '@/lib/currency/CurrencyContext'

type StarCardProps = {
  titre: string
  prix: number
  imageRecto: string
  imageVerso: string | null
  expiresAt: string | null
  numero: string
  stock: number
  rectoLabel?: string | null
  versoLabel?: string | null
  versoDescription?: string | null
  devise?: string | null
}


export default function StarCard({
  titre,
  prix,
  imageRecto,
  imageVerso,
  expiresAt,
  numero,
  stock,
  rectoLabel,
  versoLabel,
  versoDescription,
  devise,
}: StarCardProps) {
  const [expired, setExpired] = useState(false)
  const { format } = useCurrency()
  if (expired) {
    return (
      <div className="relative rounded-2xl bg-black/40 p-5 border border-dashed border-white/15 flex flex-col justify-center items-center min-h-[520px] text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <span className="text-amber-500/40 text-2xl">✨</span>
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-widest text-amber-500">
            Carte Vacante
          </span>
          <h3 className="font-cinzel text-xl text-gray-400 font-bold mt-1">
            Nouvelle Édition en Préparation
          </h3>
          <p className="text-xs text-gray-500 max-w-xs mt-2">
            Le carnet précédent a expiré. L&apos;atelier prépare la nouvelle pièce de collection.
          </p>
        </div>
        <span className="px-4 py-2 rounded-full text-[10px] uppercase tracking-wider bg-white/5 text-gray-400 border border-white/10">
          Bientôt Révélé
        </span>
      </div>
    )
  }

  return (
    <div className="star-card relative rounded-2xl bg-gradient-to-b from-gray-900/80 to-black p-5 gold-border gold-glow flex flex-col justify-between min-h-[520px]">
      <div>
        <div className="flex justify-between items-center mb-4">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
            N° {numero} / {stock}
          </span>
          <span className="text-xs font-mono text-gray-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" /> Rareté
          </span>
        </div>

        <div className="card-flip w-full h-72 rounded-xl overflow-hidden cursor-pointer my-2 border border-white/10 group">
          <div className="card-inner relative w-full h-full text-center">
            <div
              className="card-front absolute w-full h-full bg-cover bg-center rounded-xl flex items-end p-4"
              style={{ backgroundImage: `url('${imageRecto}')` }}
            >
              <div className="w-full bg-black/60 backdrop-blur-md p-2 rounded-lg border border-white/10 text-left">
                <p className="text-[10px] text-amber-400 uppercase font-bold">
                  {rectoLabel || 'Recto • Couverture'}
                </p>
                <p className="text-xs text-white font-cinzel font-bold">{titre}</p>
              </div>
            </div>
            <div
              className="card-back absolute w-full h-full bg-cover bg-center rounded-xl flex items-end p-4"
              style={{
                backgroundImage: `url('${imageVerso || imageRecto}')`,
              }}
            >
              <div className="w-full bg-black/60 backdrop-blur-md p-2 rounded-lg border border-white/10 text-left">
                <p className="text-[10px] text-amber-400 uppercase font-bold">
                  {versoLabel || 'Verso • Pages intérieures'}
                </p>
                <p className="text-xs text-white">
                  {versoDescription || 'Cartographie & Prompts'}
                </p>
              </div>
            </div>
          </div>
        </div>
        <p className="text-[10px] text-center text-gray-400 mb-4 italic">
          Survolez pour voir le recto / verso
        </p>
      </div>

      <div className="space-y-4">
        <Countdown expiresAt={expiresAt} onExpire={() => setExpired(true)} />
        <button className="w-full py-3 rounded-xl font-semibold text-xs tracking-wider uppercase bg-gold-btn text-black shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2">
          <ShoppingBag className="w-4 h-4" /> Acquérir — {format(prix, (devise as CurrencyCode) || 'EUR')}
        </button>
      </div>
    </div>
  )
}