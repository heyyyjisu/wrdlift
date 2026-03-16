import { SupabaseClient } from "@supabase/supabase-js"

type SaveEntryProps = {
  content: string
  userId: string
}

export async function saveEntry(
  supabase: SupabaseClient,
  { content, userId }: SaveEntryProps
) {
  return await supabase
    .from("journals")
    .insert({ content, user_id: userId })
    .select()
}

export async function getJournals<T = unknown>(
  supabase: SupabaseClient,
  userId: string,
  params: {
    page?: number
    pageSize?: number
    sortBy?: "created_at"
    query?: string
  } = {}
) {
  const page = Math.max(1, params.page ?? 1)
  const pageSize = params.pageSize ?? 8
  const start = (page - 1) * pageSize
  const end = start + pageSize - 1

  const res = await supabase
    .from("journals")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(start, end)

  const { data, error, count } = await res
  if (error) {
    throw error
  }
  const pageCount = count ? Math.ceil(count / pageSize) : 0
  return { data, count, pageCount, pageSize }
}
