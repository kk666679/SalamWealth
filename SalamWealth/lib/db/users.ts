import { query } from "../db"
import bcrypt from "bcryptjs"

export interface User {
  id: string
  mykad_id: string
  full_name: string
  email: string
  phone?: string
  address?: string
  bumiputera_status: boolean
  created_at: Date
  updated_at: Date
}

export async function getUserById(id: string): Promise<User | null> {
  const result = await query("SELECT * FROM users WHERE id = $1", [id])

  return result.rows[0] || null
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await query("SELECT * FROM users WHERE email = $1", [email])

  return result.rows[0] || null
}

export async function getUserByMyKad(mykadId: string): Promise<User | null> {
  const result = await query("SELECT * FROM users WHERE mykad_id = $1", [mykadId])

  return result.rows[0] || null
}

export async function createUser(userData: {
  mykad_id: string
  full_name: string
  email: string
  password: string
  phone?: string
  address?: string
  bumiputera_status?: boolean
}): Promise<User> {
  const passwordHash = await bcrypt.hash(userData.password, 12)

  const result = await query(
    `INSERT INTO users (
      mykad_id, full_name, email, phone, address, bumiputera_status, password_hash
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
    [
      userData.mykad_id,
      userData.full_name,
      userData.email,
      userData.phone || null,
      userData.address || null,
      userData.bumiputera_status || false,
      passwordHash,
    ],
  )

  return result.rows[0]
}

export async function updateUser(
  id: string,
  userData: {
    full_name?: string
    email?: string
    phone?: string
    address?: string
  },
): Promise<User | null> {
  const updates = []
  const values = []
  let paramCount = 1

  if (userData.full_name) {
    updates.push(`full_name = $${paramCount++}`)
    values.push(userData.full_name)
  }

  if (userData.email) {
    updates.push(`email = $${paramCount++}`)
    values.push(userData.email)
  }

  if (userData.phone) {
    updates.push(`phone = $${paramCount++}`)
    values.push(userData.phone)
  }

  if (userData.address) {
    updates.push(`address = $${paramCount++}`)
    values.push(userData.address)
  }

  updates.push(`updated_at = NOW()`)

  if (updates.length === 1) {
    return getUserById(id)
  }

  values.push(id)

  const result = await query(`UPDATE users SET ${updates.join(", ")} WHERE id = $${paramCount} RETURNING *`, values)

  return result.rows[0] || null
}

export async function changePassword(id: string, newPassword: string): Promise<boolean> {
  const passwordHash = await bcrypt.hash(newPassword, 12)

  const result = await query(`UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`, [
    passwordHash,
    id,
  ])

  return result.rowCount > 0
}
