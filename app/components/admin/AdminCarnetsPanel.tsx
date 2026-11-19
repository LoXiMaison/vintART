'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import ImageUpload from './ImageUpload'
import LivePreview from './LivePreview'
import { CurrencyCode } from '@/lib/currency/CurrencyContext'
import { Save, Star, Pencil, Plus, Trash2, RotateCcw, X } from 'lucide-react'

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
  numero_edition: string | null
recto_label: string | null
verso_label: string | null
verso_description: string | null
  devise: string | null
}

const EMPTY_CARNET: Omit<Carnet, 'id'> = {
  titre: '',
  description: '',
  prix: 45,
  image_recto: '',
  image_verso: '',
  is_star: false,
  expires_at: null,
  saison: 'Printemps',
  ville: 'Tunis',
  reliure: "Papier d'art",
  stock: 100,
  numero_edition: '',
recto_label: 'Recto • Couverture',
verso_label: 'Verso • Pages intérieures',
verso_description: 'Cartographie & Prompts',
devise: 'EUR',
}

const SAISONS = ['Printemps', 'Été', 'Automne', 'Hiver']
const VILLES = ['Tunis', 'Sidi Bou Saïd', 'Carthage', 'Grand Sud']
const DUREES = [
  { label: '1 jour', days: 1 },
  { label: '3 jours', days: 3 },
  { label: '7 jours', days: 7 },
  { label: '14 jours', days: 14 },
  { label: '30 jours', days: 30 },
]

export default function AdminCarnetsPanel() {
  const [carnets, setCarnets] = useState<Carnet[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Carnet | null>(null)
  const [creating, setCreating] = useState<Carnet | null>(null)

  async function load() {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('carnets')
      .select('*')
      .order('created_at', { ascending: true })
    setCarnets((data || []) as Carnet[])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  function startCreate() {
    setCreating({ id: 'new', ...EMPTY_CARNET })
    setEditing(null)
  }

  async function save(carnet: Carnet, isNew: boolean) {
    const supabase = createClient()
    const payload = {
      titre: carnet.titre,
      description: carnet.description,
      prix: carnet.prix,
      image_recto: carnet.image_recto,
      image_verso: carnet.image_verso,
      is_star: carnet.is_star,
      expires_at: carnet.expires_at,
      saison: carnet.saison,
      ville: carnet.ville,
      reliure: carnet.reliure,
      stock: carnet.stock,
      numero_edition: carnet.numero_edition,
recto_label: carnet.recto_label,
verso_label: carnet.verso_label,
verso_description: carnet.verso_description,
devise: carnet.devise,
    }

    const { error } = isNew
      ? await supabase.from('carnets').insert(payload)
      : await supabase.from('carnets').update(payload).eq('id', carnet.id)

    if (error) return alert('Erreur : ' + error.message)
    alert(isNew ? 'Carnet créé ✅' : 'Carnet enregistré ✅')
    setEditing(null)
    setCreating(null)
    load()
  }

  async function remove(carnet: Carnet) {
    if (!confirm(`Supprimer définitivement "${carnet.titre}" ?`)) return
    const supabase = createClient()
    const { error } = await supabase.from('carnets').delete().eq('id', carnet.id)
    if (error) return alert('Erreur : ' + error.message)
    alert('Carnet supprimé ✅')
    load()
  }

  async function toggleStar(carnet: Carnet) {
    const supabase = createClient()
    const { error } = await supabase
      .from('carnets')
      .update({ is_star: !carnet.is_star })
      .eq('id', carnet.id)
    if (error) return alert('Erreur : ' + error.message)
    load()
  }

  async function resetCountdown(carnet: Carnet) {
    const days = prompt('Durée du compte à rebours en jours ?', '7')
    if (!days || isNaN(Number(days))) return
    const newDate = new Date()
    newDate.setDate(newDate.getDate() + Number(days))
    const supabase = createClient()
    const { error } = await supabase
      .from('carnets')
      .update({ expires_at: newDate.toISOString() })
      .eq('id', carnet.id)
    if (error) return alert('Erreur : ' + error.message)
    alert(`Compte à rebours réinitialisé à ${days} jour(s) ✅`)
    load()
  }

  function applyDuration(carnet: Carnet, days: number, isNew: boolean) {
    const newDate = new Date()
    newDate.setDate(newDate.getDate() + days)
    const updated = { ...carnet, expires_at: newDate.toISOString() }
    if (isNew) setCreating(updated)
    else setEditing(updated)
  }

  if (loading) return <p className="text-gray-400 text-sm">Chargement...</p>

  const editingCarnet = creating || editing
  const isNewMode = !!creating

  const updateField = (field: keyof Carnet, value: string | number | boolean | null) => {
    if (!editingCarnet) return
    const updated = { ...editingCarnet, [field]: value }
    if (isNewMode) setCreating(updated)
    else setEditing(updated)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400">
          Gestion des carnets ({carnets.length})
        </h2>
        <button
          onClick={startCreate}
          className="px-4 py-2 rounded-lg bg-amber-500 text-black text-[11px] font-bold hover:bg-amber-400 flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> Nouveau Carnet
        </button>
      </div>

      {/* FORMULAIRE CRÉATION / ÉDITION */}
      {editingCarnet && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4">
          <div className="bg-gray-900 p-4 rounded-xl border border-amber-500/40 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <h3 className="text-sm font-bold text-amber-300">
                {isNewMode ? '➕ Créer un nouveau carnet' : `✏️ Modifier : ${editingCarnet.titre}`}
              </h3>
              <button
                onClick={() => {
                  setEditing(null)
                  setCreating(null)
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-[10px] text-gray-400 mb-1">Titre *</label>
                <input
                  type="text"
                  value={editingCarnet.titre}
                  onChange={(e) => updateField('titre', e.target.value)}
                  className="w-full bg-black border border-white/10 rounded px-2 py-1.5 text-xs text-white"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] text-gray-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingCarnet.description || ''}
                  onChange={(e) => updateField('description', e.target.value)}
                  className="w-full bg-black border border-white/10 rounded px-2 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 mb-1">Prix (EUR) *</label>
                <input
                  type="number"
                  value={editingCarnet.prix}
                  onChange={(e) => updateField('prix', parseFloat(e.target.value) || 0)}
                  className="w-full bg-black border border-white/10 rounded px-2 py-1 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 mb-1">Stock</label>
                <input
                  type="number"
                  value={editingCarnet.stock}
                  onChange={(e) => updateField('stock', parseInt(e.target.value) || 0)}
                  className="w-full bg-black border border-white/10 rounded px-2 py-1 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 mb-1">Saison</label>
                <select
                  value={editingCarnet.saison || ''}
                  onChange={(e) => updateField('saison', e.target.value)}
                  className="w-full bg-black border border-white/10 rounded px-2 py-1 text-xs text-white"
                >
                  {SAISONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 mb-1">Ville</label>
                <select
                  value={editingCarnet.ville || ''}
                  onChange={(e) => updateField('ville', e.target.value)}
                  className="w-full bg-black border border-white/10 rounded px-2 py-1 text-xs text-white"
                >
                  {VILLES.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>

                            <div className="col-span-2">
                <label className="block text-[10px] text-gray-400 mb-1">
                  N° Édition (affiché sur la carte)
                </label>
                <input
                  type="text"
                  value={editingCarnet.numero_edition || ''}
                  onChange={(e) => updateField('numero_edition', e.target.value)}
                  placeholder="ex: 001"
                  className="w-full bg-black border border-white/10 rounded px-2 py-1 text-xs text-white"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] text-gray-400 mb-1">
                  Label Recto (haut de la couverture)
                </label>
                <input
                  type="text"
                  value={editingCarnet.recto_label || ''}
                  onChange={(e) => updateField('recto_label', e.target.value)}
                  placeholder="ex: Recto • Couverture Cuir"
                  className="w-full bg-black border border-white/10 rounded px-2 py-1 text-xs text-white"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] text-gray-400 mb-1">
                  Label Verso
                </label>
                <input
                  type="text"
                  value={editingCarnet.verso_label || ''}
                  onChange={(e) => updateField('verso_label', e.target.value)}
                  placeholder="ex: Verso • Pages Papyrus"
                  className="w-full bg-black border border-white/10 rounded px-2 py-1 text-xs text-white"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] text-gray-400 mb-1">
                  Texte Verso (description affichée)
                </label>
                <input
                  type="text"
                  value={editingCarnet.verso_description || ''}
                  onChange={(e) => updateField('verso_description', e.target.value)}
                  placeholder="ex: Cartographie & Prompts"
                  className="w-full bg-black border border-white/10 rounded px-2 py-1 text-xs text-white"
                />
              </div>

            </div>

            {/* IMAGES */}
            <div className="grid grid-cols-2 gap-3">
              <ImageUpload
                label="Image Recto (couverture) *"
                currentUrl={editingCarnet.image_recto || null}
                onUploaded={(url) => updateField('image_recto', url)}
              />
              <ImageUpload
                label="Image Verso (pages)"
                currentUrl={editingCarnet.image_verso || null}
                onUploaded={(url) => updateField('image_verso', url)}
              />
            </div>

            {/* STAR + DURÉE */}
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 text-[11px] text-gray-300 cursor-pointer bg-black/40 p-2 rounded border border-white/5">
                <input
                  type="checkbox"
                  checked={editingCarnet.is_star}
                  onChange={(e) => updateField('is_star', e.target.checked)}
                  className="accent-amber-500"
                />
                ⭐ Carnet STAR (accueil)
              </label>

              {editingCarnet.is_star && (
                <div>
                  <label className="block text-[10px] text-gray-400 mb-1">
                    Durée de l&apos;édition
                  </label>
                  <div className="flex gap-1">
                    {DUREES.map((d) => (
                      <button
                        key={d.days}
                        type="button"
                        onClick={() => applyDuration(editingCarnet, d.days, isNewMode)}
                        className="flex-1 px-2 py-1 rounded bg-white/5 hover:bg-amber-500/20 text-[10px] text-gray-300 hover:text-amber-300 border border-white/10"
                      >
                        {d.days}j
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {editingCarnet.is_star && editingCarnet.expires_at && (
              <p className="text-[10px] text-amber-300 font-mono bg-amber-500/10 p-2 rounded">
                ⏰ Expire le : {new Date(editingCarnet.expires_at).toLocaleString('fr-FR')}
              </p>
            )}

            <div className="flex gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => save(editingCarnet, isNewMode)}
                className="px-4 py-2 rounded bg-amber-500 text-black text-[11px] font-bold hover:bg-amber-400 flex items-center gap-1.5"
              >
                <Save className="w-3 h-3" /> {isNewMode ? 'Créer' : 'Enregistrer'}
              </button>
              <button
                onClick={() => {
                  setEditing(null)
                  setCreating(null)
                }}
                className="px-4 py-2 rounded bg-white/5 text-gray-300 text-[11px] hover:bg-white/10"
              >
                Annuler
              </button>
            </div>
          </div>

          {/* APERÇU LIVE À DROITE */}
       <LivePreview
  titre={editingCarnet.titre}
  
  imageRecto={editingCarnet.image_recto || null}
  imageVerso={editingCarnet.image_verso || null}
  isStar={editingCarnet.is_star}
  expiresAt={editingCarnet.expires_at}
  numeroEdition={editingCarnet.numero_edition}
  stock={editingCarnet.stock}
  rectoLabel={editingCarnet.recto_label}
  versoLabel={editingCarnet.verso_label}
  versoDescription={editingCarnet.verso_description}
  prix={editingCarnet.prix}
  devise={(editingCarnet.devise as CurrencyCode) || 'EUR'}
/>
        </div>
      )}

      {/* LISTE DES CARNETS */}
      {carnets.map((c) => (
        <div key={c.id} className="bg-gray-900/80 p-4 rounded-xl border border-white/10">
          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-3 flex-grow">
              <div
                className="w-14 h-14 rounded-lg bg-cover bg-center border border-white/10 shrink-0"
                style={{ backgroundImage: `url('${c.image_recto}')` }}
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-sm">{c.titre}</h3>
                  {c.is_star && (
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  )}
                </div>
                <p className="text-[11px] text-gray-400">
                  {c.prix} EUR • {c.saison || '—'} • {c.ville || '—'} • Stock: {c.stock}
                </p>
                {c.is_star && c.expires_at && (
                  <p className="text-[10px] text-amber-300 font-mono mt-0.5">
                    ⏰ {new Date(c.expires_at).toLocaleString('fr-FR')}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap justify-end">
              <button
                onClick={() => toggleStar(c)}
                className={`px-2.5 py-1.5 rounded text-[10px] font-semibold flex items-center gap-1 ${
                  c.is_star
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white'
                }`}
                title={c.is_star ? 'Dépublier' : 'Publier en Star'}
              >
                <Star className="w-3 h-3" /> {c.is_star ? 'Star' : 'Publier'}
              </button>
              {c.is_star && (
                <button
                  onClick={() => resetCountdown(c)}
                  className="px-2.5 py-1.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-semibold hover:bg-blue-500/30 flex items-center gap-1"
                  title="Réinitialiser le compte à rebours"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              )}
              <button
                onClick={() => {
                  setEditing({ ...c })
                  setCreating(null)
                }}
                className="px-2.5 py-1.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-semibold border border-amber-500/40 hover:bg-amber-500/30 flex items-center gap-1"
              >
                <Pencil className="w-3 h-3" /> Modifier
              </button>
              <button
                onClick={() => remove(c)}
                className="px-2.5 py-1.5 rounded bg-red-500/20 text-red-300 text-[10px] font-semibold border border-red-500/40 hover:bg-red-500/30 flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}