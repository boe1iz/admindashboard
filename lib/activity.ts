import { db } from './firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export type ActivityType = 'assignment' | 'unassigned' | 'archive' | 'restore' | 'onboarded'

export interface ActivityLog {
  type: ActivityType
  client_name: string
  program_name?: string
  timestamp: any
}

export async function logActivity(activity: Omit<ActivityLog, 'timestamp'>) {
  try {
    await addDoc(collection(db, 'activity'), {
      ...activity,
      timestamp: serverTimestamp()
    })
  } catch (error) {
    console.error("Failed to log activity:", error)
  }
}
