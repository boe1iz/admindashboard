'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { auth, db } from '@/lib/firebase'
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Lock, Mail, Eye, EyeOff, User, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false)
  const [isForgot, setIsForgot] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { user, isAdmin, isClient, loading: authLoading, refreshAuth } = useAuth()

  // Navigate to dashboard as soon as auth fully resolves.
  useEffect(() => {
    if (!authLoading && user && (isAdmin || isClient)) {
      router.replace('/')
    }
  }, [authLoading, user, isAdmin, isClient, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (isForgot) {
        await sendPasswordResetEmail(auth, email)
        toast.success("Reset link dispatched to your inbox")
        setIsForgot(false)
        setLoading(false)
        return
      }

      document.cookie = "tab_auth_granted=1; path=/; SameSite=Lax"

      if (isRegister) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(userCredential.user, { displayName: name })
        toast.success("Account initialized successfully")
      } else {
        await signInWithEmailAndPassword(auth, email, password)
        toast.success("Welcome back")
      }
      
      await refreshAuth()
      
    } catch (err: any) {
      document.cookie = "tab_auth_granted=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      console.error(err)
      let message = "Authentication failed. Please try again."
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        message = "Invalid email or password."
      } else if (err.code === 'auth/email-already-in-use') {
        message = "This email is already registered."
      } else if (err.code === 'auth/weak-password') {
        message = "Password should be at least 6 characters."
      }
      setError(message)
      toast.error(message)
      setLoading(false)
    }
  }

  const toggleMode = (mode: 'login' | 'register' | 'forgot') => {
    setError(null)
    if (mode === 'login') {
      setIsRegister(false)
      setIsForgot(false)
    } else if (mode === 'register') {
      setIsRegister(true)
      setIsForgot(false)
    } else {
      setIsForgot(true)
      setIsRegister(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-start justify-center bg-background p-4 pt-8 sm:pt-4 sm:items-center relative overflow-hidden">
      {/* Abstract Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]" />
      </div>

      <Card className="w-full max-w-[450px] border-slate-200 dark:border-slate-800 shadow-2xl rounded-[40px] bg-card/80 backdrop-blur-xl z-10 relative overflow-hidden">
        <CardHeader className="pt-10 pb-6 text-center">
          <div className="mx-auto size-16 rounded-3xl bg-primary/10 flex items-center justify-center mb-6">
            <BookOpen className="size-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-black text-foreground uppercase tracking-tight">
            ON3 ATHLETICS
          </CardTitle>
          <CardDescription className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mt-2">
            {isForgot ? "Reset Access" : isRegister ? "Join the Elite" : "Coach Command Center"}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {isForgot && (
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center px-4 leading-relaxed">
                  Enter your email address and we'll send you a link to reset your secure credentials.
                </p>
              )}
              
              {isRegister && (
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input
                      id="name"
                      placeholder="Athlete Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="h-14 pl-12 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus-visible:ring-primary"
                    />
                  </div>
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                  {isRegister || isForgot ? "Email Address" : "Administrator Email"}
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
              {!isForgot && (
                <div className="grid gap-2">
                  <div className="flex items-center justify-between ml-1">
                    <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      {isRegister ? "Create Password" : "Secure Password"}
                    </Label>
                    {!isRegister && (
                      <button
                        type="button"
                        onClick={() => toggleMode('forgot')}
                        className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
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
              )}
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
                  {isForgot ? "Dispatching..." : "Authenticating..."}
                </div>
              ) : (
                isForgot ? "Send Reset Link" : isRegister ? "Initialize Account" : "Deploy Dashboard"
              )}
            </Button>

            <div className="flex flex-col gap-4">
              <button
                type="button"
                onClick={() => toggleMode(isRegister ? 'login' : 'register')}
                className="w-full text-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
              >
                {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
              </button>
              
              {isForgot && (
                <button
                  type="button"
                  onClick={() => toggleMode('login')}
                  className="flex items-center justify-center gap-2 w-full text-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="size-3" />
                  Back to Login
                </button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
