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
      <DialogContent className="sm:max-w-[425px] bg-card border-slate-200 dark:border-slate-800 text-foreground rounded-[30px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-black uppercase tracking-tight">
              <Package className="size-5 text-[#0057FF] dark:text-[#3B82F6]" />
              Add New Gear
            </DialogTitle>
            <DialogDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Enter the name of the equipment to add it to your inventory.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Equipment Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dumbbell 25lbs"
                className="bg-background border-slate-200 dark:border-slate-800 rounded-xl focus-visible:ring-[#0057FF]"
                required
                autoFocus
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setOpen(false)}
              className="rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-black uppercase tracking-widest text-[10px]"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !name.trim()}
              className="bg-[#0057FF] hover:bg-[#0057FF]/90 text-white rounded-full font-black uppercase tracking-widest text-[10px] px-6"
            >
              {loading ? 'Adding...' : 'Add Equipment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
