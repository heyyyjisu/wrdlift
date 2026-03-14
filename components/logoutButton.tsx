"use client"

import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { createClient } from "@/lib/auth/supabase"

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "same-origin",
    })

    router.push("/")
  }
  return <Button onClick={handleLogout}>Log out</Button>
}
