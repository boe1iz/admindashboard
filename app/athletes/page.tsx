'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, onSnapshot, doc, updateDoc } from 'firebase/firestore'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreVertical, Archive, ArchiveRestore, Settings2 } from 'lucide-react'
import { toast } from 'sonner'
import { CreateAthleteDialog } from '@/components/CreateAthleteDialog'
import { ManageProgramsDialog } from '@/components/ManageProgramsDialog'

interface Athlete {
  id: string
  name: string
  email: string
  isArchived: boolean
  assignedPrograms?: string[]
}

interface Program {
  id: string
  name: string
}

export function AthleteCard({ athlete, programs }: { athlete: Athlete, programs: Program[] }) {
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false)

  const toggleArchive = async () => {
    try {
      await updateDoc(doc(db, 'athletes', athlete.id), {
        isArchived: !athlete.isArchived
      })
      toast.success(athlete.isArchived ? "Athlete restored" : "Athlete archived")
    } catch (error) {
      console.error('Error updating athlete: ', error)
      toast.error("Failed to update athlete")
    }
  }

  return (
    <Card className="relative group hover:border-primary/50 transition-colors">
      <div className="absolute top-4 right-4 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsManageDialogOpen(true)}>
              <Settings2 className="mr-2 size-4" />
              Manage Programs
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toggleArchive()}>
              {athlete.isArchived ? (
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
      <CardHeader>
        <CardTitle>{athlete.name}</CardTitle>
        <CardDescription>{athlete.email}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {athlete.assignedPrograms?.map(programId => {
             const programName = programs.find(p => p.id === programId)?.name || programId
             return (
               <span key={programId} className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">
                 {programName}
               </span>
             )
          })}
        </div>
      </CardContent>
      <ManageProgramsDialog 
        athlete={athlete} 
        open={isManageDialogOpen} 
        onOpenChange={setIsManageDialogOpen} 
      />
    </Card>
  )
}

export default function AthletesPage() {
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const qAthletes = query(collection(db, 'athletes'))
    const qPrograms = query(collection(db, 'programs'))
    
    const unsubscribeAthletes = onSnapshot(qAthletes, (snapshot) => {
      const athletesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Athlete[]
      setAthletes(athletesData)
    })

    const unsubscribePrograms = onSnapshot(qPrograms, (snapshot) => {
      const programsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Program[]
      setPrograms(programsData)
      setLoading(false)
    })

    return () => {
      unsubscribeAthletes()
      unsubscribePrograms()
    }
  }, [])

  const activeAthletes = athletes.filter(a => !a.isArchived)
  const archivedAthletes = athletes.filter(a => a.isArchived)

  if (loading) return <div className="p-10">Loading Athletes...</div>

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-foreground uppercase tracking-tight">Athlete Roster</h1>
        <CreateAthleteDialog />
      </div>
      
      <Tabs defaultValue="operational" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mb-8">
          <TabsTrigger value="operational">Operational</TabsTrigger>
          <TabsTrigger value="vault">Archived Vault</TabsTrigger>
        </TabsList>
        
        <TabsContent value="operational" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeAthletes.map(athlete => (
              <AthleteCard key={athlete.id} athlete={athlete} programs={programs} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="vault" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {archivedAthletes.map(athlete => (
              <AthleteCard key={athlete.id} athlete={athlete} programs={programs} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}