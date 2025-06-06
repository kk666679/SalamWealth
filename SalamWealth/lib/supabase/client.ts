import { createClient as createSupabaseClient } from "@supabase/supabase-js"

let client = null

export function createClient() {
  if (client) return client

  client = createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  return client
}
