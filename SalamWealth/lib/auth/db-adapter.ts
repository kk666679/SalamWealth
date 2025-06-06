import type { Pool } from "pg"
import type { Adapter } from "next-auth/adapters"

export function PostgresAdapter(pool: Pool): Adapter {
  return {
    async createUser(user) {
      const { rows } = await pool.query(
        `INSERT INTO users (email, full_name, mykad_id) 
         VALUES ($1, $2, $3) 
         RETURNING id, email, full_name as name, mykad_id`,
        [user.email, user.name, user.email], // Using email as temporary MyKad ID
      )
      return rows[0]
    },

    async getUser(id) {
      const { rows } = await pool.query(
        `SELECT id, email, full_name as name, mykad_id 
         FROM users WHERE id = $1`,
        [id],
      )
      return rows[0] || null
    },

    async getUserByEmail(email) {
      const { rows } = await pool.query(
        `SELECT id, email, full_name as name, mykad_id 
         FROM users WHERE email = $1`,
        [email],
      )
      return rows[0] || null
    },

    async getUserByAccount({ provider, providerAccountId }) {
      const { rows } = await pool.query(
        `SELECT u.id, u.email, u.full_name as name, u.mykad_id
         FROM users u
         JOIN accounts a ON u.id = a.user_id
         WHERE a.provider_id = $1 AND a.provider_account_id = $2`,
        [provider, providerAccountId],
      )
      return rows[0] || null
    },

    async updateUser(user) {
      const { rows } = await pool.query(
        `UPDATE users
         SET email = $1, full_name = $2, updated_at = NOW()
         WHERE id = $3
         RETURNING id, email, full_name as name, mykad_id`,
        [user.email, user.name, user.id],
      )
      return rows[0]
    },

    async linkAccount(account) {
      await pool.query(
        `INSERT INTO accounts (
          user_id, provider_type, provider_id, provider_account_id,
          refresh_token, access_token, expires_at, token_type, scope, id_token, session_state
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          account.userId,
          account.type,
          account.provider,
          account.providerAccountId,
          account.refresh_token,
          account.access_token,
          account.expires_at,
          account.token_type,
          account.scope,
          account.id_token,
          account.session_state,
        ],
      )
      return account
    },

    async createSession(session) {
      const { rows } = await pool.query(
        `INSERT INTO sessions (user_id, expires, session_token)
         VALUES ($1, $2, $3)
         RETURNING id, session_token, user_id, expires`,
        [session.userId, session.expires, session.sessionToken],
      )
      return rows[0]
    },

    async getSessionAndUser(sessionToken) {
      const { rows } = await pool.query(
        `SELECT s.id as sessionId, s.session_token as sessionToken, s.user_id as userId, s.expires,
                u.id, u.email, u.full_name as name, u.mykad_id
         FROM sessions s
         JOIN users u ON s.user_id = u.id
         WHERE s.session_token = $1 AND s.expires > NOW()`,
        [sessionToken],
      )

      if (rows.length === 0) return null

      const { sessionId, sessionToken: token, userId, expires, ...user } = rows[0]
      return {
        session: { id: sessionId, sessionToken: token, userId, expires },
        user,
      }
    },

    async updateSession(session) {
      const { rows } = await pool.query(
        `UPDATE sessions
         SET expires = $1
         WHERE session_token = $2
         RETURNING id, session_token, user_id, expires`,
        [session.expires, session.sessionToken],
      )
      return rows[0] || null
    },

    async deleteSession(sessionToken) {
      await pool.query(`DELETE FROM sessions WHERE session_token = $1`, [sessionToken])
    },

    async createVerificationToken(verificationToken) {
      const { rows } = await pool.query(
        `INSERT INTO verification_tokens (identifier, token, expires)
         VALUES ($1, $2, $3)
         RETURNING identifier, token, expires`,
        [verificationToken.identifier, verificationToken.token, verificationToken.expires],
      )
      return rows[0]
    },

    async useVerificationToken({ identifier, token }) {
      const { rows } = await pool.query(
        `DELETE FROM verification_tokens
         WHERE identifier = $1 AND token = $2 AND expires > NOW()
         RETURNING identifier, token, expires`,
        [identifier, token],
      )
      if (rows.length === 0) return null
      return rows[0]
    },

    async deleteUser(userId) {
      await pool.query("DELETE FROM users WHERE id = $1", [userId])
    },

    async unlinkAccount({ provider, providerAccountId }) {
      await pool.query(
        `DELETE FROM accounts
         WHERE provider_id = $1 AND provider_account_id = $2`,
        [provider, providerAccountId],
      )
    },
  }
}
