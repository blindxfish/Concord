import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import db from '../../../../lib/db'

export async function POST() {
  const cookieStore = cookies()
  const sessionId = cookieStore.get('concord_session')?.value
  if (sessionId) {
    try { db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId) } catch {}
  }
  const res = NextResponse.json({ ok: true })
  res.cookies.set('concord_session', '', { expires: new Date(0), path: '/', httpOnly: true, sameSite: 'lax' })
  return res
}


