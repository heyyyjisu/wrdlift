import Link from "next/link"
import { Button } from "./ui/button"
import { createClient } from "@/lib/auth/supabaseServer"
import LogoutButton from "./logoutButton"
import NavLinks from "./navLinks"
import Darkmode from "./darkmode"

export default async function Header() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const loggedIn = Boolean(data?.user)

  return (
    <header className="sticky z-20 flex items-center justify-between border-b border-border bg-background/90 px-4 py-4 backdrop-blur-sm sm:px-6 md:px-10">
      <div className="flex items-center gap-4">
        <Link
          href={loggedIn ? "/journal" : "/"}
          className="font-serif text-xl font-bold tracking-tight"
        >
          Wrdlift
        </Link>
        <Darkmode />
      </div>

      <div className="flex items-center gap-4">
        {!loggedIn ? (
          <>
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-foreground hover:underline"
            >
              Log in
            </Link>
            <Button asChild size="sm">
              <Link href="/signup">Get started</Link>
            </Button>
          </>
        ) : (
          <>
            <NavLinks loggedIn={loggedIn} />
            <LogoutButton />
          </>
        )}
      </div>
    </header>
  )
}
