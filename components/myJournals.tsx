"use client"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2 } from "lucide-react"
import { useCallback, useState } from "react"
import type { Journal } from "@/lib/types/journal"
import { useRouter } from "next/navigation"

export function MyJournals({
  initialJournals = [],
}: {
  initialJournals?: Journal[]
}) {
  const [journals, setJournals] = useState<Journal[]>(initialJournals)

  const router = useRouter()
  const navigateToPage = useCallback(
    (pageIndex: number) => {
      const url = new URL(window.location.href)
      url.searchParams.set("page", String(pageIndex + 1))
      router.push(url.pathname + url.search)
    },
    [router]
  )

  function truncate(journal?: string) {
    if (!journal) return ""
    return journal.length > 100 ? journal.slice(0, 100) + "..." : journal
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Select</TableHead>
          <TableHead>Content</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Delete</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {journals.map((j) => {
          const shown = truncate(j.content)
          return (
            <TableRow key={j.id}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell className="font-medium">{shown}</TableCell>
              <TableCell>
                {j.createdAtIso ? (
                  <time dateTime={j.createdAtIso}>
                    {j.createdAtDisplay ??
                      new Date(j.createdAtIso).toLocaleString("en-GB", {
                        hour12: false,
                      })}
                  </time>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="destructive" size="icon" className="size-8">
                  <Trash2 />
                </Button>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
