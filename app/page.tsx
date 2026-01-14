'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, BookOpen, Package, ShieldCheck, Activity, PlusCircle, UserPlus } from 'lucide-react'
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
  const [loading, setLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // 1. Stats Listeners
    const unsubPrograms = onSnapshot(collection(db, 'programs'), (snap) => {
      const active = snap.docs.filter(d => !d.data().isArchived).length
      const archived = snap.docs.filter(d => d.data().isArchived).length
      setStatsData(prev => ({ ...prev, programs: { active, archived } }))
      setIsConnected(true)
    }, () => setIsConnected(false))

    const unsubClients = onSnapshot(collection(db, 'clients'), (snap) => {
      const active = snap.docs.filter(d => !d.data().isArchived).length
      const archived = snap.docs.filter(d => d.data().isArchived).length
      setStatsData(prev => ({ ...prev, clients: { active, archived } }))
    })

    const unsubGear = onSnapshot(collection(db, 'equipment'), (snap) => {
      const active = snap.docs.filter(d => !d.data().isArchived).length
      const archived = snap.docs.filter(d => d.data().isArchived).length
      setStatsData(prev => ({ ...prev, equipment: { active, archived } }))
    })

    // 2. Recent Activity Listener
    const q = query(
      collection(db, 'assignments'),
      orderBy('assigned_at', 'desc'),
      limit(5)
    )
    const unsubActivity = onSnapshot(q, (snap) => {
      const activity = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Assignment[]
      setRecentActivity(activity)
      setLoading(false)
    })

    return () => {
      unsubPrograms()
      unsubClients()
      unsubGear()
      unsubActivity()
    }
  }, [])

  const stats = [
    { 
      name: 'Active Athletes', 
      value: statsData.clients.active.toString(), 
      icon: Users, 
      color: 'text-blue-500' 
    },
    { 
      name: 'Concepts', 
      value: statsData.programs.active.toString(), 
      icon: BookOpen, 
      color: 'text-[#0057FF]' 
    },
    { 
      name: 'Operational Gear', 
      value: statsData.equipment.active.toString(), 
      icon: Package, 
      color: 'text-zinc-400' 
    },
    { 
      name: 'Safe Vault', 
      value: (statsData.programs.archived + statsData.clients.archived + statsData.equipment.archived).toString(), 
      icon: ShieldCheck, 
      color: 'text-zinc-500' 
    },
  ]

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground uppercase">
            Command Center
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <div className={cn(
              "size-2 rounded-full animate-pulse",
              isConnected ? "bg-green-500" : "bg-red-500"
            )} />
            <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">
              Live Connection: {isConnected ? 'Active' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="border-none bg-white dark:bg-[#0F172A] shadow-sm rounded-[40px] p-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                {stat.name}
              </CardTitle>
              <stat.icon className={stat.color + " size-4"} />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none bg-white dark:bg-[#0F172A] shadow-sm rounded-[40px] p-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="size-4 text-[#0057FF]" />
              <CardTitle className="text-xs font-bold uppercase tracking-widest">
                Recent Activity
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
                <p className="text-sm font-medium">No recent assignments found.</p>
              </div>
            ) : (
              <div className="space-y-4 py-2">
                {recentActivity.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <UserPlus className="size-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{item.client_name}</p>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">
                          Joined {item.program_name}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-zinc-400">
                      {new Date(item.assigned_at.seconds * 1000).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 px-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <Button asChild className="h-24 rounded-[30px] bg-[#0057FF] hover:bg-[#0057FF]/90 text-white flex flex-col gap-2 items-start px-8 justify-center shadow-lg shadow-blue-500/20">
              <Link href="/programs">
                <PlusCircle className="size-5" />
                <span className="font-bold">Build Concept</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-24 rounded-[30px] border-zinc-200 dark:border-zinc-800 flex flex-col gap-2 items-start px-8 justify-center hover:bg-zinc-50 dark:hover:bg-white/5">
              <UserPlus className="size-5 text-zinc-500" />
              <span className="font-bold">Onboard Athlete</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
