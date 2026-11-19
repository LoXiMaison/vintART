import { Sparkles } from 'lucide-react'

export default function VacantCard() {
  return (
    <div className="relative rounded-2xl bg-black/40 p-5 border border-dashed border-white/15 flex flex-col justify-center items-center min-h-[520px] text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
        <Sparkles className="w-8 h-8 text-amber-500/40" />
      </div>
      <div>
        <span className="text-[10px] uppercase tracking-widest text-amber-500">
          Carte Vacante
        </span>
        <h3 className="font-cinzel text-xl text-gray-400 font-bold mt-1">
          Nouvelle Édition en Préparation
        </h3>
        <p className="text-xs text-gray-500 max-w-xs mt-2">
          L&apos;atelier prépare la nouvelle pièce de collection pour la saison prochaine.
        </p>
      </div>
      <span className="px-4 py-2 rounded-full text-[10px] uppercase tracking-wider bg-white/5 text-gray-400 border border-white/10">
        Bientôt Révélé
      </span>
    </div>
  )
}