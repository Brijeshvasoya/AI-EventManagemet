'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useMutation } from '@apollo/client/react'
import { LOGIN_MUTATION } from '../../graphql/client'
import { Eye, EyeOff, Mail, Lock, Zap, Calendar, Users, MapPin, ArrowRight, Star } from 'lucide-react'

const features = [
  { icon: Calendar, label: 'Smart Scheduling', desc: 'AI plans your timeline instantly', color: '#8b5cf6', glow: 'rgba(139,92,246,0.3)' },
  { icon: Users, label: 'Guest Automation', desc: 'RSVPs & lists managed automatically', color: '#06b6d4', glow: 'rgba(6,182,212,0.3)' },
  { icon: MapPin, label: 'Venue Intelligence', desc: 'Smart venue matching & coordination', color: '#ec4899', glow: 'rgba(236,72,153,0.3)' },
]

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [focused, setFocused] = useState('')
  const router = useRouter()
  const [login] = useMutation(LOGIN_MUTATION)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const { data } = await login({ variables: { email, password } })
      const u = data.login
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('currentUser', JSON.stringify({ id: u.id, name: u.name, email: u.email }))
      router.push('/chat')
    } catch {
      setError('Invalid email or password. Please check your credentials.')
    } finally { setLoading(false) }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ zIndex: 1 }}>

      {/* ── Decorative orbs ─────────────────────────── */}
      <div className="orb" style={{ width: 600, height: 600, top: '-20%', left: '-15%', background: 'radial-gradient(circle, rgba(109,40,217,0.5) 0%, transparent 70%)', animationDelay: '0s' }} />
      <div className="orb" style={{ width: 400, height: 400, bottom: '-10%', right: '-10%', background: 'radial-gradient(circle, rgba(67,56,202,0.45) 0%, transparent 70%)', animationDelay: '-4s' }} />
      <div className="orb" style={{ width: 250, height: 250, top: '50%', left: '45%', background: 'radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 70%)', animationDelay: '-8s', opacity: 0.6 }} />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-8 py-10 flex items-center gap-12 lg:gap-20">

        {/* ══ LEFT PANEL ══════════════════════════════ */}
        <div className="hidden lg:flex flex-col flex-1 gap-8">

          {/* Brand */}
          <div className="animate-fade-up delay-0 flex items-center gap-3">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-2xl gradient-primary glow-violet animate-float" />
              <div className="relative w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <p className="text-xl font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>Event <span className="gradient-text">AI</span></p>
              <p className="text-xs text-gray-500 -mt-0.5">Management Platform</p>
            </div>
          </div>

          {/* Headline */}
          <div className="animate-fade-up delay-1">
            <div className="badge mb-4">
              <Star className="w-3 h-3" />
              Trusted by 10,000+ event planners
            </div>
            <h1 className="text-5xl xl:text-6xl font-black leading-[1.08] tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
              <span className="text-white">Plan events</span><br />
              <span className="shimmer-text">smarter</span>
              <span className="text-white">, faster</span>
            </h1>
            <p className="mt-4 text-gray-400 text-lg leading-relaxed max-w-sm">
              Your AI co-pilot for flawless event planning — from intimate dinners to 10,000-person conferences.
            </p>
          </div>

          {/* Feature cards */}
          <div className="flex flex-col gap-3">
            {features.map((f, i) => (
              <div
                key={f.label}
                className={`feature-card p-4 flex items-center gap-4 animate-slide-left delay-${i + 2}`}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${f.color}22`, border: `1px solid ${f.color}44`, boxShadow: `0 0 18px ${f.glow}` }}
                >
                  <f.icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{f.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
                </div>
                <div className="ml-auto w-5 h-5 rounded-full flex items-center justify-center" style={{ background: `${f.color}22` }}>
                  <ArrowRight className="w-3 h-3" style={{ color: f.color }} />
                </div>
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-6 animate-fade-up delay-5">
            <div className="flex -space-x-2">
              {['#8b5cf6', '#06b6d4', '#ec4899', '#f59e0b'].map((c, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#05071a] flex items-center justify-center" style={{ background: c, zIndex: 4 - i }}>
                  <span className="text-white text-xs font-bold">{String.fromCharCode(65 + i)}</span>
                </div>
              ))}
            </div>
            <div>
              <div className="flex gap-0.5 mb-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-xs text-gray-400">4.9 / 5 from 2,400+ reviews</p>
            </div>
          </div>
        </div>

        {/* ══ RIGHT PANEL – Form ══════════════════════ */}
        <div className="w-full max-w-[420px] animate-scale-in delay-0">

          {/* Spinning ring decoration */}
          <div className="relative mb-6">
            <div
              className="absolute -inset-4 rounded-[36px] opacity-30 animate-spin-slow"
              style={{ background: 'conic-gradient(from 0deg, transparent 70%, rgba(124,58,237,0.6) 100%)', filter: 'blur(12px)' }}
            />
            <div className="auth-card relative p-8">

              {/* Top accent line */}
              <div className="absolute top-0 left-8 right-8 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.8), rgba(6,182,212,0.5), transparent)' }} />

              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl glow-pulse" style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)' }} />
                  <div className="relative w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
                    <Zap className="w-8 h-8 text-white" strokeWidth={2.5} />
                  </div>
                </div>
              </div>

              <div className="text-center mb-7">
                <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>Welcome back 👋</h2>
                <p className="text-gray-400 text-sm mt-1">Sign in to your account</p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-5 px-4 py-3 rounded-2xl text-sm flex items-start gap-2.5 animate-fade-down"
                  style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.30)', color: '#fca5a5' }}>
                  <div className="w-4 h-4 rounded-full bg-red-500/30 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">!</div>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200"
                      style={{ color: focused === 'email' ? '#8b5cf6' : '#4b5563' }} />
                    <input
                      id="login-email"
                      type="email" required
                      className="input-field w-full pl-11 pr-4 py-3.5 text-sm"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onFocus={() => setFocused('email')}
                      onBlur={() => setFocused('')}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200"
                      style={{ color: focused === 'password' ? '#8b5cf6' : '#4b5563' }} />
                    <input
                      id="login-password"
                      type={show ? 'text' : 'password'} required
                      className="input-field w-full pl-11 pr-12 py-3.5 text-sm"
                      placeholder="Your password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      onFocus={() => setFocused('password')}
                      onBlur={() => setFocused('')}
                    />
                    <button type="button" onClick={() => setShow(!show)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  id="login-submit"
                  type="submit" disabled={loading}
                  className="btn-primary w-full py-4 rounded-2xl p-4 text-sm flex items-center justify-center gap-2.5 mt-2"
                >
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" style={{ animation: 'spin 0.8s linear infinite' }} /> Signing in…</>
                  ) : (
                    <><Zap className="w-4 h-4" strokeWidth={2.5} /> Sign In to Dashboard <ArrowRight className="w-4 h-4 ml-auto" /></>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-5 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-gray-500 text-sm">
                  No account yet?{' '}
                  <Link href="/signup" className="font-semibold text-violet-400 hover:text-violet-300 transition-colors">
                    Create one free →
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
