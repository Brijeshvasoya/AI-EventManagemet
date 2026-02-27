'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated and redirect accordingly
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
          // Clear invalid data
          console.log("🚀 ~ checkAuth ~ error:", error)
          localStorage.removeItem('isAuthenticated')
          localStorage.removeItem('currentUser')
        }
      }
      
      // Redirect to login if not authenticated
      router.push('/login')
    }
    
    checkAuth()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">AI Event Management</h1>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  )
}
