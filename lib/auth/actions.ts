import { SupabaseClient } from "@supabase/supabase-js"

type SaveEntryProps = {
  content: string
  userId: string
}

export default async function saveEntry(
  supabase: SupabaseClient,
  { content, userId }: SaveEntryProps
) {
  return await supabase
    .from("journals")
    .insert({ content, user_id: userId })
    .select()
}
