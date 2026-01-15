'use client'

import { useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Package } from 'lucide-react'
import { toast } from 'sonner'

interface CreateEquipmentDialogProps {
  trigger?: React.ReactNode
}

export function CreateEquipmentDialog({ trigger }: CreateEquipmentDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    try {
      await addDoc(collection(db, 'equipment'), {
        name: name.trim(),
        is_active: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      setOpen(false)
      setName('')
      toast.success("Equipment added successfully")
    } catch (error) {
      console.error('Error adding equipment: ', error)
      toast.error("Failed to add equipment")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-[#0057FF] hover:bg-[#0057FF]/90 text-white rounded-full px-6">
            <Plus className="mr-2 size-4" />
            Add Gear
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-white/10 text-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="size-5 text-[#0057FF]" />
              Add New Gear
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Enter the name of the equipment to add it to your inventory.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-zinc-300">Equipment Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dumbbell 25lbs"
                className="bg-zinc-900 border-white/5 text-white focus-visible:ring-[#0057FF]"
                required
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setOpen(false)}
              className="text-zinc-400 hover:text-white hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !name.trim()}
              className="bg-[#0057FF] hover:bg-[#0057FF]/90 text-white"
            >
              {loading ? 'Adding...' : 'Add Equipment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
