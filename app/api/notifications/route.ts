import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createClient()

    // Fetch notifications for the user
    const { data: notifications, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(20)

    if (error) {
      console.error("Error fetching notifications:", error)
      return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
    }

    // Count unread notifications
    const unreadCount = notifications?.filter((n) => !n.read).length || 0

    return NextResponse.json({
      notifications: notifications || [],
      unreadCount,
    })
  } catch (error) {
    console.error("Notifications API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { type, title, message, actionUrl } = body

    const supabase = createClient()

    const { data, error } = await supabase
      .from("notifications")
      .insert({
        user_id: session.user.id,
        type,
        title,
        message,
        action_url: actionUrl,
        read: false,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating notification:", error)
      return NextResponse.json({ error: "Failed to create notification" }, { status: 500 })
    }

    return NextResponse.json({ notification: data })
  } catch (error) {
    console.error("Create notification API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
