import { cookies } from 'next/headers'
import crypto from 'node:crypto'
import bcrypt from 'bcryptjs'
import db from './db'

const SESSION_TTL_HOURS = 24 * 7

export function createSession(userId: number) {
  const id = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + SESSION_TTL_HOURS * 3600 * 1000)
  db.prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)').run(id, userId, expiresAt.toISOString())
  cookies().set('concord_session', id, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    expires: expiresAt,
  })
}

export function destroySession() {
  const id = cookies().get('concord_session')?.value
  if (id) {
    db.prepare('DELETE FROM sessions WHERE id = ?').run(id)
    cookies().delete('concord_session')
  }
}

export function getAuthenticatedUser(): { id: number; username: string; is_admin: number } | null {
  const id = cookies().get('concord_session')?.value
  if (!id) return null
  const row = db.prepare(
    `SELECT u.id, u.username, u.is_admin FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.id = ? AND s.expires_at > datetime('now')`
  ).get(id) as any
  return row || null
}

export function verifyUser(username: string, password: string) {
  const uname = username.trim()
  const row = db.prepare('SELECT id, password_hash FROM users WHERE lower(username) = lower(?)').get(uname) as any
  if (!row) return null
  const ok = bcrypt.compareSync(password, row.password_hash)
  if (!ok) return null
  return row.id as number
}

export function isDefaultPassword(): boolean {
  const row = db.prepare('SELECT password_hash FROM users WHERE lower(username) = lower(?)').get('admin') as any
  if (!row) return false
  return bcrypt.compareSync('changeme', row.password_hash)
}


