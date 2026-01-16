'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Package } from 'lucide-react'
import { toast } from 'sonner'

interface Equipment {
  id: string
  name: string
}

export function EditEquipmentDialog({ 
  equipment, 
  open, 
  onOpenChange 
}: { 
  equipment: Equipment
  open: boolean
  onOpenChange: (open: boolean) => void 
}) {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(equipment.name)

  useEffect(() => {
    setName(equipment.name)
  }, [equipment.name, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    try {
      await updateDoc(doc(db, 'equipment', equipment.id), {
        name: name.trim(),
        updatedAt: serverTimestamp()
      })
      onOpenChange(false)
      toast.success("Equipment updated")
    } catch (error) {
      console.error('Error updating equipment: ', error)
      toast.error("Failed to update equipment")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card border-slate-200 dark:border-slate-800 text-foreground rounded-[30px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-black uppercase tracking-tight">
              <Package className="size-5 text-[#0057FF] dark:text-[#3B82F6]" />
              Edit Equipment
            </DialogTitle>
            <DialogDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Update the name of this piece of gear.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name" className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Equipment Name</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
              onClick={() => onOpenChange(false)}
              className="rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-black uppercase tracking-widest text-[10px]"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !name.trim() || name.trim() === equipment.name}
              className="bg-[#0057FF] hover:bg-[#0057FF]/90 text-white rounded-full font-black uppercase tracking-widest text-[10px] px-6"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
