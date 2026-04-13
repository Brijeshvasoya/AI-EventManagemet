'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useMutation } from '@apollo/client/react'
import { SIGNUP_MUTATION } from '../../graphql/client'
import { Eye, EyeOff, Mail, Lock, User, Rocket, ArrowRight, CheckCircle2, Star, Sparkles } from 'lucide-react'

const perks = [
  'AI-generated event plans in seconds',
  'Automated guest lists & RSVP tracking',
  'Real-time vendor & budget coordination',
  'Beautiful reports & analytics',
]

const avatarColors = ['#8b5cf6', '#06b6d4', '#ec4899', '#f59e0b', '#22c55e']

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPw, setShowPw] = useState(false)
  const [showCp, setShowCp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [focused, setFocused] = useState('')
  const router = useRouter()
  const [signup] = useMutation(SIGNUP_MUTATION)

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('')
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      const { data } = await signup({ variables: { name: form.name, email: form.email, password: form.password } })
      const u = data.signup
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('currentUser', JSON.stringify({ id: u.id, name: u.name, email: u.email }))
      router.push('/chat')
    } catch { setError('Registration failed. This email may already be in use.') }
    finally { setLoading(false) }
  }

  const inputClass = "input-field w-full py-3.5 text-sm"

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ zIndex: 1 }}>

      {/* ── Orbs ─────────────────────────── */}
      <div className="orb" style={{ width: 550, height: 550, top: '-15%', right: '-15%', background: 'radial-gradient(circle, rgba(79,70,229,0.5) 0%, transparent 70%)' }} />
      <div className="orb" style={{ width: 400, height: 400, bottom: '-10%', left: '-10%', background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)', animationDelay: '-5s' }} />
      <div className="orb" style={{ width: 200, height: 200, top: '60%', left: '55%', background: 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)', animationDelay: '-9s' }} />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-8 py-8 flex items-center gap-12 lg:gap-20">

        {/* ══ LEFT PANEL ═══════════════════════════ */}
        <div className="hidden lg:flex flex-col flex-1 gap-7">

          {/* Brand */}
          <div className="animate-fade-up delay-0 flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-2xl gradient-primary glow-violet flex items-center justify-center animate-float">
              <Sparkles className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <div>
              <p className="text-xl font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>Event <span className="gradient-text">AI</span></p>
              <p className="text-xs text-gray-500 -mt-0.5">Management Platform</p>
            </div>
          </div>

          {/* Headline */}
          <div className="animate-fade-up delay-1">
            <div className="badge mb-4"><Sparkles className="w-3 h-3" /> Free forever plan available</div>
            <h1 className="text-5xl xl:text-6xl font-black leading-[1.08] tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
              <span className="text-white">Start planning</span><br />
              <span className="gradient-text-warm">amazing</span>
              <span className="text-white"> events</span>
            </h1>
            <p className="mt-4 text-gray-400 text-lg leading-relaxed max-w-sm">
              Join 10,000+ event planners who use AI to create unforgettable experiences, faster than ever.
            </p>
          </div>

          {/* Perks */}
          <div className="flex flex-col gap-2.5">
            {perks.map((p, i) => (
              <div key={p} className={`flex items-center gap-3 animate-slide-left delay-${i + 2}`}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)' }}>
                  <CheckCircle2 className="w-3 h-3 text-violet-400" />
                </div>
                <span className="text-gray-300 text-sm">{p}</span>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="animate-fade-up delay-5">
            <div className="feature-card p-5">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed italic">
                &ldquo;Event AI cut our planning time by 70%. The AI suggestions for venue and timeline were incredibly accurate. Highly recommended!&rdquo;
              </p>
              <div className="flex items-center gap-3 mt-4">
                <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center border-2 border-violet-500/50">
                  <span className="text-white text-xs font-bold">P</span>
                </div>
                <div>
                  <p className="text-white text-xs font-semibold">Priya Sharma</p>
                  <p className="text-gray-500 text-xs">Head of Events, Nexus Corp</p>
                </div>
                <div className="ml-auto">
                  <div className="flex -space-x-2">
                    {avatarColors.map((c, i) => (
                      <div key={i} className="w-6 h-6 rounded-full border border-[#05071a]" style={{ background: c, zIndex: 5 - i }} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 mt-1 text-right">+9,000 more</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══ RIGHT PANEL – Form ═══════════════════ */}
        <div className="w-full max-w-[420px] animate-scale-in delay-0">
          <div className="relative">
            <div className="absolute -inset-4 rounded-[36px] opacity-25 animate-spin-slow"
              style={{ background: 'conic-gradient(from 0deg, transparent 65%, rgba(236,72,153,0.7) 85%, rgba(139,92,246,0.6) 100%)', filter: 'blur(14px)' }} />

            <div className="auth-card relative p-7">
              {/* Top accent */}
              <div className="absolute top-0 left-8 right-8 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(236,72,153,0.7), rgba(139,92,246,0.6), transparent)' }} />

              {/* Icon */}
              <div className="flex justify-center mb-5">
                <div className="relative w-15 h-15">
                  <div className="absolute inset-0 rounded-2xl glow-violet" style={{ background: 'linear-gradient(135deg,#a855f7,#6366f1)' }} />
                  <div className="w-15 h-15 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#a855f7,#6366f1)', width: 60, height: 60 }}>
                    <Rocket className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>Create your account</h2>
                <p className="text-gray-400 text-sm mt-1">Start for free, no credit card needed</p>
              </div>

              {error && (
                <div className="mb-4 px-4 py-3 rounded-2xl text-sm flex items-start gap-2 animate-fade-down"
                  style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.28)', color: '#fca5a5' }}>
                  <span className="font-bold shrink-0">!</span> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200"
                      style={{ color: focused === 'name' ? '#a855f7' : '#4b5563' }} />
                    <input id="signup-name" type="text" name="name" required
                      className={`${inputClass} pl-11 pr-4`}
                      placeholder="Your full name"
                      value={form.name} onChange={set('name')}
                      onFocus={() => setFocused('name')} onBlur={() => setFocused('')} />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200"
                      style={{ color: focused === 'email' ? '#a855f7' : '#4b5563' }} />
                    <input id="signup-email" type="email" name="email" required
                      className={`${inputClass} pl-11 pr-4`}
                      placeholder="you@example.com"
                      value={form.email} onChange={set('email')}
                      onFocus={() => setFocused('email')} onBlur={() => setFocused('')} />
                  </div>
                </div>

                {/* Password row */}
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                      <input id="signup-password" type={showPw ? 'text' : 'password'} name="password" required
                        className={`${inputClass} pl-10 pr-10`}
                        placeholder="Min 6 chars"
                        value={form.password} onChange={set('password')}
                        onFocus={() => setFocused('pw')} onBlur={() => setFocused('')} />
                      <button type="button" onClick={() => setShowPw(!showPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors">
                        {showPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Confirm</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                      <input id="signup-confirm" type={showCp ? 'text' : 'password'} name="confirmPassword" required
                        className={`${inputClass} pl-10 pr-10`}
                        placeholder="Repeat"
                        value={form.confirmPassword} onChange={set('confirmPassword')}
                        onFocus={() => setFocused('cp')} onBlur={() => setFocused('')} />
                      <button type="button" onClick={() => setShowCp(!showCp)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors">
                        {showCp ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <button id="signup-submit" type="submit" disabled={loading}
                  className="btn-primary w-full py-4 rounded-2xl text-sm flex p-4 items-center justify-center gap-2.5 mt-1"
                  style={{ background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)', borderColor: 'rgba(168,85,247,0.4)', boxShadow: '0 4px 20px rgba(168,85,247,0.45)' }}>
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" style={{ animation: 'spin 0.8s linear infinite' }} /> Creating account…</>
                  ) : (
                    <><Rocket className="w-4 h-4" /> Create Free Account <ArrowRight className="w-4 h-4 ml-auto" /></>
                  )}
                </button>
              </form>

              <div className="mt-5 pt-4 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-gray-500 text-sm">
                  Already have an account?{' '}
                  <Link href="/login" className="font-semibold text-violet-400 hover:text-violet-300 transition-colors">Sign in →</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
