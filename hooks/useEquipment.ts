import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore'

export type EquipmentOption = {
  label: string
  value: string
}

export function useEquipment() {
  const [equipment, setEquipment] = useState<EquipmentOption[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'equipment'), orderBy('name', 'asc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs
        .filter(doc => doc.data().is_active !== false) // Default to active if field missing
        .map(doc => ({
          label: doc.data().name as string,
          value: doc.id
        }))
      setEquipment(items)
      setLoading(false)
    }, (error) => {
      console.error("Error fetching equipment:", error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return { equipment, loading }
}
