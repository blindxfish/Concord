import { NextResponse } from 'next/server'
import { verifyUser } from '../../../../lib/auth'
import db from '../../../../lib/db'
import bcrypt from 'bcryptjs'
import crypto from 'node:crypto'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()
    console.log('Login attempt:', { username, hasPassword: !!password })
    
    if (!username || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
    }
    
    // Debug: Check if user exists in database
    const userCheck = db.prepare('SELECT id, username, password_hash FROM users WHERE username = ?').get(username) as any
    console.log('User lookup result:', { userCheck, username })
    
    const userId = verifyUser(username, password)
    console.log('User verification result:', { userId, username })
    
    // Debug: Test password hash directly
    if (userCheck) {
      const testHash = bcrypt.hashSync('changeme', 10)
      const testCompare = bcrypt.compareSync('changeme', userCheck.password_hash)
      console.log('Password test:', { testCompare, storedHash: userCheck.password_hash.substring(0, 20) + '...' })
    }
    
    if (!userId) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
    }
    
    // Create session and set cookie on response
    const sessionId = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000)
    db.prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)').run(sessionId, userId, expiresAt.toISOString())

    const res = NextResponse.json({ ok: true })
    res.cookies.set('concord_session', sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
      expires: expiresAt,
    })
    console.log('Session created for user:', userId)
    return res
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


