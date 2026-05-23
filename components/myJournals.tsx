"use client"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import type { Journal } from "@/lib/types/journal"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alertDialog"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card } from "./ui/card"
import { highlightText } from "@/lib/highlight"

export function MyJournals({
  initialJournals = [],
  page,
  pageCount,
  pageSize,
}: {
  initialJournals?: Journal[]
  page: number
  pageCount: number
  pageSize: number
}) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<Journal | null>(null)

  const router = useRouter()

  function truncate(text?: string) {
    if (!text) return ""
    return text.length > 60 ? text.slice(0, 60) + "..." : text
  }

  function toggleCheckbox(id: string, checked: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  const allSelected =
    initialJournals.length > 0 && selectedIds.size === initialJournals.length
  const someSelected =
    selectedIds.size > 0 && selectedIds.size < initialJournals.length

  function toggleSelectAll() {
    setSelectedIds((prev) =>
      prev.size === initialJournals.length
        ? new Set()
        : new Set(initialJournals.map((j) => j.id))
    )
  }

  async function onDelete(ids: string[]) {
    setIsLoading(true)
    ids.every((id) => typeof id === "string")
    const res = await fetch("/api/users/journals/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page, pageSize, ids }),
    })
    const data = await res.json()
    setIsLoading(false)
    if (!data.success) {
      toast.error("Failed to delete journal")
      return
    }
    const { deleteCount, remainingCount, remainingPageCount } = data
    toast.success(`${deleteCount} journal(s) deleted`)

    if (remainingPageCount === 0) {
      router.push(`?page=1&pageSize=${pageSize}`)
      return
    }
    if (page > remainingPageCount) {
      router.push(`?page=${remainingPageCount}&pageSize=${pageSize}`)
      return
    }
    setSelectedIds(new Set())
    router.refresh()
  }

  function onClickContent(e: React.MouseEvent, j: Journal) {
    e.stopPropagation()
    setActive(j)
    setOpen(true)
  }

  return (
    <div className="mx-auto w-full max-w-full px-4 md:max-w-6xl">
      {/* Mobile list/cards */}
      <div className="block md:hidden">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <Checkbox
              className="size-4"
              checked={
                allSelected ? true : someSelected ? "indeterminate" : false
              }
              onCheckedChange={() => toggleSelectAll()}
            />
            <span className="text-sm">Select All</span>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="flex items-center gap-2">
                <span className="text-sm">Delete</span>
                <Button
                  variant="destructive"
                  className="size-6"
                  disabled={selectedIds.size === 0}
                >
                  <Trash2 />
                </Button>
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure deleting selected journals?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your journals from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(Array.from(selectedIds))}
                  disabled={selectedIds.size === 0 || isLoading}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="space-y-3">
          {initialJournals.map((j) => {
            const shown = truncate(j.content)
            const shownMobile = j.content
              ? j.content.length > 20
                ? j.content.slice(0, 20) + "..."
                : j.content
              : ""
            return (
              <Card
                key={j.id}
                className="-mx-4 overflow-visible border-b border-border bg-transparent p-2 px-4 shadow-none ring-0 hover:bg-muted/50"
              >
                <div className="flex items-center gap-5">
                  <div className="self-center">
                    <Checkbox
                      className="size-4"
                      checked={selectedIds.has(j.id)}
                      onCheckedChange={(val) =>
                        toggleCheckbox(j.id, Boolean(val))
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="truncate p-0 text-left text-sm"
                            variant="ghost"
                            onClick={(e) => onClickContent(e, j)}
                          >
                            {shownMobile}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="flex max-h-[85vh] w-full flex-col overflow-hidden p-0 sm:max-w-xl">
                          <div className="px-6 pb-4 pt-6">
                            <DialogHeader>
                              <DialogTitle className="font-serif text-lg leading-snug">{shown}</DialogTitle>
                              <DialogDescription className="mt-1">
                                {j.createdAtIso ? (
                                  <time dateTime={j.createdAtIso}>
                                    {j.createdAtDisplay ??
                                      `${new Date(j.createdAtIso).toLocaleDateString("en-GB")} at ${new Date(j.createdAtIso).toLocaleTimeString("en-GB", { hour12: false })}`}
                                  </time>
                                ) : "-"}
                              </DialogDescription>
                            </DialogHeader>
                          </div>
                          <div className="h-px bg-border" />
                          <div className="no-scrollbar flex-1 overflow-y-auto px-6 py-5">
                            <div className="font-serif text-base leading-relaxed">
                              {active ? (
                                highlightText(
                                  active.content || "",
                                  Array.isArray(active.suggestions?.replacements)
                                    ? active.suggestions.replacements
                                    : []
                                )
                              ) : (
                                <p className="text-muted-foreground">No content</p>
                              )}
                            </div>
                            {active?.suggestions?.replacements &&
                              Array.isArray(active.suggestions.replacements) &&
                              active.suggestions.replacements.length > 0 && (
                                <div className="mt-6 border-t border-border pt-5">
                                  <p className="mb-3 text-xs font-medium uppercase tracking-widest text-primary">
                                    Suggestions
                                  </p>
                                  <ul className="space-y-3">
                                    {active.suggestions.replacements.map((r, i) => (
                                      <li key={i} className="text-sm">
                                        <div className="flex items-center gap-2">
                                          <span className="font-medium">{r.originalWord}</span>
                                          <span className="text-muted-foreground">→</span>
                                          <span className="font-medium text-primary">{r.suggestedWord}</span>
                                        </div>
                                        {r.explanation && (
                                          <p className="mt-0.5 text-xs text-muted-foreground">{r.explanation}</p>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="icon-sm"
                            className="mt-4 self-center"
                          >
                            <Trash2 />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you sure deleting the journal?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete your journal from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete([j.id])}
                              disabled={isLoading}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>

                    <div className="mt-1 text-xs text-muted-foreground">
                      {j.createdAtIso ? (
                        <time dateTime={j.createdAtIso}>
                          {j.createdAtDisplay ??
                            `${new Date(j.createdAtIso).toLocaleDateString("en-GB")} at ${new Date(j.createdAtIso).toLocaleTimeString("en-GB", { hour12: false })}`}
                        </time>
                      ) : (
                        "-"
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Desktop table for md+ */}
      <div className="hidden md:block">
        <Table className="w-full table-auto">
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 md:w-30">
                <div className="flex items-center gap-2.5">
                  <Checkbox
                    className="size-5.5"
                    checked={
                      allSelected
                        ? true
                        : someSelected
                          ? "indeterminate"
                          : false
                    }
                    onCheckedChange={() => toggleSelectAll()}
                  />
                  Select All
                </div>
              </TableHead>

              <TableHead className="max-w-[60vw] min-w-0 pl-6 md:max-w-none md:pl-3.5">
                Content
              </TableHead>
              <TableHead className="hidden w-36 text-left sm:table-cell md:w-48">
                Date
              </TableHead>
              <TableHead className="w-16 text-right">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <div className="flex items-center justify-end gap-2">
                      Delete
                      <Button
                        variant="destructive"
                        size="icon"
                        className="size-8"
                        disabled={selectedIds.size === 0}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure deleting selected journals?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your journals from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(Array.from(selectedIds))}
                        disabled={selectedIds.size === 0 || isLoading}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialJournals.map((j) => {
              const shown = truncate(j.content)
              return (
                <TableRow key={j.id}>
                  <TableCell className="w-12 md:w-30">
                    <Checkbox
                      checked={selectedIds.has(j.id)}
                      onCheckedChange={(val) =>
                        toggleCheckbox(j.id, Boolean(val))
                      }
                    />
                  </TableCell>
                  <TableCell className="w-full max-w-[60vw] min-w-0 font-medium md:max-w-3xl">
                    <div className="truncate">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="text-left"
                            variant="ghost"
                            onClick={(e) => {
                              onClickContent(e, j)
                            }}
                          >
                            {shown}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[85vh] w-full overflow-hidden p-0 md:max-w-xl">
                          <div className="px-8 pb-5 pt-8">
                            <DialogHeader>
                              <DialogTitle className="font-serif text-xl leading-snug">{shown}</DialogTitle>
                              <DialogDescription className="mt-1">
                                {j.createdAtIso ? (
                                  <time dateTime={j.createdAtIso}>
                                    {j.createdAtDisplay ??
                                      `${new Date(j.createdAtIso).toLocaleDateString("en-GB")} at ${new Date(j.createdAtIso).toLocaleTimeString("en-GB", { hour12: false })}`}
                                  </time>
                                ) : "-"}
                              </DialogDescription>
                            </DialogHeader>
                          </div>
                          <div className="h-px bg-border" />
                          <div className="no-scrollbar max-h-[55vh] overflow-y-auto px-8 py-6">
                            <div className="font-serif text-base leading-relaxed">
                              {active ? (
                                highlightText(
                                  active.content || "",
                                  Array.isArray(active.suggestions?.replacements)
                                    ? active.suggestions.replacements
                                    : []
                                )
                              ) : (
                                <p className="text-muted-foreground">No content</p>
                              )}
                            </div>
                            {active?.suggestions?.replacements &&
                              Array.isArray(active.suggestions.replacements) &&
                              active.suggestions.replacements.length > 0 && (
                                <div className="mt-6 border-t border-border pt-6">
                                  <p className="mb-4 text-xs font-medium uppercase tracking-widest text-primary">
                                    Suggestions
                                  </p>
                                  <ul className="space-y-4">
                                    {active.suggestions.replacements.map((r, i) => (
                                      <li key={i} className="text-sm">
                                        <div className="flex items-center gap-2">
                                          <span className="font-medium">{r.originalWord}</span>
                                          <span className="text-muted-foreground">→</span>
                                          <span className="font-medium text-primary">{r.suggestedWord}</span>
                                        </div>
                                        {r.explanation && (
                                          <p className="mt-1 text-xs text-muted-foreground">{r.explanation}</p>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                  <TableCell className="hidden w-36 sm:table-cell md:w-48">
                    {j.createdAtIso ? (
                      <time dateTime={j.createdAtIso}>
                        {" "}
                        {j.createdAtDisplay ??
                          `${new Date(j.createdAtIso).toLocaleDateString("en-GB")} at ${new Date(j.createdAtIso).toLocaleTimeString("en-GB", { hour12: false })}`}{" "}
                      </time>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="w-12 text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="size-8"
                        >
                          <Trash2 />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you sure deleting the journal?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your journal from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete([j.id])}
                            disabled={isLoading}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
