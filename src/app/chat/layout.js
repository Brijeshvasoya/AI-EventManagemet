'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import ChatHeader from '@/components/ChatHeader'

export default function ChatLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated')
    const user = localStorage.getItem('currentUser')
    if (!isAuth || !user) router.push('/login')
  }, [router])

  const isSpecificChat = pathname.startsWith('/chat/')

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      <Sidebar />

      <div className="flex-1 flex flex-col">

        <ChatHeader
          title={
            isSpecificChat
              ? "AI Event Management Assistant"
              : "AI Event Management Assistant"
          }
          subtitle={
            isSpecificChat
              ? "Chat Conversation"
              : "Your intelligent partner for planning and managing memorable events"
          }
        />

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  )
}