import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ShieldCheck, LogOut } from 'lucide-react'
import AdminDashboard from '@/components/admin/AdminDashboard'

export const instant = false

export default async function AdminPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/')

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="bg-red-950/20 border border-red-500/30 p-4 rounded-xl flex justify-between items-center">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-red-400" />
          <div>
            <h1 className="text-sm font-bold text-white uppercase tracking-wider">
              Panneau d&apos;Administration Vint&apos;ART
            </h1>
            <p className="text-[10px] text-red-300/70">
              Connecté en tant que {user.email}
            </p>
          </div>
        </div>
        <form action="/auth/signout" method="post">
          <button className="px-3 py-1.5 rounded bg-red-500/20 text-red-300 text-[11px] font-semibold hover:bg-red-500/30 transition-all flex items-center gap-1.5">
            <LogOut className="w-3.5 h-3.5" /> Déconnexion
          </button>
        </form>
      </div>

      <AdminDashboard />
    </div>
  )
}