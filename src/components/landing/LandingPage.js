'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useScroll, useTransform } from 'motion/react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import {
  Sparkles,
  ArrowRight,
  MessageSquare,
  Bot,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Truck,
  CloudRain,
  CheckCircle2
} from 'lucide-react'

const LandingPage = () => {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  const y1 = useTransform(scrollY, [0, 500], [0, -100])
  const y2 = useTransform(scrollY, [0, 500], [0, 100])
  const rotate = useTransform(scrollY, [0, 500], [0, 15])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const aiCapabilities = [
    { title: 'Smart Planning', icon: <Calendar />, tool: 'eventPlanningTool' },
    { title: 'Venue Insight', icon: <MapPin />, tool: 'venueManagementTool' },
    { title: 'Guest Logic', icon: <Users />, tool: 'guestManagementTool' },
    { title: 'Budget AI', icon: <DollarSign />, tool: 'budgetPlanningTool' },
    { title: 'Vendor Sync', icon: <Truck />, tool: 'vendorCoordinationTool' },
    { title: 'Weather Guard', icon: <CloudRain />, tool: 'weatherTool' },
  ]

  return (
    <div className="min-h-screen bg-[#02040a] text-white selection:bg-purple-500/30 font-sans overflow-x-hidden">
      {/* ── Background & Animations ── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Animated Orbs from Auth Pages */}
        <div className="orb" style={{ width: 800, height: 800, top: '-20%', left: '-15%', background: 'var(--t-orb-1)', animationDuration: '15s' }} />
        <div className="orb" style={{ width: 600, height: 600, bottom: '-10%', right: '-10%', background: 'var(--t-orb-2)', animationDuration: '20s', animationDelay: '-5s' }} />
        <div className="orb" style={{ width: 400, height: 400, top: '40%', left: '30%', background: 'var(--t-orb-pink)', animationDuration: '18s', animationDelay: '-8s', opacity: 0.4 }} />

        {/* Grid & Radial Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute inset-0 opacity-50" style={{
          background: 'radial-gradient(ellipse 55% 32% at 50% 12%, rgba(139,92,246,0.15) 0%, transparent 70%)',
        }} />
      </div>

      {/* ── Navigation ── */}
      <nav
        className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 ${scrolled ? 'py-4 bg-black/60 backdrop-blur-md border-b border-white/10' : 'py-8 bg-transparent'
          }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.4)]">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight font-syne">AI EVENT BOT</span>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-white/60 hover:text-white cursor-pointer" onClick={() => router.push('/login')}>Log in</Button>
            <Button className="bg-white text-black hover:bg-white/90 rounded-full px-6 font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] cursor-pointer" onClick={() => router.push('/signup')}>Get Started</Button>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative pt-40 pb-20 md:pt-56 md:pb-32 z-10 overflow-hidden">
        {/* Cinematic Background Image */}
        <div className="absolute inset-0 z-0">
          <motion.img
            style={{ y: useTransform(scrollY, [0, 500], [0, 150]) }}
            src="/hero_bg.png"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-30 scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#02040a] via-transparent to-[#02040a]"></div>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="flex-1 text-left relative">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10"
              >
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8 font-syne uppercase">
                  MEET YOUR <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">AI EVENT BOT</span>
                </h1>
                <p className="text-xl md:text-2xl text-white/50 mb-10 max-w-xl font-medium leading-relaxed">
                  The first conversational AI designed to handle the complexity of event planning. Just chat, and let our bot handle the logistics.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-5 mb-12">
                  <Button size="lg" className="h-16 cursor-pointer px-8 text-lg bg-white text-black hover:bg-white/90 rounded-2xl font-bold shadow-2xl transition-transform hover:scale-105 active:scale-95" onClick={() => router.push('/signup')}>
                    Start Chatting Now <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            </div>

            {/* Right Image (Mobile UI) */}
            <div className="flex-1 relative w-full lg:max-w-xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 30 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="relative"
              >
                {/* Main Mobile UI */}
                <motion.div
                  className="relative z-20 rounded-[3rem] border border-white/10 p-2 bg-black shadow-2xl overflow-hidden group"
                  animate={{
                    y: [0, -10, 0],
                    rotateX: [0, 5, 0],
                    rotateY: [0, 5, 0]
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  whileHover={{ scale: 1.08 }}
                >
                  <img src="/mobile_chat_ui.png" alt="Chat UI" className="w-full rounded-[2.5rem] transition-all duration-700 shadow-2xl" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-transparent pointer-events-none group-hover:opacity-0 transition-opacity"></div>
                </motion.div>

                {/* Decorative Success Badge */}
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-6 -right-6 z-30 p-5 rounded-3xl bg-[#040817]/90 border border-white/10 backdrop-blur-xl shadow-2xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">Venue Secured</div>
                      <div className="text-[10px] uppercase text-white/30 font-bold">Bot Assistant</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Decorative Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Partner Logos ── */}
      <section className="py-16 border-y border-white/5 bg-white/[0.02] z-10 relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-20 hover:opacity-40 transition-opacity">
            {['EVENTBRITE', 'CVENT', 'SLACK', 'NOTION', 'HUBSPOT'].map(logo => (
              <span key={logo} className="text-xl font-black tracking-tighter font-syne">{logo}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Capabilities Section ── */}
      <section className="py-32 z-10 relative overflow-hidden">
        {/* Background Decorative Image */}
        <div className="absolute top-20 left-[-5%] w-[500px] h-[500px] opacity-10 pointer-events-none grayscale">
          <img src="/hologram_calendar.png" alt="Calendar BG" className="w-full animate-[spin_20s_linear_infinite]" />
        </div>

        <div className="container mx-auto px-6">
          <div className="max-w-2xl mb-20">
            <Badge variant="outline" className="mb-4 border-white/10 text-white/40 uppercase tracking-widest text-[10px]">Architecture</Badge>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 font-syne uppercase">HOW THE <br /> <span className="text-white/40">BOT WORKS.</span></h2>
            <p className="text-xl text-white/50 font-medium leading-relaxed">Our AI understands context, handles tools, and automates your entire workflow through a single chat window.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiCapabilities.map((cap, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 backdrop-blur-sm group transition-all duration-500 shadow-xl"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:bg-purple-600/20 group-hover:border-purple-500/30 transition-all duration-500">
                  {React.cloneElement(cap.icon, { className: "w-7 h-7 text-white group-hover:text-purple-400 transition-colors" })}
                </div>
                <h3 className="text-2xl font-bold mb-4 font-syne uppercase tracking-tight">{cap.title}</h3>
                <p className="text-white/40 leading-relaxed mb-6 font-medium">
                  The bot utilizes <code className="text-[10px] bg-white/5 px-2 py-1 rounded text-purple-400 font-bold">{cap.tool}</code> to process your request instantly.
                </p>
                <div className="flex items-center text-sm font-bold text-white/20 group-hover:text-white/80 transition-colors">
                  Check capability <MessageSquare className="w-4 h-4 ml-2" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final Push ── */}
      <section className="py-40 z-10 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10 pt-20">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: -50 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1 text-center lg:text-left"
            >
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-12 font-syne uppercase leading-[0.85]">Hire your <br /> <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">AI Assistant</span></h2>
              <p className="text-xl text-white/50 mb-16 max-w-xl font-medium">Ready to offload your event logistics? Start chatting with your new assistant today.</p>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Button size="lg" className="h-20 cursor-pointer px-12 text-xl bg-white text-black hover:bg-white/90 rounded-2xl font-black shadow-2xl transition-transform hover:scale-105 active:scale-95" onClick={() => router.push('/signup')}>
                  GET STARTED NOW
                </Button>
                <Button size="lg" variant="ghost" className="h-20 cursor-pointer px-8 text-lg text-white/40 hover:text-white transition-colors" onClick={() => router.push('/login')}>
                  Learn more
                </Button>
              </div>
            </motion.div>

            {/* Robot Avatar - Side Position */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 50 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 1 },
                scale: { duration: 1 }
              }}
              className="flex-1 relative max-w-md"
            >
              <div className="absolute inset-0 bg-purple-600/10 blur-[100px] rounded-full"></div>
              <img src="/chatbot_avatar.png" alt="AI Bot" className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(124,58,237,0.4)]" />
            </motion.div>
          </div>
        </div>

        {/* Massive Decorative Text in Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[25vw] font-black text-white/[0.01] pointer-events-none select-none font-syne z-0">
          CHATBOT
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/5 z-10 relative bg-black">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tighter font-syne uppercase">AI EVENT BOT</span>
            </div>

            <div className="flex gap-10 text-sm font-medium text-white/20">
              <span>Built with Mastra AI</span>
              <span>© 2026 AI Event Management</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
