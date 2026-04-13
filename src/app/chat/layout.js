'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import ChatHeader from '@/components/ChatHeader'

export default function ChatLayout({ children }) {
  const router   = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated')
    const user   = localStorage.getItem('currentUser')
    if (!isAuth || !user) router.push('/login')
  }, [router])

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#080b18' }}>

      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatHeader
          title="AI Event Manager"
          subtitle="Always online · Powered by Mastra AI"
        />
        <main className="flex-1 overflow-hidden flex flex-col">
          {children}
        </main>
      </div>

    </div>
  )
}