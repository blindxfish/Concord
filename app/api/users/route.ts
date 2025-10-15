import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import db from '../../../lib/db'
import { getAuthenticatedUser } from '../../../lib/auth'

export async function GET() {
  const me = getAuthenticatedUser()
  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const rows = db.prepare('SELECT id, username, is_admin, created_at FROM users ORDER BY id ASC').all()
  return NextResponse.json(rows)
}

export async function POST(request: Request) {
  const me = getAuthenticatedUser()
  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { username, password, is_admin } = await request.json()
  if (!username || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  const hash = bcrypt.hashSync(password, 10)
  try {
    const info = db.prepare('INSERT INTO users (username, password_hash, is_admin) VALUES (?, ?, ?)').run(username, hash, is_admin ? 1 : 0)
    return NextResponse.json({ id: info.lastInsertRowid })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

export async function PUT(request: Request) {
  const me = getAuthenticatedUser()
  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, username, password, is_admin } = await request.json()
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as any
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const newUsername = username ?? user.username
  const newHash = password ? bcrypt.hashSync(password, 10) : user.password_hash
  const newAdmin = typeof is_admin === 'boolean' ? (is_admin ? 1 : 0) : user.is_admin
  db.prepare('UPDATE users SET username = ?, password_hash = ?, is_admin = ? WHERE id = ?').run(newUsername, newHash, newAdmin, id)
  return NextResponse.json({ ok: true })
}

export async function DELETE(request: Request) {
  const me = getAuthenticatedUser()
  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(request.url)
  const id = Number(searchParams.get('id'))
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  db.prepare('DELETE FROM users WHERE id = ?').run(id)
  return NextResponse.json({ ok: true })
}


