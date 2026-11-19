import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import CommandeForm from './CommandeForm'

export const instant = false

export default async function CommandePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: carnet } = await supabase
    .from('carnets')
    .select('*')
    .eq('id', id)
    .single()

  if (!carnet) notFound()

  return <CommandeForm carnet={carnet} />
}