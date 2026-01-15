'use client'

import { useState, useEffect } from 'react'
import { 
  Package, 
  Search, 
  Plus, 
  Database,
  Archive,
  Trash2,
  Edit2
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { db } from '@/lib/firebase'
import { collection, query, onSnapshot, orderBy, doc, updateDoc } from 'firebase/firestore'
import { CreateEquipmentDialog } from '@/components/CreateEquipmentDialog'
import { EditEquipmentDialog } from '@/components/EditEquipmentDialog'
import { toast } from 'sonner'

interface Equipment {
  id: string
  name: string
  is_active: boolean
  createdAt: any
}

export default function InventoryPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
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

  const filteredItems = equipment.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeItems = filteredItems.filter(item => item.is_active)
  const archivedItems = filteredItems.filter(item => !item.is_active)

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Package className="size-6 md:size-8 text-[#0057FF]" />
            Equipment Inventory
          </h2>
          <p className="text-xs md:text-sm text-zinc-400">
            Manage your facility gear and operational equipment.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CreateEquipmentDialog />
        </div>
      </div>

      <Tabs defaultValue="operational" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <TabsList className="bg-zinc-900/50 border border-white/5 p-1 rounded-full w-fit">
            <TabsTrigger 
              value="operational" 
              className="rounded-full px-4 md:px-6 data-[state=active]:bg-[#0057FF] data-[state=active]:text-white text-xs md:text-sm"
            >
              Operational
            </TabsTrigger>
            <TabsTrigger 
              value="vault" 
              className="rounded-full px-4 md:px-6 data-[state=active]:bg-[#0057FF] data-[state=active]:text-white text-xs md:text-sm"
            >
              Archived Vault
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
            <Input
              placeholder="Search gear..."
              className="pl-9 bg-zinc-900/50 border-white/5 rounded-full text-zinc-300 placeholder:text-zinc-600 focus-visible:ring-[#0057FF] h-9 md:h-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="operational" className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0057FF]"></div>
            </div>
          ) : activeItems.length === 0 ? (
            <div>
              <Card className="bg-zinc-900/50 border-white/5 p-12 text-center">
                <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-zinc-800/50 mb-4">
                  <Database className="size-10 text-zinc-700" />
                </div>
                <h3 className="text-lg font-medium text-white">No Gear Found</h3>
                <p className="text-zinc-500 max-w-sm mx-auto mt-2">
                  Your operational equipment will appear here once added or restored from the vault.
                </p>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {activeItems.map((item) => (
                <div key={item.id}>
                  <Card className="bg-zinc-900/50 border-white/5 p-6 h-full flex items-center justify-between group hover:border-[#0057FF]/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-2xl bg-[#0057FF]/10 flex items-center justify-center">
                        <Package className="size-6 text-[#0057FF]" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white uppercase tracking-tight line-clamp-1">{item.name}</h4>
                        <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mt-1">
                          Operational
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-zinc-400 hover:text-white hover:bg-white/5"
                        onClick={() => setEditingItem(item)}
                        aria-label="Edit equipment"
                      >
                        <Edit2 className="size-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-zinc-400 hover:text-[#0057FF] hover:bg-[#0057FF]/5"
                        onClick={() => toggleActive(item)}
                        aria-label="Archive equipment"
                      >
                        <Archive className="size-4" />
                      </Button>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="vault" className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0057FF]"></div>
            </div>
          ) : archivedItems.length === 0 ? (
            <div>
              <Card className="bg-zinc-900/50 border-white/5 p-12 text-center">
                <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-zinc-800/50 mb-4">
                  <Archive className="size-10 text-zinc-700" />
                </div>
                <h3 className="text-lg font-medium text-white">Vault is Empty</h3>
                <p className="text-zinc-500 max-w-sm mx-auto mt-2">
                  Archived equipment is stored here for future restoration.
                </p>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {archivedItems.map((item) => (
                <div key={item.id}>
                  <Card className="bg-zinc-900/50 border-white/5 p-6 h-full flex items-center justify-between group opacity-60 hover:opacity-100 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-2xl bg-zinc-800 flex items-center justify-center">
                        <Archive className="size-6 text-zinc-500" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white uppercase tracking-tight line-clamp-1">{item.name}</h4>
                        <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mt-1">
                          In Vault
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-zinc-400 hover:text-[#0057FF] hover:bg-[#0057FF]/5"
                        onClick={() => toggleActive(item)}
                        aria-label="Restore equipment"
                      >
                        <Database className="size-4" />
                      </Button>
                    </div>
                  </Card>
                </div>
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
