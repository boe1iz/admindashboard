'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, BookOpen, Package, Activity, PlusCircle, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Assignment {
  id: string
  client_name: string
  program_name: string
  assigned_at: { seconds: number; nanoseconds: number }
}

export default function Dashboard() {
  const [statsData, setStatsData] = useState({
    programs: { active: 0, archived: 0 },
    clients: { active: 0, archived: 0 },
    equipment: { active: 0, archived: 0 },
  })
  const [recentActivity, setRecentActivity] = useState<Assignment[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const unsubPrograms = onSnapshot(collection(db, 'programs'), (snap) => {
      const active = snap.docs.filter(d => !d.data().isArchived).length
      setStatsData(prev => ({ ...prev, programs: { ...prev.programs, active } }))
      setIsConnected(true)
    }, () => setIsConnected(false))

    const unsubClients = onSnapshot(collection(db, 'clients'), (snap) => {
      const active = snap.docs.filter(d => d.data().is_active).length
      setStatsData(prev => ({ ...prev, clients: { ...prev.clients, active } }))
    })

    const unsubGear = onSnapshot(collection(db, 'equipment'), (snap) => {
      const active = snap.docs.filter(d => d.data().is_active).length
      setStatsData(prev => ({ ...prev, equipment: { ...prev.equipment, active } }))
    })

    const q = query(collection(db, 'assignments'), orderBy('assigned_at', 'desc'), limit(5))
    const unsubActivity = onSnapshot(q, (snap) => {
      const activity = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Assignment[]
      setRecentActivity(activity)
    })

    return () => {
      unsubPrograms(); unsubClients(); unsubGear(); unsubActivity();
    }
  }, [])

  const stats = [
    { name: 'Active Clients', value: statsData.clients.active.toString(), icon: Users, color: 'text-blue-600' },
    { name: 'Concepts', value: statsData.programs.active.toString(), icon: BookOpen, color: 'text-[#0057FF]' },
    { name: 'Operational Gear', value: statsData.equipment.active.toString(), icon: Package, color: 'text-slate-500' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase">
          Command Center
        </h1>
        <div className="flex items-center gap-2 mt-2">
          <div className={cn("size-2 rounded-full animate-pulse", isConnected ? "bg-green-500" : "bg-red-500")} />
          <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
            Live Connection: {isConnected ? 'Active' : 'Offline'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="border border-slate-200 bg-white shadow-md rounded-[40px] p-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                {stat.name}
              </CardTitle>
              <stat.icon className={stat.color + " size-4"} />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-slate-900">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border border-slate-200 bg-white shadow-md rounded-[40px] p-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="size-4 text-[#0057FF]" />
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                Recent Activity
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">No recent activity.</div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-blue-50 flex items-center justify-center">
                        <UserPlus className="size-4 text-[#0057FF]" />
                      </div>
                      <div>
                        <p className="text-sm font-black uppercase text-slate-900">{item.client_name}</p>
                        <p className="text-[10px] uppercase font-black text-slate-400">Joined {item.program_name}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-300">
                      {new Date(item.assigned_at.seconds * 1000).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 px-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {['Build Concept', 'Onboard Client', 'Manage Gear'].map((label, i) => (
              <Button key={label} variant="outline" asChild className="h-24 rounded-[30px] border-slate-200 bg-white shadow-sm flex flex-col gap-2 items-start px-8 justify-center hover:bg-slate-50 hover:border-[#0057FF]/30 transition-all">
                <Link href={['/programs', '/clients', '/inventory'][i]}>
                  {i === 0 ? <PlusCircle className="size-5 text-[#0057FF]" /> : i === 1 ? <UserPlus className="size-5 text-[#0057FF]" /> : <Package className="size-5 text-[#0057FF]" />}
                  <span className="font-bold text-slate-900">{label}</span>
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}