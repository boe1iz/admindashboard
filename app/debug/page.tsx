'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, limit, query } from 'firebase/firestore'

export default function DebugPage() {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function diagnose() {
      const report: any[] = []
      try {
        // 1. Check top-level programs
        const progSnap = await getDocs(query(collection(db, 'programs'), limit(2)))
        for (const progDoc of progSnap.docs) {
          const progData = progDoc.data()
          const dayResults: any = { 
            programId: progDoc.id, 
            name: progData.name,
            subCollections: [] 
          }

          // Try common sub-collection names
          const possibleSubs = ['days', 'Days']
          for (const sub of possibleSubs) {
            const subSnap = await getDocs(collection(db, 'programs', progDoc.id, sub))
            if (!subSnap.empty) {
              const dayDoc = subSnap.docs[0]
              const dayData = dayDoc.data()
              
              const dayInfo: any = {
                name: sub,
                count: subSnap.size,
                sample: dayData,
                nested: []
              }

              // Check for workouts inside this day
              const workoutSubs = ['workouts', 'Workouts', 'exercises']
              for (const wSub of workoutSubs) {
                const wSnap = await getDocs(collection(db, 'programs', progDoc.id, sub, dayDoc.id, wSub))
                if (!wSnap.empty) {
                  dayInfo.nested.push({
                    name: wSub,
                    count: wSnap.size,
                    sample: wSnap.docs[0].data()
                  })
                }
              }
              dayResults.subCollections.push(dayInfo)
            }
          }
          report.push(dayResults)
        }

        // 2. Check assignments
        const assSnap = await getDocs(query(collection(db, 'assignments'), limit(5)))
        const assResults: any = { 
          name: 'Recent Assignments',
          count: assSnap.size,
          samples: assSnap.docs.map(d => ({ 
            _id: d.id, 
            ...d.data(),
            _types: Object.entries(d.data()).reduce((acc, [k, v]) => ({ ...acc, [k]: typeof v }), {})
          }))
        }
        report.push(assResults)

        setResults(report)
      } catch (e: any) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    diagnose()
  }, [])

  if (loading) return <div className="p-10">Diagnosing database structure...</div>

  return (
    <div className="p-10 font-mono text-xs">
      <h1 className="text-xl font-bold mb-4">Database Diagnosis</h1>
      {results.map((res, i) => (
        <div key={i} className="mb-8 border p-4 rounded bg-zinc-900 text-green-400">
          <p className="font-bold text-white">{res.name} ({res.programId || 'Collection'})</p>
          {res.samples ? (
             <pre className="mt-2 text-zinc-400">{JSON.stringify(res.samples, null, 2)}</pre>
          ) : (
            res.subCollections.length === 0 ? (
              <p className="text-red-400 mt-2">No sub-collections found.</p>
            ) : (
              res.subCollections.map((sub: any, j: number) => (
                <div key={j} className="mt-4 ml-4">
                  <p className="text-yellow-400 underline">Sub-collection: {sub.name} ({sub.count} docs)</p>
                  <pre className="mt-2 text-zinc-400">{JSON.stringify(sub.sample, null, 2)}</pre>
                  {sub.nested.map((nes: any, k: number) => (
                    <div key={k} className="mt-4 ml-8 border-l border-zinc-700 pl-4">
                      <p className="text-blue-400 underline">Nested Sub-collection: {nes.name} ({nes.count} docs)</p>
                      <pre className="mt-2 text-zinc-500">{JSON.stringify(nes.sample, null, 2)}</pre>
                    </div>
                  ))}
                </div>
              ))
            )
          )}
        </div>
      ))}
      {results.length === 0 && <p>No programs found.</p>}
    </div>
  )
}
