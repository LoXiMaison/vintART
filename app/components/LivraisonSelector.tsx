'use client'

import { Truck, Plane } from 'lucide-react'

export type LivraisonMode = 'domicile' | 'aeroport'

type Props = {
  mode: LivraisonMode
  onChange: (mode: LivraisonMode) => void
  numeroVol: string
  onNumeroVolChange: (v: string) => void
  dateAtterrissage: string
  onDateAtterrissageChange: (v: string) => void
}

export default function LivraisonSelector({
  mode,
  onChange,
  numeroVol,
  onNumeroVolChange,
  dateAtterrissage,
  onDateAtterrissageChange,
}: Props) {
  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider">
        Mode de livraison
      </label>

      {/* 2 boutons de choix */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onChange('domicile')}
          className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
            mode === 'domicile'
              ? 'bg-amber-500/20 border-amber-500/40'
              : 'bg-white/5 border-white/10 hover:border-white/20'
          }`}
        >
          <Truck
            className={`w-4 h-4 mt-0.5 shrink-0 ${
              mode === 'domicile' ? 'text-amber-400' : 'text-gray-400'
            }`}
          />
          <div>
            <p
              className={`text-xs font-bold ${
                mode === 'domicile' ? 'text-amber-300' : 'text-gray-300'
              }`}
            >
              À domicile
            </p>
            <p className="text-[10px] text-gray-500 mt-0.5">
              Grand Tunis — gratuit
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onChange('aeroport')}
          className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
            mode === 'aeroport'
              ? 'bg-amber-500/20 border-amber-500/40'
              : 'bg-white/5 border-white/10 hover:border-white/20'
          }`}
        >
          <Plane
            className={`w-4 h-4 mt-0.5 shrink-0 ${
              mode === 'aeroport' ? 'text-amber-400' : 'text-gray-400'
            }`}
          />
          <div>
            <p
              className={`text-xs font-bold ${
                mode === 'aeroport' ? 'text-amber-300' : 'text-gray-300'
              }`}
            >
              À l&apos;aéroport
            </p>
            <p className="text-[10px] text-gray-500 mt-0.5">
              Tunis-Carthage à l&apos;arrivée
            </p>
          </div>
        </button>
      </div>

      {/* Champs vol + date (si aéroport) */}
      {mode === 'aeroport' && (
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div>
            <label className="block text-[10px] text-gray-400 mb-1">
              N° de vol *
            </label>
            <input
              type="text"
              value={numeroVol}
              onChange={(e) => onNumeroVolChange(e.target.value.toUpperCase())}
              required
              placeholder="ex: TU721"
              className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="block text-[10px] text-gray-400 mb-1">
              Date d&apos;arrivée *
            </label>
            <input
              type="date"
              value={dateAtterrissage}
              onChange={(e) => onDateAtterrissageChange(e.target.value)}
              required
              className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>
      )}
    </div>
  )
}