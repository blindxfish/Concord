"use client"

import { useEffect, useState } from 'react'

export const dynamic = 'force-dynamic'

interface User { id: number; username: string; is_admin: number; created_at: string }

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [editing, setEditing] = useState<number | null>(null)
  const [banner, setBanner] = useState<string | null>(null)

  useEffect(() => {
    refresh()
  }, [])

  async function refresh() {
    const res = await fetch('/api/users', { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      setUsers(data)
    }
  }

  async function createUser() {
    const res = await fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password, is_admin: isAdmin }) })
    if (res.ok) { setUsername(''); setPassword(''); setIsAdmin(false); refresh() }
  }

  async function updateUser(id: number) {
    const res = await fetch('/api/users', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, username, password, is_admin: isAdmin }) })
    if (res.ok) { setEditing(null); setUsername(''); setPassword(''); setIsAdmin(false); refresh() }
  }

  async function deleteUser(id: number) {
    if (!confirm('Delete this user?')) return
    const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE' })
    if (res.ok) refresh()
  }

  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-semibold mb-4">Users</h1>
      {banner && <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 text-yellow-900 rounded">{banner}</div>}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-4">
          <h2 className="font-semibold mb-3">{editing ? 'Edit User' : 'Create User'}</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Username</label>
              <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800" />
            </div>
            <div>
              <label className="block text-sm mb-1">Password {editing && <span className="text-xs text-gray-500">(leave blank to keep)</span>}</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800" />
            </div>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} /> Admin
            </label>
            <div className="flex gap-2">
              {!editing && <button onClick={createUser} className="px-4 py-2 rounded bg-blue-600 text-white">Create</button>}
              {editing && <>
                <button onClick={() => updateUser(editing)} className="px-4 py-2 rounded bg-blue-600 text-white">Save</button>
                <button onClick={() => { setEditing(null); setUsername(''); setPassword(''); setIsAdmin(false) }} className="px-4 py-2 rounded bg-gray-600 text-white">Cancel</button>
              </>}
            </div>
            <p className="text-xs text-gray-500">Default admin user: admin / changeme — change this password after first login.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-4">
          <h2 className="font-semibold mb-3">Existing Users</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2">ID</th>
                <th>Username</th>
                <th>Admin</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="py-2">{u.id}</td>
                  <td>{u.username}</td>
                  <td>{u.is_admin ? 'Yes' : 'No'}</td>
                  <td>{new Date(u.created_at).toLocaleString()}</td>
                  <td className="space-x-2">
                    <button onClick={() => { setEditing(u.id); setUsername(u.username); setPassword(''); setIsAdmin(!!u.is_admin) }} className="px-3 py-1 rounded bg-yellow-600 text-white">Edit</button>
                    <button onClick={() => deleteUser(u.id)} className="px-3 py-1 rounded bg-red-600 text-white">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


