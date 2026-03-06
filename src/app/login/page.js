'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, Calendar, Users, MapPin } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const user = users.find(u => u.email === email && u.password === password)
      
      if (user) {
        // Set authentication state
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('currentUser', JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email
        }))
        router.push('/chat')
      } else {
        setError('Invalid email or password')
      }
    } catch (err) {
      console.log("🚀 ~ handleSubmit ~ err:", err)
      setError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-150 via-white to-purple-50 flex items-center justify-center p-4 shadow-2xl">
      <div className="w-full max-w-6xl flex items-center justify-center gap-12">
        {/* Left side - Features */}
        <div className="hidden lg:block flex-1">
          <div className="bg-gradient-r from-indigo-50 to-purple-20 backdrop-blur-sm rounded-3xl p-8 shadow-2xl shadow-indigo-100">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              AI Event Management
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Plan, manage, and coordinate events with AI-powered assistance
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                  <Calendar className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Smart Scheduling</h3>
                  <p className="text-gray-600">AI-powered event planning and timeline management</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Guest Management</h3>
                  <p className="text-gray-600">Automated guest list and RSVP tracking</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Venue Coordination</h3>
                  <p className="text-gray-600">Smart venue selection and management</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full max-w-md">
          <div className="bg-gradient-r from-indigo-50 to-purple-20 rounded-3xl shadow-2xl shadow-indigo-100 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-linear-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600">
                Sign in to your account to continue
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-linear-to-r cursor-pointer from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-8 text-center cursor-pointer text-indigo-600">
              <p className="text-gray-600">
                Don&apos;t have an account?{' '}
                <Link
                  href="/signup"
                  className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
