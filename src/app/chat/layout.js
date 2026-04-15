'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import ChatHeader from '@/components/ChatHeader'

export default function ChatLayout({ children }) {
  const router   = useRouter()

  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated')
    const user   = localStorage.getItem('currentUser')
    if (!isAuth || !user) router.push('/login')
  }, [router])

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--t-chat-layout-bg)' }}>

      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden p-2 md:p-3">
        <div className="app-shell flex-1 flex flex-col overflow-hidden rounded-3xl shadow-[0_12px_60px_var(--t-shadow)]">
        <ChatHeader
          title="AI Event Manager"
          subtitle="Always online · Powered by Mastra AI"
        />
        <main className="flex-1 overflow-hidden flex flex-col">
          {children}
        </main>
        </div>
      </div>

    </div>
  )
}