'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, onSnapshot, orderBy, doc, updateDoc } from 'firebase/firestore'
import { CreateEquipmentDialog } from '@/components/CreateEquipmentDialog'
import { EditEquipmentDialog } from '@/components/EditEquipmentDialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import {
  Package,
  Database,
  Archive,
  MoreVertical,
  ArchiveRestore,
  Pencil
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { motion } from 'framer-motion'

interface Equipment {
  id: string
  name: string
  is_active: boolean
  createdAt: any
}

export default function InventoryPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<Equipment | null>(null)

  useEffect(() => {
    const q = query(collection(db, 'equipment'), orderBy('name', 'asc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Equipment[]
      setEquipment(items)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const toggleActive = async (item: Equipment) => {
    try {
      await updateDoc(doc(db, 'equipment', item.id), {
        is_active: !item.is_active
      })
      toast.success(item.is_active ? "Equipment archived to Vault" : "Equipment restored to Operational")
    } catch (error) {
      console.error('Error toggling status: ', error)
      toast.error("Failed to update status")
    }
  }

  const activeItems = equipment.filter(item => item.is_active)
  const archivedItems = equipment.filter(item => !item.is_active)

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 bg-slate-100 min-h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 flex items-center gap-3 uppercase">
            <Package className="size-6 md:size-8 text-[#0057FF]" />
            Equipment Inventory
          </h2>
          <p className="text-xs md:text-sm font-black text-slate-400 uppercase tracking-widest mt-1">
            Manage facility gear and operational equipment.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CreateEquipmentDialog />
        </div>
      </div>

      <Tabs defaultValue="operational" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <TabsList className="bg-white border border-slate-200 p-1 rounded-full w-fit shadow-sm">
            <TabsTrigger 
              value="operational" 
              className="rounded-full px-4 md:px-6 data-[state=active]:bg-[#0057FF] data-[state=active]:text-white text-xs md:text-sm font-black uppercase tracking-tight"
            >
              Operational ({activeItems.length})
            </TabsTrigger>
            <TabsTrigger 
              value="vault" 
              className="rounded-full px-4 md:px-6 data-[state=active]:bg-[#0057FF] data-[state=active]:text-white text-xs md:text-sm font-black uppercase tracking-tight"
            >
              Archived Vault ({archivedItems.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="operational" className="space-y-4 outline-none">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0057FF]"></div>
            </div>
          ) : activeItems.length === 0 ? (
            <div>
              <Card className="bg-white border-slate-200 p-12 text-center shadow-md rounded-[40px]">
                <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-slate-50 mb-4">
                  <Database className="size-10 text-slate-300" />
                </div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">No Gear Found</h3>
                <p className="text-slate-500 max-w-sm mx-auto mt-2 font-medium">
                  Your operational equipment will appear here once added or restored from the vault.
                </p>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {activeItems.map((item) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="relative group cursor-pointer border-slate-200 bg-white shadow-md hover:shadow-xl hover:border-primary/30 transition-all rounded-[40px] overflow-hidden">
                    <div className="absolute top-4 right-4 z-10">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-2xl border-slate-200 shadow-xl">
                          <DropdownMenuItem onClick={() => setEditingItem(item)} className="rounded-xl m-1">
                            <Pencil className="mr-2 size-4" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleActive(item)} className="rounded-xl m-1 text-slate-500">
                            <Archive className="mr-2 size-4" />
                            Archive
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardHeader className="p-6">
                      <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                        <Package className="size-6 text-primary" />
                      </div>
                      <CardTitle className="line-clamp-1 font-black text-slate-900 uppercase tracking-tight">{item.name}</CardTitle>
                      <CardDescription className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400">
                        Operational
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="vault" className="space-y-4 outline-none">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0057FF]"></div>
            </div>
          ) : archivedItems.length === 0 ? (
            <div>
              <Card className="bg-white border-slate-200 p-12 text-center shadow-md rounded-[40px]">
                <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-slate-50 mb-4">
                  <Archive className="size-10 text-slate-300" />
                </div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Vault is Empty</h3>
                <p className="text-slate-500 max-w-sm mx-auto mt-2 font-medium">
                  Archived equipment is stored here for future restoration.
                </p>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {archivedItems.map((item) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="relative group cursor-pointer border-slate-200 bg-white/50 opacity-60 hover:opacity-100 hover:bg-white shadow-sm hover:shadow-xl transition-all rounded-[40px] overflow-hidden">
                    <div className="absolute top-4 right-4 z-10">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-2xl border-slate-200 shadow-xl">
                          <DropdownMenuItem onClick={() => setEditingItem(item)} className="rounded-xl m-1">
                            <Pencil className="mr-2 size-4" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleActive(item)} className="rounded-xl m-1 text-primary font-bold">
                            <ArchiveRestore className="mr-2 size-4" />
                            Restore
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardHeader className="p-6">
                      <div className="size-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                        <Archive className="size-6 text-slate-400" />
                      </div>
                      <CardTitle className="line-clamp-1 font-black text-slate-900 uppercase tracking-tight grayscale">{item.name}</CardTitle>
                      <CardDescription className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-300">
                        In Vault
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {editingItem && (
        <EditEquipmentDialog
          equipment={editingItem}
          open={!!editingItem}
          onOpenChange={(open) => !open && setEditingItem(null)}
        />
      )}
    </div>
  )
}