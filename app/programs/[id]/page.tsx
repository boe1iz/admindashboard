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
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { use } from 'react'

interface Day {
  id: string
  name: string
  orderIndex: number
}

interface Program {
  id: string
  name: string
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
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const daysData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Day[]
      setDays(daysData)
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

  const deleteDay = async (dayId: string) => {
    // Guard: Check if day has workouts
    const workoutsSnap = await getDocs(collection(db, 'programs', id, 'days', dayId, 'workouts'))
    if (workoutsSnap.size > 0) {
      alert("Cannot delete a day that contains workouts. Please remove all workouts first.")
      return
    }

    if (confirm("Are you sure you want to delete this day?")) {
      await deleteDoc(doc(db, 'programs', id, 'days', dayId))
    }
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
          <Card key={day.id} className="group overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <CardTitle className="text-xl font-semibold">{day.name}</CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => deleteDay(day.id)}
              >
                <Trash2 className="size-4" />
                <span className="sr-only">Delete {day.name}</span>
              </Button>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
