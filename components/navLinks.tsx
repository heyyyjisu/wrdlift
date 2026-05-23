"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function NavLinks({ loggedIn }: { loggedIn: boolean }) {
  const pathname = usePathname() ?? "/"

  if (!loggedIn) return null

  const linkClass =
    "cursor-pointer text-sm hover:text-muted-foreground hover:underline sm:inline-block"

  if (pathname === "/journals") {
    return (
      <Link href="journal" className={linkClass}>
        Add journal
      </Link>
    )
  }

  return (
    <Link href="/journals" className={linkClass}>
      My journals
    </Link>
  )
}
