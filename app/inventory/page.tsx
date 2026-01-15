'use client'

import { useState } from 'react'
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

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Package className="size-8 text-[#0057FF]" />
            Equipment Inventory
          </h2>
          <p className="text-zinc-400">
            Manage your facility gear and operational equipment.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-[#0057FF] hover:bg-[#0057FF]/90 text-white rounded-full px-6">
            <Plus className="mr-2 size-4" />
            Add Gear
          </Button>
        </div>
      </div>

      <Tabs defaultValue="operational" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="bg-zinc-900/50 border border-white/5 p-1 rounded-full">
            <TabsTrigger 
              value="operational" 
              className="rounded-full px-6 data-[state=active]:bg-[#0057FF] data-[state=active]:text-white"
            >
              Operational
            </TabsTrigger>
            <TabsTrigger 
              value="vault" 
              className="rounded-full px-6 data-[state=active]:bg-[#0057FF] data-[state=active]:text-white"
            >
              Vault
            </TabsTrigger>
          </TabsList>

          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
            <Input
              placeholder="Search gear..."
              className="pl-9 bg-zinc-900/50 border-white/5 rounded-full text-zinc-300 placeholder:text-zinc-600 focus-visible:ring-[#0057FF]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="operational" className="space-y-4">
          <Card className="bg-zinc-900/50 border-white/5 p-12 text-center">
            <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-zinc-800/50 mb-4">
              <Database className="size-10 text-zinc-700" />
            </div>
            <h3 className="text-lg font-medium text-white">No Gear Found</h3>
            <p className="text-zinc-500 max-w-sm mx-auto mt-2">
              Your operational equipment will appear here once added or restored from the vault.
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="vault" className="space-y-4">
          <Card className="bg-zinc-900/50 border-white/5 p-12 text-center">
            <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-zinc-800/50 mb-4">
              <Archive className="size-10 text-zinc-700" />
            </div>
            <h3 className="text-lg font-medium text-white">Vault is Empty</h3>
            <p className="text-zinc-500 max-w-sm mx-auto mt-2">
              Archived equipment is stored here for future restoration.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
