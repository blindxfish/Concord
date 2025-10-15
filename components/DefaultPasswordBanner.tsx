"use client"

import { useEffect, useState } from 'react'

export default function DefaultPasswordBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/auth/default-password', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setShow(!!data.isDefault)
      }
    })()
  }, [])

  if (!show) return null
  return (
    <div className="bg-yellow-100 border border-yellow-300 text-yellow-900 px-4 py-2 text-sm flex items-center justify-between">
      <span>Default admin password is still set. Please change it at Users page.</span>
      <button className="text-yellow-800 underline" onClick={() => setShow(false)}>Dismiss</button>
    </div>
  )
}


