'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, onSnapshot, doc, updateDoc } from 'firebase/firestore'
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
import { MoreVertical, Archive, ArchiveRestore } from 'lucide-react'

interface Program {
  id: string
  name: string
  description: string
  isArchived: boolean
}

function ProgramCard({ program }: { program: Program }) {
  const toggleArchive = async () => {
    try {
      await updateDoc(doc(db, 'programs', program.id), {
        isArchived: !program.isArchived
      })
    } catch (error) {
      console.error('Error updating program: ', error)
    }
  }

  return (
    <Card className="relative">
      <div className="absolute top-4 right-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={toggleArchive}>
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
      <CardHeader>
        <CardTitle>{program.name}</CardTitle>
        <CardDescription>{program.description}</CardDescription>
      </CardHeader>
    </Card>
  )
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'programs'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const programsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Program[]
      setPrograms(programsData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const activePrograms = programs.filter(p => !p.isArchived)
  const archivedPrograms = programs.filter(p => p.isArchived)

  if (loading) return <div>Loading...</div>

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-foreground">Programs</h1>
        <CreateProgramDialog />
      </div>
      
      <Tabs defaultValue="operational" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mb-8">
          <TabsTrigger value="operational">Operational</TabsTrigger>
          <TabsTrigger value="vault">Archived Vault</TabsTrigger>
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

