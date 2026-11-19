import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import StarCard from '@/components/StarCard'
import SeasonCard from '@/components/SeasonCard'
import VacantCard from '@/components/VacantCard'
export const instant = false
type Carnet = {
  id: string
  titre: string
  description: string | null
  prix: number
  image_recto: string
  image_verso: string | null
  is_star: boolean
  expires_at: string | null
  saison: string | null
  ville: string | null
  reliure: string | null
  stock: number
  created_at: string
  numero_edition: string | null
recto_label: string | null
verso_label: string | null
verso_description: string | null
  devise: string | null
}

export default async function HomePage() {
  const supabase = await createClient()

  const { data: allCarnets } = await supabase
    .from('carnets')
    .select('*')
    .order('created_at', { ascending: true })

  const list = (allCarnets || []) as Carnet[]
  const stars = list.filter((c) => c.is_star)
  const seasons = list.filter((c) => !c.is_star)

  const starSlots: (Carnet | null)[] = [...stars]
  while (starSlots.length < 3) starSlots.push(null)

  return (
    <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-[0.3em] text-amber-400 font-semibold">
          Éditions Éphémères Numérotées
        </span>
        <h2 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-wide text-white">
          Nos Carnets Stars du Moment
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
          Chaque pièce est une œuvre unique. À la fin du compte à rebours, l&apos;édition
          disparaît définitivement pour laisser sa carte vacante.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {starSlots.map((c, i) =>
          c ? (
<StarCard
  key={c.id}
  titre={c.titre}
  prix={c.prix}
  imageRecto={c.image_recto}
  imageVerso={c.image_verso}
  expiresAt={c.expires_at}
  numero={c.numero_edition || String(i + 1).padStart(3, '0')}
  stock={c.stock}
  rectoLabel={c.recto_label}
  versoLabel={c.verso_label}
  versoDescription={c.verso_description}
  devise={c.devise}
/>
          ) : (
            <VacantCard key={`vacant-${i}`} />
          )
        )}
      </div>

      <div className="pt-10 border-t border-white/10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="font-cinzel text-2xl font-bold text-white">
              Collections des 4 Saisons
            </h3>
            <p className="text-xs text-gray-400">
              Le catalogue complet décliné selon le rythme tunisien.
            </p>
          </div>
          <Link
            href="/catalogue"
            className="text-xs text-amber-400 flex items-center gap-1 hover:underline"
          >
            Voir tout le catalogue <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {seasons.slice(0, 4).map((c) => (
           <SeasonCard
  key={c.id}
  titre={c.titre}
  saison={c.saison || 'Collection'}
  prix={c.prix}
  devise={c.devise}
  imageRecto={c.image_recto}
  ville={c.ville}
/>
          ))}
        </div>
      </div>
    </div>
  )
}