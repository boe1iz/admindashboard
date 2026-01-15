'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, onSnapshot, doc, updateDoc, addDoc, serverTimestamp, getDocs } from 'firebase/firestore'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CreateProgramDialog } from '@/components/CreateProgramDialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreVertical, Archive, ArchiveRestore, Copy, Pencil } from 'lucide-react'
import Link from 'next/link'
import { EditProgramDialog } from '@/components/EditProgramDialog'
import { toast } from 'sonner'

interface Program {
// ... existing interface ...
}

function ProgramCard({ program }: { program: Program }) {
  const [duplicating, setDuplicating] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const toggleArchive = async () => {
    try {
      await updateDoc(doc(db, 'programs', program.id), {
        isArchived: !program.isArchived
      })
      toast.success(program.isArchived ? "Program restored" : "Program archived")
    } catch (error) {
      console.error('Error updating program: ', error)
      toast.error("Failed to update program")
    }
  }

  const duplicateProgram = async () => {
    setDuplicating(true)
    const toastId = toast.loading("Duplicating program...")
    try {
      // 1. Copy Program Doc
      const newProgramRef = await addDoc(collection(db, 'programs'), {
        name: `${program.name} (Copy)`,
        description: program.description,
        price: program.price || 0,
        isArchived: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })

      // 2. Copy Days
      const daysSnap = await getDocs(collection(db, 'programs', program.id, 'days'))
      for (const dayDoc of daysSnap.docs) {
        const dayData = dayDoc.data()
        const newDayRef = await addDoc(collection(db, 'programs', newProgramRef.id, 'days'), {
          title: dayData.title,
          day_number: dayData.day_number
        })

        // 3. Copy Workouts for each day
        const workoutsSnap = await getDocs(collection(db, 'programs', program.id, 'days', dayDoc.id, 'workouts'))
        for (const workoutDoc of workoutsSnap.docs) {
          const workoutData = workoutDoc.data()
          await addDoc(collection(db, 'programs', newProgramRef.id, 'days', newDayRef.id, 'workouts'), {
            title: workoutData.title,
            instructions: workoutData.instructions,
            video_url: workoutData.video_url || '',
            order_index: workoutData.order_index,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          })
        }
      }
      toast.success("Program duplicated successfully", { id: toastId })
    } catch (error) {
      console.error("Error duplicating program:", error)
      toast.error("Failed to duplicate program", { id: toastId })
    } finally {
      setDuplicating(false)
    }
  }

  return (
    <>
      <Card className={`relative group cursor-pointer hover:border-primary/50 transition-colors ${duplicating ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="absolute top-4 right-4 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setIsEditDialogOpen(true); }}>
                <Pencil className="mr-2 size-4" />
                Edit Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); duplicateProgram(); }}>
                <Copy className="mr-2 size-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toggleArchive(); }}>
                {program.isArchived ? (
                  <>
                    <ArchiveRestore className="mr-2 size-4" />
                    Restore
                  </>
                ) : (
                  <>
                    <Archive className="mr-2 size-4" />
                    Archive
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Link href={`/programs/${program.id}`}>
          <CardHeader>
            <CardTitle>{program.name}</CardTitle>
            <CardDescription className="line-clamp-2">{program.description}</CardDescription>
          </CardHeader>
        </Link>
      </Card>

      <EditProgramDialog 
        program={program} 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen} 
      />
    </>
  )
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'programs'))
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const programsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Program[]
        setPrograms(programsData)
        setLoading(false)
      },
      (error) => {
        console.error("Firestore onSnapshot error:", error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const activePrograms = programs.filter(p => !p.isArchived)
  const archivedPrograms = programs.filter(p => p.isArchived)

  if (loading) return <div className="p-10">Loading Programs...</div>

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-foreground uppercase tracking-tight">Programs</h1>
        <CreateProgramDialog />
      </div>
      
      <Tabs defaultValue="operational" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mb-8">
          <TabsTrigger value="operational">Operational ({activePrograms.length})</TabsTrigger>
          <TabsTrigger value="vault">Archived Vault ({archivedPrograms.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="operational" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activePrograms.map(program => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="vault" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {archivedPrograms.map(program => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}