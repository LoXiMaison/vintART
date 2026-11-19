'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import LivraisonSelector, { LivraisonMode } from '@/components/LivraisonSelector'
import { Crown, Plane, Calendar,Banknote, MapPin, CheckCircle2 } from 'lucide-react'
import { useCurrency } from '@/lib/currency/CurrencyContext'

const ETAPES = [
  'Médina & Souks de Tunis',
  'Sidi Bou Saïd & La Marsa',
  'Site Archéologique de Carthage',
  'Grand Sud & Sahara',
]

const PRIX_VIP = 95

export default function VipPage() {
  const { format } = useCurrency()
  const [initiales, setInitiales] = useState('')
  const [etapes, setEtapes] = useState<string[]>([ETAPES[0], ETAPES[1]])
 const [livraison, setLivraison] = useState<LivraisonMode>('aeroport')
const [numeroVol, setNumeroVol] = useState('')
const [dateAtterrissage, setDateAtterrissage] = useState('')
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function toggleEtape(e: string) {
    setEtapes((prev) =>
      prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]
    )
  }

  function generateTrackingNumber() {
    const n = Math.floor(10000 + Math.random() * 90000)
    return `#VIP-${n}`
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
      carnet_titre: `Carnet VIP sur-mesure — ${initiales.toUpperCase() || 'Sans initiales'}`,
      initiales_gravure: initiales.toUpperCase(),
      livraison,
      numero_vol: livraison === 'aeroport' ? numeroVol : null,
      date_atterrissage: livraison === 'aeroport' ? dateAtterrissage : null,
      statut: 'En confection',
      montant_total: PRIX_VIP,
      paiement_methode: 'cod',
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
            Commande VIP Confirmée
          </h2>
          <p className="text-sm text-gray-400">
            Votre carnet sur-mesure sera prêt à votre arrivée à l&apos;Aéroport Tunis-Carthage.
          </p>
          <div className="bg-black/60 p-4 rounded-xl border border-amber-500/30">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
              Votre numéro de suivi
            </p>
            <p className="font-mono text-2xl font-bold text-amber-300">{success}</p>
          </div>
          <p className="text-xs text-gray-500">
            Conservez ce numéro : il vous permettra d&apos;accéder à votre <strong className="text-amber-400">Cabine Privée</strong> pour suivre la confection et communiquer avec l&apos;atelier.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 sm:p-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-[0.3em] text-amber-400 font-bold flex items-center justify-center gap-1.5">
          <Crown className="w-4 h-4" /> Sur-Mesure Exclusif
        </span>
        <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-white">
          Service VIP & Personalization Studio
        </h1>
        <p className="text-xs text-gray-400 max-w-xl mx-auto">
          Composez votre carnet unique et récupérez-le le jour de votre arrivée à l&apos;Aéroport Tunis-Carthage.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GAUCHE — FORMULAIRE */}
        <div className="bg-gradient-to-b from-gray-900 to-black p-6 rounded-2xl border border-amber-500/30 gold-glow space-y-6">
          {/* 1. INITIALES */}
          <div>
            <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
              1. Vos Initiales (Gravure à la feuille d&apos;or)
            </label>
            <input
              type="text"
              value={initiales}
              onChange={(e) => setInitiales(e.target.value.toUpperCase().slice(0, 4))}
              maxLength={4}
              placeholder="ex: A.K."
              className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-white text-lg font-cinzel font-bold focus:border-amber-400 focus:outline-none"
            />
          </div>

          {/* 2. ITINÉRAIRE */}
          <div>
            <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
              2. Étapes de votre Itinéraire
            </label>
            <div className="space-y-2 text-xs">
              {ETAPES.map((e) => (
                <label
                  key={e}
                  className="flex items-center space-x-3 bg-white/5 p-3 rounded-xl border border-white/5 cursor-pointer hover:bg-white/10 transition-all"
                >
                  <input
                    type="checkbox"
                    checked={etapes.includes(e)}
                    onChange={() => toggleEtape(e)}
                    className="accent-amber-500"
                  />
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-gray-300">{e}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 3. VOL + DATE */}
          <div>
  <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
    3. RETRAIT
  </label>
  <LivraisonSelector
    mode={livraison}
    onChange={setLivraison}
    numeroVol={numeroVol}
    onNumeroVolChange={setNumeroVol}
    dateAtterrissage={dateAtterrissage}
    onDateAtterrissageChange={setDateAtterrissage}
  />
</div>

          {/* 4. COORDONNÉES */}
          <div>
            <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
              4. Vos Coordonnées
            </label>
            <div className="space-y-2">
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
                placeholder="Nom complet"
                className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email"
                className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="Téléphone (ex: +216 20 123 456)"
                className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-950/30 border border-red-500/30 rounded-lg p-2">
              {error}
            </p>
          )}
        </div>

        {/* DROITE — APERÇU LIVE */}
        <div className="bg-black/60 p-6 rounded-2xl border border-white/10 text-center space-y-6 sticky top-24 h-fit">
          <span className="text-[10px] uppercase tracking-widest text-gray-400 block">
            Aperçu direct de votre exemplaire
          </span>

          <div className="w-56 h-72 mx-auto rounded-xl bg-gradient-to-tr from-amber-950 via-gray-900 to-black border-2 border-amber-500/40 p-4 flex flex-col justify-between shadow-2xl">
            <div className="text-right">
              <span className="text-[8px] text-amber-400 font-mono">PIÈCE VIP</span>
            </div>
            <div className="text-center py-6">
              <h4 className="font-cinzel text-3xl font-bold tracking-widest text-amber-300">
                {initiales || 'A.K.'}
              </h4>
              <p className="text-[8px] uppercase tracking-widest text-gray-400 mt-2">
                Vint&apos;ART
              </p>
            </div>
            <div className="text-left border-t border-amber-500/20 pt-2">
              <p className="text-[7px] text-gray-400">Livraison Express :</p>
             <p className="text-[8px] text-amber-300 font-bold">
  {livraison === 'aeroport' ? 'Aéroport Tunis-Carthage' : 'Livraison Grand Tunis'}
</p>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-left space-y-1">
            <p className="text-[10px] text-gray-400">Itinéraire sélectionné :</p>
            <p className="text-[11px] text-amber-300 font-bold">
              {etapes.length} étape(s)
            </p>
            {numeroVol && (
              <p className="text-[10px] text-gray-300">Vol : {numeroVol}</p>
            )}
            {dateAtterrissage && (
              <p className="text-[10px] text-gray-300">
                Arrivée : {new Date(dateAtterrissage).toLocaleDateString('fr-FR')}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-xs tracking-wider uppercase bg-gold-btn text-black shadow-lg hover:brightness-110 transition-all disabled:opacity-50"
          >
            {loading ? 'Confirmation...' : `Valider la Commande VIP — ${format(PRIX_VIP, 'EUR')}`}
          </button>

        <div className="space-y-2 pt-2 border-t border-white/10">
  <div className="flex items-center justify-center gap-2 flex-wrap">
    <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
      <Banknote className="w-3 h-3" /> Paiement à la livraison
    </span>
    <span className="px-2 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-bold uppercase tracking-wider">
      Paiement en ligne — Bientôt
    </span>
  </div>
  <p className="text-[10px] text-gray-500 italic">
    {livraison === 'aeroport' ? 'Retrait à l\'Aéroport Tunis-Carthage' : 'Livraison à domicile — Grand Tunis'}
  </p>
</div>
        </div>
      </form>
    </div>
  )
}