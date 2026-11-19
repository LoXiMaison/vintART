'use client'

import { useState, useEffect } from 'react'
import { Clock, Star, ShoppingBag } from 'lucide-react'
import { useCurrency, CurrencyCode } from '@/lib/currency/CurrencyContext'

type LivePreviewProps = {
  titre: string
  prix: number
  devise?: CurrencyCode
  imageRecto: string | null
  imageVerso: string | null
  isStar: boolean
  expiresAt: string | null
  numeroEdition?: string | null
  stock?: number
  rectoLabel?: string | null
  versoLabel?: string | null
  versoDescription?: string | null
}

function calculateRemaining(expiresAt: string | null) {
  if (!expiresAt) return { d: 0, h: 0, m: 0, s: 0, expired: true }
  const diff = new Date(expiresAt).getTime() - Date.now()
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0, expired: true }
  return {
    d: Math.floor(diff / (1000 * 60 * 60 * 24)),
    h: Math.floor((diff / (1000 * 60 * 60)) % 24),
    m: Math.floor((diff / (1000 * 60)) % 60),
    s: Math.floor((diff / 1000) % 60),
    expired: false,
  }
}

export default function LivePreview({
  titre,
  prix,
  devise = 'EUR',
  imageRecto,
  imageVerso,
  isStar,
  expiresAt,
  numeroEdition,
  stock = 100,
  rectoLabel,
  versoLabel,
  versoDescription,
}: LivePreviewProps) {
  const { format } = useCurrency()
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0, expired: true })
  const [mounted, setMounted] = useState(false)
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTime(calculateRemaining(expiresAt))
    const timer = setInterval(() => setTime(calculateRemaining(expiresAt)), 1000)
    return () => clearInterval(timer)
  }, [expiresAt])

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="sticky top-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] uppercase tracking-widest text-amber-400 font-bold flex items-center gap-1.5">
          <Star className="w-3 h-3" /> Aperçu Live
        </h4>
        <span className="text-[9px] text-gray-500 italic">
          (tel qu&apos;affiché sur l&apos;accueil)
        </span>
      </div>

      <div className="relative rounded-2xl bg-gradient-to-b from-gray-900/80 to-black p-5 gold-border gold-glow flex flex-col justify-between min-h-[520px]">
        <div>
          <div className="flex justify-between items-center mb-4">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
              N° {numeroEdition || '000'} / {stock}
            </span>
            <span className="text-xs font-mono text-gray-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> Rareté
            </span>
          </div>

          <div
            className="card-flip w-full h-72 rounded-xl overflow-hidden cursor-pointer my-2 border border-white/10"
            onMouseEnter={() => setFlipped(true)}
            onMouseLeave={() => setFlipped(false)}
          >
            <div
              className="card-inner relative w-full h-full text-center"
              style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
            >
              <div
                className="card-front absolute w-full h-full bg-cover bg-center rounded-xl flex items-end p-4"
                style={{
                  backgroundImage: imageRecto ? `url('${imageRecto}')` : 'none',
                  backgroundColor: imageRecto ? undefined : '#1a1a1a',
                }}
              >
                {!imageRecto && (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-[10px]">
                    Image Recto à uploader
                  </div>
                )}
                <div className="w-full bg-black/60 backdrop-blur-md p-2 rounded-lg border border-white/10 text-left">
                  <p className="text-[10px] text-amber-400 uppercase font-bold">
                    {rectoLabel || 'Recto • Couverture'}
                  </p>
                  <p className="text-xs text-white font-cinzel font-bold">
                    {titre || 'Titre du carnet'}
                  </p>
                </div>
              </div>

              <div
                className="card-back absolute w-full h-full bg-cover bg-center rounded-xl flex items-end p-4"
                style={{
                  backgroundImage: imageVerso
                    ? `url('${imageVerso}')`
                    : imageRecto
                    ? `url('${imageRecto}')`
                    : 'none',
                  backgroundColor: !imageVerso && !imageRecto ? '#1a1a1a' : undefined,
                }}
              >
                <div className="w-full bg-black/60 backdrop-blur-md p-2 rounded-lg border border-white/10 text-left">
                  <p className="text-[10px] text-amber-400 uppercase font-bold">
                    {versoLabel || 'Verso • Pages'}
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
          {isStar ? (
            <div className="bg-black/60 rounded-xl p-3 border border-white/5 text-center">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                Disparition dans
              </p>
              <div className="grid grid-cols-4 gap-1 text-center font-mono">
                <div className="bg-white/5 rounded p-1">
                  <span className="block text-base font-bold text-amber-300">
                    {mounted ? pad(time.d) : '--'}
                  </span>
                  <span className="text-[8px] text-gray-400 uppercase">J</span>
                </div>
                <div className="bg-white/5 rounded p-1">
                  <span className="block text-base font-bold text-amber-300">
                    {mounted ? pad(time.h) : '--'}
                  </span>
                  <span className="text-[8px] text-gray-400 uppercase">H</span>
                </div>
                <div className="bg-white/5 rounded p-1">
                  <span className="block text-base font-bold text-amber-300">
                    {mounted ? pad(time.m) : '--'}
                  </span>
                  <span className="text-[8px] text-gray-400 uppercase">M</span>
                </div>
                <div className="bg-white/5 rounded p-1">
                  <span className="block text-base font-bold text-amber-300">
                    {mounted ? pad(time.s) : '--'}
                  </span>
                  <span className="text-[8px] text-gray-400 uppercase">S</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-black/40 rounded-xl p-3 border border-dashed border-white/10 text-center">
              <p className="text-[10px] text-gray-500 italic">
                Ce carnet n&apos;est pas marqué STAR<br />
                → Il apparaîtra dans le Catalogue
              </p>
            </div>
          )}

          <button
            disabled
            className="w-full py-3 rounded-xl font-semibold text-xs tracking-wider uppercase bg-gold-btn text-black shadow-lg opacity-70 flex items-center justify-center gap-2 cursor-not-allowed"
          >
            <ShoppingBag className="w-4 h-4" /> Acquérir — {format(prix, devise)}
          </button>
        </div>
      </div>
    </div>
  )
}