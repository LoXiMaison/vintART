'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, Loader2 } from 'lucide-react'

type ImageUploadProps = {
  label: string
  currentUrl: string | null
  onUploaded: (url: string) => void
  folder?: string
}

export default function ImageUpload({
  label,
  currentUrl,
  onUploaded,
  folder = '',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const fileName = `${folder}${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('carnets')
      .upload(fileName, file, { cacheControl: '3600', upsert: false })

    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      return
    }

    const { data: urlData } = supabase.storage.from('carnets').getPublicUrl(fileName)
    onUploaded(urlData.publicUrl)
    setUploading(false)
  }

  return (
    <div>
      <label className="block text-[10px] text-gray-400 mb-1">{label}</label>
      <div className="flex items-center gap-3">
        {currentUrl ? (
          <div
            className="w-16 h-16 rounded-lg bg-cover bg-center border border-white/10 shrink-0"
            style={{ backgroundImage: `url('${currentUrl}')` }}
          />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-white/5 border border-dashed border-white/20 shrink-0" />
        )}
        <label className="flex-grow cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-[11px] text-gray-300 flex items-center justify-center gap-2 transition-all">
          {uploading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Upload...
            </>
          ) : (
            <>
              <Upload className="w-3.5 h-3.5" /> Choisir une image
            </>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>
      {error && <p className="text-[10px] text-red-400 mt-1">{error}</p>}
    </div>
  )
}