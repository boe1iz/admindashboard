'use client'

import { useState } from 'react'
import { auth } from '@/lib/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Lock, Mail } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast.success("Welcome back, Coach")
      router.push('/')
    } catch (err: any) {
      console.error(err)
      const message = err.message || "Failed to login. Please check your credentials."
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 relative overflow-hidden">
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
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-14 pl-12 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus-visible:ring-primary"
                  />
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
