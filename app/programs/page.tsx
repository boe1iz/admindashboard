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
import { MoreVertical, Archive, ArchiveRestore, Copy, Pencil, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { EditProgramDialog } from '@/components/EditProgramDialog'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

interface Program {
  id: string
  name: string
  description: string
  price: number
  isArchived: boolean
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
      const newProgramRef = await addDoc(collection(db, 'programs'), {
        name: `${program.name} (Copy)`,
        description: program.description,
        price: program.price || 0,
        isArchived: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })

      const daysSnap = await getDocs(collection(db, 'programs', program.id, 'days'))
      for (const dayDoc of daysSnap.docs) {
        const dayData = dayDoc.data()
        const newDayRef = await addDoc(collection(db, 'programs', newProgramRef.id, 'days'), {
          title: dayData.title,
          day_number: dayData.day_number
        })

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
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02, y: -4 }}
      >
        <Card className={`relative group cursor-pointer border-slate-200 dark:border-slate-800 bg-card shadow-md hover:shadow-xl hover:border-primary/30 transition-all rounded-[40px] overflow-hidden ${duplicating ? 'opacity-50 pointer-events-none scale-[0.98]' : ''} ${program.isArchived ? 'opacity-60 grayscale' : ''}`}>
          <div className="absolute top-4 right-4 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                  <MoreVertical className="size-4 dark:text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl border-slate-200 dark:border-slate-800 bg-card shadow-xl">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setIsEditDialogOpen(true); }} className="rounded-xl m-1 dark:hover:bg-slate-800">
                  <Pencil className="mr-2 size-4" />
                  Edit Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); duplicateProgram(); }} className="rounded-xl m-1 dark:hover:bg-slate-800">
                  <Copy className="mr-2 size-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toggleArchive(); }} className="rounded-xl m-1 dark:hover:bg-slate-800">
                  {program.isArchived ? (
                    <>
                      <ArchiveRestore className="mr-2 size-4 text-primary" />
                      <span className="text-primary font-bold">Restore</span>
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
            <CardHeader className="p-6">
              <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <BookOpen className="size-6 text-primary dark:text-blue-400" />
              </div>
              <CardTitle className="font-black text-foreground uppercase tracking-tight">{program.name}</CardTitle>
              <CardDescription className="line-clamp-2 text-xs font-bold text-slate-400 dark:text-slate-500">{program.description}</CardDescription>
            </CardHeader>
          </Link>
        </Card>
      </motion.div>

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

  if (loading) return <div className="p-8 text-slate-500 font-black uppercase tracking-widest text-xs animate-pulse">Synchronizing Concepts...</div>

  return (
    <div className="container mx-auto py-10 px-4 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-black text-foreground uppercase tracking-tight flex items-center gap-3">
            <BookOpen className="size-8 text-[#0057FF] dark:text-[#3B82F6]" />
            Programs
          </h1>
          <p className="text-xs md:text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
            Build and manage high-performance training sequences.
          </p>
        </div>
        <CreateProgramDialog />
      </div>
      
      <Tabs defaultValue="operational" className="w-full">
        <TabsList className="bg-card border border-slate-200 dark:border-slate-800 p-1 rounded-full w-fit shadow-sm mb-8">
          <TabsTrigger value="operational" className="rounded-full px-4 md:px-6 data-[state=active]:bg-[#0057FF] data-[state=active]:text-white text-xs md:text-sm font-black uppercase tracking-tight dark:text-slate-400">Operational ({activePrograms.length})</TabsTrigger>
          <TabsTrigger value="vault" className="rounded-full px-4 md:px-6 data-[state=active]:bg-[#0057FF] data-[state=active]:text-white text-xs md:text-sm font-black uppercase tracking-tight dark:text-slate-400">Archived Vault ({archivedPrograms.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="operational" className="space-y-4 outline-none">
          {activePrograms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activePrograms.map(program => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          ) : (
            <Card className="p-12 border-slate-200 dark:border-slate-800 bg-card flex flex-col items-center justify-center text-center rounded-[40px] shadow-md">
              <div className="size-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="size-10 text-slate-200 dark:text-slate-700" />
              </div>
              <CardTitle className="text-foreground font-black uppercase tracking-tight mb-2">No Programs Found</CardTitle>
              <CardDescription className="font-medium text-slate-500 dark:text-slate-400">Create your first concept to begin building.</CardDescription>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="vault" className="space-y-4 outline-none">
          {archivedPrograms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {archivedPrograms.map(program => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          ) : (
            <Card className="p-12 border-slate-200 dark:border-slate-800 bg-card flex flex-col items-center justify-center text-center rounded-[40px] shadow-md">
              <div className="size-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <Archive className="size-10 text-slate-200 dark:text-slate-700" />
              </div>
              <CardTitle className="text-foreground font-black uppercase tracking-tight mb-2">Vault is Empty</CardTitle>
              <CardDescription className="font-medium text-slate-500 dark:text-slate-400">Archived programs will appear here.</CardDescription>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
