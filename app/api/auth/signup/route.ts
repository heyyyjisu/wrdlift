import { createClient } from "@/lib/auth/supabaseServer"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json()
  const { email, password } = body
  const signup = await supabase.auth.signUp({ email, password })

  if (signup.error || !signup.data.session) {
    return NextResponse.json(
      { success: false, message: "Invalid" },
      { status: 401 }
    )
  }

  const accessToken = signup.data.session?.access_token
  const res = NextResponse.json({
    success: true,
    messsage: "You are signed up",
  })
  res.cookies.set("token", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  })
  return res
}
