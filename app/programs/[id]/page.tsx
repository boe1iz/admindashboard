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
  getDocs
} from 'firebase/firestore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2, ArrowLeft, Video, ChevronUp, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { use } from 'react'
import { CreateWorkoutDialog } from '@/components/CreateWorkoutDialog'

interface Workout {
  id: string
  name: string
  description: string
  videoUrl?: string
  orderIndex: number
}

interface Day {
  id: string
  name: string
  orderIndex: number
  workouts?: Workout[]
}

// ... existing interfaces ...

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
  const deleteWorkout = async () => {
    if (confirm("Delete this workout?")) {
      await deleteDoc(doc(db, 'programs', programId, 'days', dayId, 'workouts', workout.id))
    }
  }

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border bg-zinc-50/50 dark:bg-zinc-900/50 group/workout">
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
        {workout.videoUrl && <Video className="size-4 text-primary" />}
        <div>
          <h4 className="font-medium text-sm">{workout.name}</h4>
          <p className="text-xs text-muted-foreground line-clamp-1">{workout.description}</p>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        className="size-8 text-muted-foreground hover:text-destructive opacity-0 group-hover/workout:opacity-100 transition-opacity"
        onClick={deleteWorkout}
      >
        <Trash2 className="size-3" />
      </Button>
    </div>
  )
}

function DaySection({ day, programId }: { day: Day, programId: string }) {
  const [workouts, setWorkouts] = useState<Workout[]>([])

  useEffect(() => {
    const q = query(collection(db, 'programs', programId, 'days', day.id, 'workouts'), orderBy('orderIndex'))
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
      // Swap orderIndex values
      await updateDoc(doc(db, 'programs', programId, 'days', day.id, 'workouts', currentWorkout.id), {
        orderIndex: otherWorkout.orderIndex
      })
      await updateDoc(doc(db, 'programs', programId, 'days', day.id, 'workouts', otherWorkout.id), {
        orderIndex: currentWorkout.orderIndex
      })
    } catch (error) {
      console.error("Error reordering workouts:", error)
    }
  }

  const deleteDay = async () => {
    if (workouts.length > 0) {
      alert("Cannot delete a day that contains workouts. Please remove all workouts first.")
      return
    }

    if (confirm("Are you sure you want to delete this day?")) {
      await deleteDoc(doc(db, 'programs', programId, 'days', day.id))
    }
  }

  return (
    <Card className="group overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between py-4 bg-zinc-50/50 dark:bg-zinc-900/50 border-b">
        <CardTitle className="text-xl font-semibold">{day.name}</CardTitle>
        <div className="flex items-center gap-2">
          <CreateWorkoutDialog programId={programId} dayId={day.id} nextOrderIndex={workouts.length} />
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={deleteDay}
          >
            <Trash2 className="size-4" />
            <span className="sr-only">Delete {day.name}</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
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

    const q = query(collection(db, 'programs', id, 'days'), orderBy('orderIndex'))
    console.log("Listening for days in path:", `programs/${id}/days`)
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log(`Found ${snapshot.docs.length} days for program ${id}`)
      const daysData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Day[]
      setDays(daysData)
      setLoading(false)
    }, (error) => {
      console.error("Error listening to days:", error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [id])

  const addDay = async () => {
    const nextIndex = days.length
    await addDoc(collection(db, 'programs', id, 'days'), {
      name: `Day ${nextIndex + 1}`,
      orderIndex: nextIndex
    })
  }

  if (loading) return <div className="p-8">Loading...</div>
  if (!program) return <div className="p-8">Program not found.</div>

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <Link href="/programs" className="flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="mr-2 size-4" />
          Back to Programs
        </Link>
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-foreground">{program.name}</h1>
          <Button onClick={addDay} className="gap-2">
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
