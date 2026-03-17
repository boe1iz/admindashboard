'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { auth, db } from '@/lib/firebase'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Lock, Mail, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { user, isAdmin, loading: authLoading, refreshAuth } = useAuth()

  // Navigate to dashboard as soon as auth fully resolves.
  // This is the reliable trigger point: AuthProvider has confirmed
  // the user is an admin and flipped loading → false.
  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      router.replace('/')
    }
  }, [authLoading, user, isAdmin, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      // Grant must be set BEFORE signInWithEmailAndPassword so that
      // onAuthStateChanged (which fires immediately on auth) finds it.
      // Use a session cookie (no expires) so it persists across tabs but clears on browser close.
      document.cookie = "tab_auth_granted=1; path=/; SameSite=Lax"

      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      
      // Ensure AuthProvider sees the updated sessionStorage immediately
      await refreshAuth()
      
      // Check if user is in admin_users collection
      const adminDoc = await getDoc(doc(db, 'admin_users', userCredential.user.uid))
      
      if (!adminDoc.exists()) {
        sessionStorage.removeItem('tab_auth_granted')
        await signOut(auth)
        throw new Error("Access Denied: You do not have administrator privileges.")
      }

      toast.success("Welcome back, Coach")
      // Navigation is handled by the useEffect above which fires once
      // AuthProvider confirms user + isAdmin. Calling router.replace here
      // races against AuthProvider state commits and causes loops.
    } catch (err: any) {
      sessionStorage.removeItem('tab_auth_granted')
      console.error(err)
      let message = "Failed to login. Please check your credentials."
      if (err.message === "Access Denied: You do not have administrator privileges.") {
        message = err.message
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        message = "Invalid email or password."
      }
      setError(message)
      toast.error(message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-start justify-center bg-background p-4 pt-8 sm:pt-4 sm:items-center relative overflow-hidden">
      {/* Abstract Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]" />
      </div>

      <Card className="w-full max-w-[450px] border-slate-200 dark:border-slate-800 shadow-2xl rounded-[40px] bg-card/80 backdrop-blur-xl z-10 relative">
        <CardHeader className="pt-10 pb-6 text-center">
          <div className="mx-auto size-16 rounded-3xl bg-primary/10 flex items-center justify-center mb-6">
            <BookOpen className="size-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-black text-foreground uppercase tracking-tight">
            ON3 ATHLETICS
          </CardTitle>
          <CardDescription className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mt-2">
            Coach Command Center
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                  Administrator Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="coach@on3athletics.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-14 pl-12 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus-visible:ring-primary"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                  Secure Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-14 pl-12 pr-12 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus-visible:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest text-center animate-in fade-in zoom-in-95">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </div>
              ) : (
                "Deploy Dashboard"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
