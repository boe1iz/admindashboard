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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useMediaQuery } from '@/hooks/use-media-query'

export function CreateProgramDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '0'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await addDoc(collection(db, 'programs'), {
        ...formData,
        price: parseFloat(formData.price),
        isArchived: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      setOpen(false)
      setFormData({ name: '', description: '', price: '0' })
      toast.success("Program created successfully")
    } catch (error) {
      console.error('Error adding program: ', error)
      toast.error("Failed to create program")
    } finally {
      setLoading(false)
    }
  }

  const content = (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="grid gap-4 py-4 flex-1">
        <div className="grid gap-2">
          <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Program Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Elite Strength Phase 1"
            required
            className="rounded-xl border-slate-200 dark:border-slate-800 bg-background"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Brief overview of the program"
            required
            className="rounded-xl border-slate-200 dark:border-slate-800 bg-background min-h-[100px]"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="price" className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Price ($)</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="0 for free"
            required
            className="rounded-xl border-slate-200 dark:border-slate-800 bg-background"
          />
        </div>
      </div>
      <div className="mt-auto pt-6">
        <Button type="submit" disabled={loading} className="w-full rounded-full bg-primary font-black uppercase tracking-widest text-xs h-12 shadow-lg shadow-primary/20">
          {loading ? 'Creating...' : 'Create Program'}
        </Button>
      </div>
    </form>
  )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2 rounded-full h-10 px-6 font-black uppercase tracking-widest text-[10px]">
            <Plus className="size-4" />
            New Program
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] rounded-[30px] border-slate-200 dark:border-slate-800 bg-card">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-foreground uppercase tracking-tight">Create Program</DialogTitle>
            <DialogDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Add a new training program to the operational roster.
            </DialogDescription>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="gap-2 rounded-full h-10 px-6 font-black uppercase tracking-widest text-[10px]">
          <Plus className="size-4" />
          New Program
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-[30px] border-t border-slate-200 dark:border-slate-800 bg-card">
        <SheetHeader>
          <SheetTitle className="text-xl font-black text-foreground uppercase tracking-tight">Create Program</SheetTitle>
          <SheetDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Add a new training program to the operational roster.
          </SheetDescription>
        </SheetHeader>
        {content}
      </SheetContent>
    </Sheet>
  )
}

