import { MyJournals } from "@/components/myJournals"

import { getJournals } from "@/lib/auth/actions"
import { createClient } from "@/lib/auth/supabaseServer"
import { redirect } from "next/navigation"
import type { Journal } from "@/lib/types/journal"
import { PaginationSimple } from "@/components/paginationSimple"

interface PageProps {
  searchParams: Promise<{
    page?: string
    pageSize?: string
    sortBy?: "created_at"
    query?: string
  }>
}

export default async function JournalsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const p = params.page
  const page = p ? Math.max(1, parseInt(p, 10) || 1) : 1
  const pageSize = Number(params.pageSize ?? 8)

  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    return redirect("/login")
  }

  const {
    data: journals,
    pageCount,
    page: effectivePage,
  } = await getJournals<Journal>(supabase, data.user.id, { page, pageSize })

  if (p && String(effectivePage) !== String(p)) {
    return redirect(`/journals?page=${effectivePage}&pageSize=${pageSize}`)
  }

  const journalsForClient: Journal[] = (journals ?? []).map((j: Journal) => ({
    ...j,
    createdAtIso: j.created_at ?? null,
    createdAtDisplay: j.created_at
      ? `${new Date(j.created_at).toLocaleDateString("en-GB")} at ${new Date(j.created_at).toLocaleTimeString("en-GB", { hour12: false })}`
      : null,
  }))

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-10 sm:px-6 md:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 border-b border-border pb-6">
            <p className="text-xs font-medium uppercase tracking-widest text-primary">
              My Collection
            </p>
            <h1 className="mt-1 font-serif text-3xl font-bold sm:text-4xl">
              Your Journals
            </h1>
          </div>
          <MyJournals
            initialJournals={journalsForClient}
            page={effectivePage}
            pageCount={pageCount}
            pageSize={pageSize}
          />
          <PaginationSimple
            page={effectivePage}
            pageCount={pageCount}
            pageSize={pageSize}
          />
        </div>
      </main>
    </div>
  )
}
