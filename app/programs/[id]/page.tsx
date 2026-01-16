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
  getDocs,
  orderBy,
  updateDoc
} from 'firebase/firestore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2, ArrowLeft, Video, ChevronUp, ChevronDown, Pencil, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { use } from 'react'
import { CreateWorkoutDialog } from '@/components/CreateWorkoutDialog'
import { VideoModal } from '@/components/VideoModal'
import { EditWorkoutDialog } from '@/components/EditWorkoutDialog'
import { ConfirmDeleteDialog } from '@/components/ConfirmDeleteDialog'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { useEquipment } from '@/hooks/useEquipment'
import { cn } from '@/lib/utils'

interface Workout {
  id: string
  title: string
  instructions: string
  video_url?: string
  order_index: number
  equipment_ids?: string[]
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

export function WorkoutCard({ 
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
  const { equipment } = useEquipment()

  const deleteWorkout = async () => {
    try {
      await deleteDoc(doc(db, 'programs', programId, 'days', dayId, 'workouts', workout.id))
      toast.success("Workout deleted successfully")
    } catch (error) {
      console.error(error)
      toast.error("Failed to delete workout")
    }
  }

  const assignedEquipment = workout.equipment_ids?.map(id => 
    equipment.find(e => e.value === id)?.label
  ).filter(Boolean) || []

  return (
    <>
      <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 group/workout hover:border-primary/30 hover:bg-white hover:shadow-md transition-all">
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-0.5 opacity-0 group-hover/workout:opacity-100 transition-opacity">
            <Button 
              variant="ghost" 
              size="icon" 
              className="size-6 p-0 disabled:opacity-30 hover:text-primary" 
              onClick={() => onMove('up')}
              disabled={isFirst}
            >
              <ChevronUp className="size-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="size-6 p-0 disabled:opacity-30 hover:text-primary" 
              onClick={() => onMove('down')}
              disabled={isLast}
            >
              <ChevronDown className="size-4" />
            </Button>
          </div>
          {workout.video_url ? (
            <VideoModal videoUrl={workout.video_url} title={workout.title} />
          ) : (
            <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-300">
              <Video className="size-5" />
            </div>
          )}
          <div>
            <h4 className="font-black text-slate-900 uppercase tracking-tight text-sm">{workout.title}</h4>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs font-medium text-slate-400 line-clamp-1">{workout.instructions}</p>
              {assignedEquipment.length > 0 && (
                <div className="flex gap-1">
                  {assignedEquipment.map((name, i) => (
                    <span key={i} className="text-[8px] font-black uppercase tracking-widest bg-slate-200/50 text-slate-500 px-1.5 py-0.5 rounded-sm">
                      {name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover/workout:opacity-100 transition-opacity">
          <Button 
            variant="ghost" 
            size="icon" 
            className="size-9 rounded-full text-slate-400 hover:text-primary hover:bg-primary/5"
            onClick={() => setIsEditDialogOpen(true)}
          >
            <Pencil className="size-4" />
          </Button>
          
          <ConfirmDeleteDialog
            title="Delete Workout"
            description={`Are you sure you want to delete "${workout.title}"? This action cannot be undone.`}
            onConfirm={deleteWorkout}
            trigger={
              <Button 
                variant="ghost" 
                size="icon" 
                className="size-9 rounded-full text-slate-400 hover:text-destructive hover:bg-destructive/5"
              >
                <Trash2 className="size-4" />
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

function DaySection({ 
  day, 
  programId, 
  globalTrigger 
}: { 
  day: Day, 
  programId: string,
  globalTrigger?: 'expand' | 'collapse' | null
}) {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [isExpanded, setIsExpanded] = useState(false)

  // Listen to global triggers
  useEffect(() => {
    if (globalTrigger === 'expand') setIsExpanded(true)
    if (globalTrigger === 'collapse') setIsExpanded(false)
  }, [globalTrigger])

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
    try {
      // Fresh query to verify no workouts exist before deletion
      const workoutsRef = collection(db, 'programs', programId, 'days', day.id, 'workouts')
      const workoutSnapshot = await getDocs(workoutsRef)
      
      if (!workoutSnapshot.empty || workouts.length > 0) {
        toast.error("Cannot delete a day that contains workouts. Please remove all workouts first.")
        return
      }

      await deleteDoc(doc(db, 'programs', programId, 'days', day.id))
      toast.success("Day deleted successfully")
    } catch (error) {
      console.error(error)
      toast.error("Failed to delete day")
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="group overflow-hidden border-slate-200 shadow-md rounded-[40px]">
        <CardHeader className="flex flex-row items-center justify-between p-6 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-slate-200 transition-transform duration-200"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label={isExpanded ? "Collapse day" : "Expand day"}
            >
              <ChevronDown className={cn("size-5 text-slate-500 transition-transform duration-200", !isExpanded && "-rotate-90")} />
            </Button>
            <div>
              <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tight">{day.title}</CardTitle>
              {!isExpanded && (
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-0.5">
                  {workouts.length} {workouts.length === 1 ? 'Workout' : 'Workouts'}
                </p>
              )}
            </div>
          </div>
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
                  disabled={workouts.length > 0}
                  className="rounded-full text-slate-400 hover:text-destructive hover:bg-destructive/5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="size-4" />
                  <span className="sr-only">Delete {day.title}</span>
                </Button>
              }
            />
          </div>
        </CardHeader>
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <CardContent className="p-6 space-y-4 bg-white border-t border-slate-50">
                {workouts.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <div className="size-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                      <Plus className="size-6 text-slate-200" />
                    </div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No workouts added yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {workouts.map((workout, index) => (
                      <WorkoutCard 
                        key={workout.id} 
                        workout={workout} 
                        programId={programId} 
                        dayId={day.id}
                        isFirst={index === 0}
                        isLast={index === workouts.length - 1}
                        onMove={(direction) => moveWorkout(index, direction)}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}

export default function ProgramDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const { id } = use(params as any) as { id: string }
  const [program, setProgram] = useState<Program | null>(null)
  const [days, setDays] = useState<Day[]>([])
  const [loading, setLoading] = useState(true)
  const [globalTrigger, setGlobalTrigger] = useState<'expand' | 'collapse' | null>(null)

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

  const handleGlobalToggle = (type: 'expand' | 'collapse') => {
    setGlobalTrigger(type)
    // Reset trigger after a tick to allow re-triggering same action
    setTimeout(() => setGlobalTrigger(null), 100)
  }

  if (loading) return <div className="p-8 text-slate-500 font-black text-xs uppercase tracking-[0.2em] animate-pulse">Synchronizing Data...</div>
  if (!program) return <div className="p-8 text-slate-900 font-black uppercase">Program not found.</div>

  return (
    <div className="container mx-auto py-10 px-4 min-h-screen">
      <div className="mb-10">
        <Link href="/programs" className="flex items-center text-slate-400 hover:text-primary mb-6 transition-colors font-black uppercase tracking-widest text-[10px]">
          <ArrowLeft className="mr-2 size-4" />
          Back to Concepts
        </Link>
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-4">
              <BookOpen className="size-10 text-[#0057FF]" />
              {program.name}
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mt-2 flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              Operational Sequence
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex bg-slate-100 p-1 rounded-full border border-slate-200 shadow-inner overflow-hidden">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleGlobalToggle('expand')}
                className="rounded-full px-3 md:px-4 font-black uppercase text-[9px] md:text-[10px] tracking-widest hover:bg-white hover:shadow-sm transition-all"
              >
                Expand All
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleGlobalToggle('collapse')}
                className="rounded-full px-3 md:px-4 font-black uppercase text-[9px] md:text-[10px] tracking-widest hover:bg-white hover:shadow-sm transition-all"
              >
                Collapse All
              </Button>
            </div>
            <Button onClick={addDay} className="gap-2 rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 px-6 md:px-8 h-10 md:h-12 font-black uppercase tracking-widest text-[10px] md:text-xs">
              <Plus className="size-4 md:size-5" />
              Add Day
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {days.map((day) => (
          <DaySection key={day.id} day={day} programId={id} globalTrigger={globalTrigger} />
        ))}
      </div>
    </div>
  )
}
