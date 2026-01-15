'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { 
  collection, 
  query, 
  onSnapshot, 
  doc, 
  getDoc, 
  addDoc, 
  deleteDoc, 
  orderBy,
  updateDoc
} from 'firebase/firestore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2, ArrowLeft, Video, ChevronUp, ChevronDown, Pencil } from 'lucide-react'
import Link from 'next/link'
import { use } from 'react'
import { CreateWorkoutDialog } from '@/components/CreateWorkoutDialog'
import { VideoModal } from '@/components/VideoModal'
import { EditWorkoutDialog } from '@/components/EditWorkoutDialog'
import { ConfirmDeleteDialog } from '@/components/ConfirmDeleteDialog'
import { toast } from 'sonner'

interface Workout {
  id: string
  title: string
  instructions: string
  video_url?: string
  order_index: number
}

interface Day {
  id: string
  title: string
  day_number: number
}

interface Program {
  id: string
  name: string
}

function WorkoutCard({ 
  workout, 
  programId, 
  dayId, 
  isFirst, 
  isLast, 
  onMove 
}: { 
  workout: Workout, 
  programId: string, 
  dayId: string,
  isFirst: boolean,
  isLast: boolean,
  onMove: (direction: 'up' | 'down') => void
}) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const deleteWorkout = async () => {
    try {
      await deleteDoc(doc(db, 'programs', programId, 'days', dayId, 'workouts', workout.id))
      toast.success("Workout deleted successfully")
    } catch (error) {
      console.error(error)
      toast.error("Failed to delete workout")
    }
  }

  return (
    <>
      <div className="flex items-center justify-between p-3 rounded-lg border bg-zinc-50/50 dark:bg-zinc-900/50 group/workout hover:border-primary/30 transition-all">
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-0.5 opacity-0 group-hover/workout:opacity-100 transition-opacity">
            <Button 
              variant="ghost" 
              size="icon" 
              className="size-6 p-0 disabled:opacity-30" 
              onClick={() => onMove('up')}
              disabled={isFirst}
            >
              <ChevronUp className="size-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="size-6 p-0 disabled:opacity-30" 
              onClick={() => onMove('down')}
              disabled={isLast}
            >
              <ChevronDown className="size-3" />
            </Button>
          </div>
          {workout.video_url ? (
            <VideoModal videoUrl={workout.video_url} title={workout.title} />
          ) : (
            <div className="size-8 flex items-center justify-center text-muted-foreground/30">
              <Video className="size-4" />
            </div>
          )}
          <div>
            <h4 className="font-medium text-sm text-foreground">{workout.title}</h4>
            <p className="text-xs text-muted-foreground line-clamp-1">{workout.instructions}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover/workout:opacity-100 transition-opacity">
          <Button 
            variant="ghost" 
            size="icon" 
            className="size-8 text-muted-foreground hover:text-primary"
            onClick={() => setIsEditDialogOpen(true)}
          >
            <Pencil className="size-3" />
          </Button>
          
          <ConfirmDeleteDialog
            title="Delete Workout"
            description={`Are you sure you want to delete "${workout.title}"? This action cannot be undone.`}
            onConfirm={deleteWorkout}
            trigger={
              <Button 
                variant="ghost" 
                size="icon" 
                className="size-8 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-3" />
              </Button>
            }
          />
        </div>
      </div>

      <EditWorkoutDialog
        programId={programId}
        dayId={dayId}
        workout={workout}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </>
  )
}

function DaySection({ day, programId }: { day: Day, programId: string }) {
  const [workouts, setWorkouts] = useState<Workout[]>([])

  useEffect(() => {
    const q = query(collection(db, 'programs', programId, 'days', day.id, 'workouts'), orderBy('order_index'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const workoutsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Workout[]
      setWorkouts(workoutsData)
    })
    return () => unsubscribe()
  }, [programId, day.id])

  const moveWorkout = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= workouts.length) return

    const currentWorkout = workouts[index]
    const otherWorkout = workouts[targetIndex]

    try {
      await updateDoc(doc(db, 'programs', programId, 'days', day.id, 'workouts', currentWorkout.id), {
        order_index: otherWorkout.order_index
      })
      await updateDoc(doc(db, 'programs', programId, 'days', day.id, 'workouts', otherWorkout.id), {
        order_index: currentWorkout.order_index
      })
    } catch (error) {
      console.error("Error reordering workouts:", error)
      toast.error("Failed to reorder workouts")
    }
  }

  const deleteDay = async () => {
    if (workouts.length > 0) {
      toast.error("Cannot delete a day that contains workouts. Please remove all workouts first.")
      return
    }

    try {
      await deleteDoc(doc(db, 'programs', programId, 'days', day.id))
      toast.success("Day deleted successfully")
    } catch (error) {
      console.error(error)
      toast.error("Failed to delete day")
    }
  }

  return (
    <Card className="group overflow-hidden border-zinc-200 dark:border-zinc-800 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between py-4 bg-zinc-50/50 dark:bg-zinc-900/50 border-b">
        <CardTitle className="text-xl font-semibold text-foreground">{day.title}</CardTitle>
        <div className="flex items-center gap-2">
          <CreateWorkoutDialog programId={programId} dayId={day.id} nextOrderIndex={workouts.length} />
          
          <ConfirmDeleteDialog
            title="Delete Training Day"
            description={`Are you sure you want to delete "${day.title}"?`}
            onConfirm={deleteDay}
            trigger={
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="size-4" />
                <span className="sr-only">Delete {day.title}</span>
              </Button>
            }
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3 bg-white dark:bg-black">
        {workouts.length === 0 ? (
          <p className="text-sm text-center text-muted-foreground py-4">No workouts added yet.</p>
        ) : (
          workouts.map((workout, index) => (
            <WorkoutCard 
              key={workout.id} 
              workout={workout} 
              programId={programId} 
              dayId={day.id}
              isFirst={index === 0}
              isLast={index === workouts.length - 1}
              onMove={(direction) => moveWorkout(index, direction)}
            />
          ))
        )}
      </CardContent>
    </Card>
  )
}

export default function ProgramDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const { id } = use(params as any) as { id: string }
  const [program, setProgram] = useState<Program | null>(null)
  const [days, setDays] = useState<Day[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProgram = async () => {
      const docSnap = await getDoc(doc(db, 'programs', id))
      if (docSnap.exists()) {
        setProgram({ id: docSnap.id, ...docSnap.data() } as Program)
      }
    }
    fetchProgram()

    const q = query(collection(db, 'programs', id, 'days'), orderBy('day_number'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const daysData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Day[]
      setDays(daysData)
      setLoading(false)
    }, (error) => {
      console.error("Error listening to days:", error)
      toast.error("Error loading program details")
      setLoading(false)
    })

    return () => unsubscribe()
  }, [id])

  const addDay = async () => {
    const nextNumber = days.length + 1
    try {
      await addDoc(collection(db, 'programs', id, 'days'), {
        title: `Day ${nextNumber}`,
        day_number: nextNumber
      })
      toast.success("New day added")
    } catch (error) {
      toast.error("Failed to add day")
    }
  }

  if (loading) return <div className="p-8 text-foreground font-mono text-xs uppercase tracking-widest animate-pulse">Synchronizing Data...</div>
  if (!program) return <div className="p-8 text-foreground font-bold">Program not found.</div>

  return (
    <div className="container mx-auto py-10 px-4 min-h-screen">
      <div className="mb-8">
        <Link href="/programs" className="flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors font-bold uppercase tracking-widest text-[10px]">
          <ArrowLeft className="mr-2 size-4" />
          Back to Programs
        </Link>
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-black text-foreground uppercase tracking-tight">{program.name}</h1>
          <Button onClick={addDay} className="gap-2 rounded-full bg-[#0057FF] hover:bg-[#0057FF]/90 font-bold uppercase tracking-widest text-[10px]">
            <Plus className="size-4" />
            Add Day
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {days.map((day) => (
          <DaySection key={day.id} day={day} programId={id} />
        ))}
      </div>
    </div>
  )
}