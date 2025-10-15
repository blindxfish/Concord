"use client"

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export const dynamic = 'force-dynamic'

function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next') || '/'

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.trim(), password }),
    })
    if (!res.ok) {
      let message = 'Login failed'
      const ct = res.headers.get('content-type') || ''
      try {
        if (ct.includes('application/json')) {
          const data = await res.json()
          message = data?.error || message
        } else {
          const text = await res.text()
          if (text && text.startsWith('<!DOCTYPE')) message = 'Unauthorized (redirected to HTML)'
        }
      } catch {}
      setError(message)
      return
    }
    router.push(next)
  }

  return (
    <div className="w-full p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Sign in</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800" />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800" />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button type="submit" className="w-full py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Sign in</button>
        <p className="text-xs text-gray-500 mt-2">Default credentials: admin / changeme</p>
      </form>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="w-full p-6 max-w-md mx-auto"><h1 className="text-2xl font-semibold mb-6">Sign in</h1><div>Loading...</div></div>}>
      <LoginForm />
    </Suspense>
  )
}


