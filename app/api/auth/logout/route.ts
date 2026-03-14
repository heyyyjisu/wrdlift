import { createClient } from "@/lib/auth/supabaseServer"
import { NextResponse } from "next/server"

export async function POST() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }

  const res = NextResponse.json({ success: true })
  const secure = process.env.NODE_ENV === "production"

  res.cookies.set("sb-access-token", "", {
    path: "/",
    maxAge: 0,
    httpOnly: true,
    secure,
    sameSite: "strict",
  })
  res.cookies.set("sb-refresh-token", "", {
    path: "/",
    maxAge: 0,
    httpOnly: true,
    secure,
    sameSite: "strict",
  })
  return res
}
