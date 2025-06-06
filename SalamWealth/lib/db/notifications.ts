import { query } from "../db"

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: string
  read: boolean
  action_url?: string
  created_at: Date
}

export async function getNotificationsByUserId(userId: string, limit = 10): Promise<Notification[]> {
  const result = await query("SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2", [
    userId,
    limit,
  ])

  return result.rows
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const result = await query("SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND read = FALSE", [
    userId,
  ])

  return Number.parseInt(result.rows[0].count)
}

export async function markNotificationAsRead(id: string): Promise<boolean> {
  const result = await query("UPDATE notifications SET read = TRUE WHERE id = $1", [id])

  return result.rowCount > 0
}

export async function markAllNotificationsAsRead(userId: string): Promise<boolean> {
  const result = await query("UPDATE notifications SET read = TRUE WHERE user_id = $1 AND read = FALSE", [userId])

  return result.rowCount > 0
}

export async function createNotification(notificationData: {
  user_id: string
  title: string
  message: string
  type: string
  action_url?: string
}): Promise<Notification> {
  const result = await query(
    `INSERT INTO notifications (user_id, title, message, type, action_url)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      notificationData.user_id,
      notificationData.title,
      notificationData.message,
      notificationData.type,
      notificationData.action_url || null,
    ],
  )

  return result.rows[0]
}
