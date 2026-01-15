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
        const progSnap = await getDocs(query(collection(db, 'programs'), limit(2)))
        for (const progDoc of progSnap.docs) {
          const progData = progDoc.data()
          const dayResults: any = { 
            programId: progDoc.id, 
            name: progData.name,
            subCollections: [] 
          }

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

  if (loading) return <div className="p-10 font-black uppercase tracking-widest text-xs animate-pulse">Diagnosing database structure...</div>

  return (
    <div className="p-10 font-mono text-[10px]">
      <h1 className="text-2xl font-black mb-8 uppercase tracking-tight text-slate-900">Database Diagnosis</h1>
      {results.map((res, i) => (
        <div key={i} className="mb-8 border border-slate-200 p-6 rounded-[20px] bg-white shadow-sm">
          <p className="font-black text-slate-900 uppercase tracking-widest mb-4 border-b border-slate-50 pb-2">{res.name} ({res.programId || 'Collection'})</p>
          {res.samples ? (
             <pre className="mt-2 text-slate-500 overflow-x-auto">{JSON.stringify(res.samples, null, 2)}</pre>
          ) : (
            res.subCollections.length === 0 ? (
              <p className="text-red-500 mt-2 font-bold">No sub-collections found.</p>
            ) : (
              res.subCollections.map((sub: any, j: number) => (
                <div key={j} className="mt-4 ml-4">
                  <p className="text-primary font-black uppercase underline">Sub-collection: {sub.name} ({sub.count} docs)</p>
                  <pre className="mt-2 text-slate-500 overflow-x-auto">{JSON.stringify(sub.sample, null, 2)}</pre>
                  {sub.nested.map((nes: any, k: number) => (
                    <div key={k} className="mt-4 ml-8 border-l-2 border-slate-100 pl-4">
                      <p className="text-blue-400 font-black uppercase underline">Nested Sub-collection: {nes.name} ({nes.count} docs)</p>
                      <pre className="mt-2 text-slate-400 overflow-x-auto">{JSON.stringify(nes.sample, null, 2)}</pre>
                    </div>
                  ))}
                </div>
              ))
            )
          )}
        </div>
      ))}
      {results.length === 0 && <p className="font-black uppercase text-slate-400">No programs found.</p>}
    </div>
  )
}