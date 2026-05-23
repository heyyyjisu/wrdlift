"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "./ui/card"
import { Field, FieldGroup } from "./ui/field"
import { Textarea } from "./ui/textarea"
import { toast } from "sonner"
import { Spinner } from "./ui/spinner"
import { createClient } from "@/lib/auth/supabase"
import { Skeleton } from "./ui/skeleton"
import { highlightText } from "@/lib/highlight"
import Link from "next/link"
import { redirect, useRouter } from "next/navigation"

export function JournalForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [content, setContent] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [savedEntry, setSavedEntry] = useState<string>("")
  const [suggestions, setSuggestions] = useState<
    { originalWord: string; suggestedWord: string; explanation: string }[]
  >([])

  const router = useRouter()

  function getRepeatWords(text: string): { word: string; count: number }[] {
    if (!text) return []
    const words = text.trim().toLowerCase().split(/\s+/).filter(Boolean)
    const counts: Record<string, number> = {}
    words.forEach((w) => {
      counts[w] = (counts[w] || 0) + 1
    })
    return Object.entries(counts)
      .filter(([_, count]) => count > 1)
      .map(([word, count]) => ({ word, count: count as number }))
  }

  function countWords(text: string) {
    if (!text) return 0
    return text.trim().split(/\s+/).filter(Boolean).length
  }

  async function onSave(e: React.FormEvent<HTMLElement>) {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (!content) {
        toast.error("Please enter your journal")
        return
      }

      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      const accessToken = session?.access_token

      const res = await fetch("/api/users/journals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ content }),
      })

      const data = await res.json()

      if (!data.success) {
        toast.error("Failed to save the entry")
        return
      }

      toast.success("Journal saved successfully")

      const entry = data.data?.[0]
      setSavedEntry(entry?.content || "")
      setSuggestions(
        entry?.suggestions?.replacements || entry?.suggestions || []
      )

      setContent("")
    } catch (err) {
      console.error(err)
      toast.error("Log in failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const liveRepeated = getRepeatWords(content)
  const repeatedWords = getRepeatWords(savedEntry)
  const liveCounted = countWords(content)
  const countedWords = countWords(savedEntry)

  const ringCount = 16

  return (
    <div className="flex flex-col gap-6 lg:flex-row" {...props}>
      {/* Writing area - notebook page */}
      <div className="flex-1">
        <FieldGroup className="w-full">
          <Field>
            {isLoading ? (
              /* Loading skeleton - keeps notebook shape */
              <div className="relative overflow-hidden rounded-lg border border-border/60 bg-card shadow">
                <div className="absolute inset-y-0 left-0 hidden w-10 border-r border-border/40 bg-muted/20 sm:block" />
                <div className="sm:ml-10">
                  <div className="border-l-2 border-[#E8B0B0] dark:border-[#5A3838] sm:border-l-0 sm:border-l-0">
                    <div className="px-5 py-5 sm:pl-7">
                      <Skeleton className="mb-2 h-6 w-1/3" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                    <div className="px-5 pb-5 sm:pl-7">
                      <Skeleton className="min-h-72 w-full rounded-md" />
                      <Skeleton className="mt-3 h-9 w-20" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Notebook page */
              <div className="relative overflow-hidden rounded-lg border border-border/60 bg-card shadow">

                {/* Binding strip - visible sm+ */}
                <div className="absolute inset-y-0 left-0 hidden w-10 flex-col items-center gap-[1.45rem] overflow-hidden border-r border-border/40 bg-muted/20 py-[1.1rem] sm:flex">
                  {Array.from({ length: ringCount }).map((_, i) => (
                    <div
                      key={i}
                      className="relative h-[1.05rem] w-[1.05rem] flex-shrink-0 rounded-full border border-border/70 bg-background shadow-[inset_0_1px_3px_rgba(0,0,0,0.18)]"
                    >
                      <div className="absolute inset-[3px] rounded-full bg-muted/60" />
                    </div>
                  ))}
                </div>

                {/* Page content */}
                <div className="sm:ml-10">
                  {/* Margin line + content */}
                  <div className="sm:border-l-2 sm:border-l-[#E8B0B0] dark:sm:border-l-[#5A3838]">
                    <div className="px-5 pb-3 pt-5 sm:pl-6">
                      <div className="font-serif text-xl font-semibold">Today...</div>
                      <div className="mt-0.5 text-sm text-muted-foreground">
                        Write about your day, your thoughts, or something that inspired you.
                      </div>
                    </div>

                    <div className="px-5 pb-5 sm:pl-6">
                      <form onSubmit={onSave}>
                        <Field>
                          <Textarea
                            placeholder="Start writing..."
                            className="diary-lines min-h-56 w-full resize-none sm:min-h-80"
                            style={{
                              backgroundColor: "transparent",
                              border: "none",
                              borderRadius: 0,
                              boxShadow: "none",
                              paddingLeft: "4px",
                              paddingRight: "4px",
                              paddingTop: "0.4rem",
                              paddingBottom: "0.5rem",
                              outline: "none",
                            }}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            disabled={savedEntry !== ""}
                          />
                          <Button
                            type="submit"
                            disabled={isLoading || savedEntry !== ""}
                          >
                            {isLoading ? <Spinner>Saving...</Spinner> : "Save"}
                          </Button>
                        </Field>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Field>
        </FieldGroup>
      </div>

      {/* Right sidebar */}
      <div className="w-full space-y-4 lg:w-80">
        <Card className={savedEntry && !isLoading ? "bg-accent/60" : ""}>
          <CardContent className="min-h-36">
            {isLoading ? (
              <Skeleton className="box-border min-h-36 w-full rounded-md p-2" />
            ) : (
              highlightText(savedEntry, suggestions) || (
                <p className="text-muted-foreground">
                  {content ? content : "[Please enter your journal 📝]"}
                </p>
              )
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="text-sm font-medium">
              Word count:{" "}
              <span className="font-semibold text-foreground">
                {content.trim().length > 0 ? liveCounted : countedWords}
              </span>
            </div>
            <CardDescription>
              Repeated words:{" "}
              {savedEntry && !isLoading
                ? repeatedWords.length
                  ? repeatedWords.map((r) => r.word).join(", ")
                  : "None"
                : liveRepeated.length
                  ? liveRepeated.map((r) => r.word).join(", ")
                  : "None"}
            </CardDescription>
          </CardHeader>

          {savedEntry && !isLoading && (
            <CardContent>
              <p className="mb-3 text-xs font-medium uppercase tracking-widest text-primary">
                Suggestions
              </p>
              <ul className="space-y-2">
                {suggestions.map((s, i) => (
                  <li key={i} className="border-b border-border/50 pb-2 last:border-0">
                    <div className="flex items-center gap-1.5 font-medium">
                      <span>{s.originalWord}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="text-primary">{s.suggestedWord}</span>
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {s.explanation}
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          )}
        </Card>

        {savedEntry && (
          <Button
            onClick={() => {
              setSavedEntry("")
              setContent("")
              setSuggestions([])
            }}
          >
            Save a new journal
          </Button>
        )}
      </div>
    </div>
  )
}
