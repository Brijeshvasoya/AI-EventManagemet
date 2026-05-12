'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import LandingPage from '../components/landing/LandingPage'

export default function Home() {
  const router = useRouter()
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    // Check if user is authenticated and redirect to chat if they are
    const checkAuth = () => {
      const isAuthenticated = localStorage.getItem('isAuthenticated')
      const currentUser = localStorage.getItem('currentUser')
      
      if (isAuthenticated && currentUser) {
        try {
          const user = JSON.parse(currentUser)
          if (user.id && user.email) {
            router.push('/chat')
            return
          }
        } catch (error) {
          console.error("Auth check error:", error)
          localStorage.removeItem('isAuthenticated')
          localStorage.removeItem('currentUser')
        }
      }
      setIsCheckingAuth(false)
    }
    
    checkAuth()
  }, [router])

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--t-body-bg)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-[var(--primary)]/20 border-t-[var(--primary)] animate-spin"></div>
          <p className="text-[var(--t-text-tertiary)] animate-pulse">Loading...</p>
        </div>
      </div>
    )
  }

  return <LandingPage />
}
