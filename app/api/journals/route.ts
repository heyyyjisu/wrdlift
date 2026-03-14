import saveEntry from "@/lib/auth/actions"
import { createClient } from "@/lib/auth/supabaseServer"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { content } = await request.json()

  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    )
  }
  const { data: entryData, error: saveError } = await saveEntry(supabase, {
    content,
    userId: data.user.id,
  })
  if (saveError) {
    return NextResponse.json(
      { success: false, error: saveError, message: saveError.message },
      { status: 500 }
    )
  }
  console.log(entryData)
  return NextResponse.json({ success: true, data: entryData })
}
