'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, BookOpen, Package, Activity, PlusCircle, UserPlus, Archive, ArchiveRestore, UserMinus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { AnimatedCounter } from '@/components/AnimatedCounter'

function formatRelativeTime(seconds: number) {
  if (!seconds || seconds === 0) return 'Just now'
  const now = Math.floor(Date.now() / 1000)
  const diff = Math.max(0, now - seconds)
  
  if (diff < 300) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  
  return new Date(seconds * 1000).toLocaleDateString()
}

interface ActivityItem {
  id: string
  type: 'assignment' | 'unassigned' | 'archive' | 'restore' | 'onboarded'
  client_name: string
  program_name?: string
  timestamp: number
}

export default function Dashboard() {
  const [statsData, setStatsData] = useState({
    programs: { active: 0, archived: 0 },
    clients: { active: 0, archived: 0 },
    equipment: { active: 0, archived: 0 },
  })
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
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

    const qActivity = query(collection(db, 'activity'), orderBy('timestamp', 'desc'), limit(5))
    const unsubActivity = onSnapshot(qActivity, (snap) => {
      const activity = snap.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.seconds || Math.floor(Date.now() / 1000)
        } as ActivityItem
      })
      setRecentActivity(activity)
    })

    return () => {
      unsubPrograms(); unsubClients(); unsubGear(); unsubActivity();
    }
  }, [])

  const stats = [
    { name: 'Active Clients', value: statsData.clients.active, icon: Users, color: 'text-blue-600' },
    { name: 'Concepts', value: statsData.programs.active, icon: BookOpen, color: 'text-[#0057FF]' },
    { name: 'Operational Gear', value: statsData.equipment.active, icon: Package, color: 'text-slate-500' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-4xl font-black tracking-tight text-foreground uppercase">
          Command Center
        </h1>
        <div className="flex items-center gap-2 mt-2">
          <div className="relative flex items-center justify-center">
            <div className={cn("size-2 rounded-full", isConnected ? "bg-green-500" : "bg-red-500")} />
            {isConnected && (
              <motion.div 
                className="absolute size-4 bg-green-500/30 rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
            Live Connection: {isConnected ? 'Active' : 'Offline'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <motion.div key={stat.name} whileHover={{ scale: 1.02, y: -4 }}>
            <Card className="border border-slate-200 dark:border-slate-800 bg-card shadow-md rounded-[40px] p-2 h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                  {stat.name}
                </CardTitle>
                <stat.icon className={stat.color + " size-4"} />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black text-foreground">
                  {process.env.NODE_ENV === 'test' ? stat.value : <AnimatedCounter value={stat.value} />}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div className="lg:col-span-2" whileHover={{ scale: 1.01 }}>
          <Card className="border border-slate-200 dark:border-slate-800 bg-card shadow-md rounded-[40px] p-2 h-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Activity className="size-4 text-[#0057FF] dark:text-[#3B82F6]" />
                <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                  Recent Activity
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <div className="py-12 text-center text-slate-400 dark:text-slate-600 text-sm font-bold uppercase tracking-widest">No recent activity.</div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((item) => (
                    <div key={item.id} className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "size-8 rounded-full flex items-center justify-center",
                          item.type === 'assignment' || item.type === 'onboarded' ? "bg-blue-50 dark:bg-blue-950/30" : "bg-slate-50 dark:bg-slate-800/50"
                        )}>
                          {(item.type === 'assignment' || item.type === 'onboarded') && <UserPlus className="size-4 text-[#0057FF] dark:text-blue-400" />}
                          {item.type === 'unassigned' && <UserMinus className="size-4 text-red-400 dark:text-red-500" />}
                          {item.type === 'archive' && <Archive className="size-4 text-slate-400 dark:text-slate-500" />}
                          {item.type === 'restore' && <ArchiveRestore className="size-4 text-primary dark:text-blue-400" />}
                        </div>
                        <div>
                          <p className="text-sm font-black uppercase text-foreground">
                            {item.client_name || 'Unknown Athlete'}
                          </p>
                          <p className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500">
                            {item.type === 'assignment' && `was assigned to ${item.program_name || 'Program'}`}
                            {item.type === 'unassigned' && `was unassigned from ${item.program_name || 'Program'}`}
                            {item.type === 'onboarded' && `joined ON3 Performance`}
                            {item.type === 'archive' && `was archived`}
                            {item.type === 'restore' && `was restored`}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-300 dark:text-slate-600">
                        {formatRelativeTime(item.timestamp)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <div className="space-y-6">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 px-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {['Build Concept', 'Onboard Client', 'Manage Gear'].map((label, i) => (
              <Button key={label} variant="outline" asChild className="h-24 rounded-[30px] border-slate-200 dark:border-slate-800 bg-card shadow-sm flex flex-col gap-2 items-start px-8 justify-center hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-[#0057FF]/30 dark:hover:border-blue-500/30 transition-all">
                <Link href={['/programs', '/clients', '/inventory'][i]}>
                  {i === 0 ? <PlusCircle className="size-5 text-[#0057FF] dark:text-[#3B82F6]" /> : i === 1 ? <UserPlus className="size-5 text-[#0057FF] dark:text-[#3B82F6]" /> : <Package className="size-5 text-[#0057FF] dark:text-[#3B82F6]" />}
                  <span className="font-bold text-foreground">{label}</span>
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}