import { MyJournals } from "@/components/myJournals"
import { PaginationSimple } from "@/components/paginationSimple"
import { getJournals } from "@/lib/auth/actions"
import { createClient } from "@/lib/auth/supabaseServer"
import { redirect } from "next/navigation"
import type { Journal } from "@/lib/types/journal"

interface PageProps {
  searchParams: Promise<{
    page?: string
    pageSize?: string
    sort_by?: "created_at" | "title"
    query?: string
  }>
}

export default async function JournalsPage({
  searchParams: rawSearchParams,
}: PageProps) {
  const searchParams = await rawSearchParams
  const rawPage = searchParams.page
  const page = rawPage ? Math.max(1, parseInt(rawPage, 10) || 1) : 1
  const pageSize = Number(searchParams.pageSize ?? 8)

  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    return redirect("/login")
  }

  const { data: journals, pageCount } = await getJournals<Journal>(
    supabase,
    data.user.id,
    { page, pageSize }
  )

  const journalsForClient: Journal[] = (journals ?? []).map((j: Journal) => ({
    ...j,
    createdAtIso: j.created_at ?? null,
    createdAtDisplay: j.created_at
      ? new Date(j.created_at).toLocaleString("en-GB", { hour12: false })
      : null,
  }))

  return (
    <div className="landing-gradient min-h-screen bg-background text-foreground">
      <div className="decorative-blobs" aria-hidden />

      <main className="relative z-10 container mx-auto mb-8 px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <h1 className="hero-gradient-text mb-6 text-3xl font-extrabold">
            Your Journals
          </h1>

          <div className="feature-card rounded-lg bg-indigo-50 p-6 shadow-xl dark:bg-indigo-900/40">
            <MyJournals initialJournals={journalsForClient} />
            <PaginationSimple
              page={page}
              pageCount={pageCount}
              pageSize={pageSize}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
