import { createClient } from "@/lib/auth/supabaseServer"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = await createClient()
  const { email, password } = await request.json()
  const login = await supabase.auth.signInWithPassword({ email, password })

  if (login.error || !login.data.session) {
    return NextResponse.json(
      { success: false, message: "No user found. Please sign up." },
      { status: 401 }
    )
  }
  const accessToken = login.data.session?.access_token
  const refreshToken = login.data.session?.refresh_token

  const result = NextResponse.json({
    success: true,
    message: "You are logged in.",
  })

  const secure = process.env.NODE_ENV === "production"

  result.cookies.set("sb-access-token", accessToken, {
    httpOnly: true,
    secure,
    sameSite: "strict",
    path: "/",
  })

  result.cookies.set("sb-refresh-token", refreshToken, {
    httpOnly: true,
    secure,
    sameSite: "strict",
    path: "/",
  })
  return result
}
