'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import LivraisonSelector, { LivraisonMode } from '@/components/LivraisonSelector'
import { useCurrency, CurrencyCode } from '@/lib/currency/CurrencyContext'
import {
  ShoppingBag,
  Truck,
  Plane,
  Banknote,
  Building2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'

type Carnet = {
  id: string
  titre: string
  prix: number
  devise: string | null
  image_recto: string
  saison: string | null
  ville: string | null
}

export default function CommandeForm({ carnet }: { carnet: Carnet }) {
  const { format } = useCurrency()
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [adresse, setAdresse] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [livraison, setLivraison] = useState<LivraisonMode>('domicile')
const [numeroVol, setNumeroVol] = useState('')
const [dateAtterrissage, setDateAtterrissage] = useState('')

  function generateTrackingNumber() {
    const n = Math.floor(10000 + Math.random() * 90000)
    return `#CMD-${n}`
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (livraison === 'aeroport' && (!numeroVol || !dateAtterrissage)) {
  setError('Numéro de vol et date d\'arrivée obligatoires pour un retrait à l\'aéroport.')
  setLoading(false)
  return
}

    const supabase = createClient()
    const numeroSuivi = generateTrackingNumber()

    const { error } = await supabase.from('orders').insert({
      numero_suivi: numeroSuivi,
      client_nom: nom,
      client_email: email,
      client_phone: phone,
      carnet_id: carnet.id,
      carnet_titre: carnet.titre,
      statut: 'En confection',
      montant_total: carnet.prix,
      paiement_methode: 'cod',
      livraison,
      numero_vol: livraison === 'aeroport' ? numeroVol : null,
      date_atterrissage: livraison === 'aeroport' ? dateAtterrissage : null,
     
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(numeroSuivi)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="max-w-3xl mx-auto p-6 sm:p-8 py-16">
        <div className="bg-gradient-to-b from-gray-900 to-black p-8 rounded-2xl border border-amber-500/40 gold-glow text-center space-y-5">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="font-cinzel text-2xl font-bold text-white">
            Commande Confirmée
          </h2>
          <p className="text-sm text-gray-400">
            Merci pour votre confiance. Votre carnet entre en atelier dès maintenant.
          </p>
          <div className="bg-black/60 p-4 rounded-xl border border-amber-500/30">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
              Votre numéro de suivi
            </p>
            <p className="font-mono text-2xl font-bold text-amber-300">{success}</p>
          </div>
          <p className="text-xs text-gray-500">
            Conservez ce numéro précieusement : il ouvre votre <strong className="text-amber-400">Cabine Privée</strong>, où vous pourrez suivre la confection et échanger avec l&apos;atelier.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-6 sm:p-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-[0.3em] text-amber-400 font-bold">
          Finaliser votre commande
        </span>
        <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-white">
          {carnet.titre}
        </h1>
        <p className="text-xs text-gray-400">
          {carnet.saison} • {carnet.ville}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GAUCHE — FORMULAIRE */}
        <form
          onSubmit={handleSubmit}
          className="bg-gradient-to-b from-gray-900 to-black p-6 rounded-2xl border border-white/10 space-y-4"
        >
          <h2 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
            Vos Coordonnées
          </h2>

          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
            placeholder="Nom complet"
            className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
            className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="Téléphone (ex: +216 20 123 456)"
            className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
          />
          <input
            type="text"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            placeholder="Adresse (si livraison Grand Tunis)"
            className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
          />

<LivraisonSelector
  mode={livraison}
  onChange={setLivraison}
  numeroVol={numeroVol}
  onNumeroVolChange={setNumeroVol}
  dateAtterrissage={dateAtterrissage}
  onDateAtterrissageChange={setDateAtterrissage}
/>


          {error && (
            <p className="text-xs text-red-400 bg-red-950/30 border border-red-500/30 rounded-lg p-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-xs tracking-wider uppercase bg-gold-btn text-black shadow-lg hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            {loading
              ? 'Confirmation...'
              : `Confirmer — ${format(carnet.prix, (carnet.devise as CurrencyCode) || 'EUR')}`}
          </button>
        </form>

        {/* DROITE — RÉCAP + LIVRAISON + PAIEMENT */}
        <div className="space-y-4">
          {/* RÉCAP CARNET */}
          <div className="bg-gradient-to-b from-gray-900 to-black p-4 rounded-2xl border border-white/10 flex items-center gap-4">
            <div
              className="w-20 h-20 rounded-xl bg-cover bg-center border border-white/10 shrink-0"
              style={{ backgroundImage: `url('${carnet.image_recto}')` }}
            />
            <div>
              <h3 className="font-cinzel text-lg font-bold text-white">
                {carnet.titre}
              </h3>
              <p className="text-sm text-amber-400 font-bold mt-1">
                {format(carnet.prix, (carnet.devise as CurrencyCode) || 'EUR')}
              </p>
            </div>
          </div>

          {/* LIVRAISON — MESSAGE CHALEUREUX */}
          <div className="bg-gradient-to-br from-amber-950/30 to-black p-5 rounded-2xl border border-amber-500/30 space-y-3">
            <div className="flex items-center gap-2 text-amber-300">
              <Sparkles className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                Livraison offerte, avec le cœur
              </h3>
            </div>
            <div className="space-y-2.5 text-[11px] text-gray-300 leading-relaxed">
              <div className="flex items-start gap-2">
                <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-white">Grand Tunis</strong> — Livraison
                  gratuite, à votre porte, dans un écrin soigné. Parce que chaque
                  carnet mérite son arrivée.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Plane className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-white">Aéroport Tunis-Carthage</strong> —
                  Pour nos voyageurs, votre carnet vous attend à l&apos;arrivée, prêt
                  à accompagner vos premiers pas en Tunisie.
                </p>
              </div>
            </div>
          </div>

          {/* PAIEMENT — COD ACTIF + VIREMENT BIENTÔT */}
          <div className="bg-black/60 p-5 rounded-2xl border border-white/10 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Paiement
            </h3>

            {/* COD actif */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/40">
              <Banknote className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-white">
                    Paiement à la livraison
                  </p>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold uppercase">
                    Disponible
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Réglez en toute simplicité, à la réception de votre carnet.
                </p>
              </div>
            </div>

            {/* Virement bientôt */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 opacity-70">
              <Building2 className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-gray-300">
                    Virement bancaire
                  </p>
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold uppercase">
                    Bientôt
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 mt-0.5 italic">
                  Nous préparons cette option pour vous, avec soin.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}