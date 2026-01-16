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
import { Textarea } from '@/components/ui/textarea'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { MultiSelectCombobox } from './ui/multi-select-combobox'
import { useEquipment } from '@/hooks/useEquipment'

interface CreateWorkoutDialogProps {
  programId: string
  dayId: string
  nextOrderIndex: number
}

export function CreateWorkoutDialog({ programId, dayId, nextOrderIndex }: CreateWorkoutDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { equipment } = useEquipment()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    videoUrl: '',
    equipmentIds: [] as string[]
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await addDoc(collection(db, 'programs', programId, 'days', dayId, 'workouts'), {
        title: formData.name,
        instructions: formData.description,
        video_url: formData.videoUrl,
        equipment_ids: formData.equipmentIds,
        order_index: nextOrderIndex,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      setOpen(false)
      setFormData({ name: '', description: '', videoUrl: '', equipmentIds: [] })
      toast.success("Workout added")
    } catch (error) {
      console.error('Error adding workout: ', error)
      toast.error("Failed to add workout")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="size-4" />
          Add Workout
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-[30px] border-slate-200 dark:border-slate-800 bg-card">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-foreground uppercase tracking-tight">Add Workout</DialogTitle>
            <DialogDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Define a new workout for this day.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="workout-name" className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Workout Name</Label>
              <Input
                id="workout-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Bench Press"
                required
                className="rounded-xl border-slate-200 dark:border-slate-800 bg-background"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="equipment" className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Equipment</Label>
              <MultiSelectCombobox
                options={equipment}
                selected={formData.equipmentIds}
                onChange={(ids) => setFormData({ ...formData, equipmentIds: ids })}
                placeholder="Select equipment..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="workout-description" className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Description</Label>
              <Textarea
                id="workout-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Sets, reps, and coaching cues"
                required
                className="rounded-xl border-slate-200 dark:border-slate-800 bg-background min-h-[100px]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="video-url" className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Video Link (YouTube/Vimeo)</Label>
              <Input
                id="video-url"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                placeholder="https://..."
                className="rounded-xl border-slate-200 dark:border-slate-800 bg-background"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full rounded-full bg-primary font-black uppercase tracking-widest text-xs h-12 shadow-lg shadow-primary/20">
              {loading ? 'Adding...' : 'Add Workout'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
