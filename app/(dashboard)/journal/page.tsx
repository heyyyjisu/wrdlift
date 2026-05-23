import { JournalForm } from "@/components/journalForm"
import { createClient } from "@/lib/auth/supabaseServer"
import { redirect } from "next/navigation"

export default async function JournalPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data) {
    redirect("/login")
  }

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-10 sm:px-6 md:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 border-b border-border pb-6">
            <p className="text-xs font-medium uppercase tracking-widest text-primary">
              {today}
            </p>
            <h1 className="mt-1 font-serif text-3xl font-bold sm:text-4xl">
              Today&apos;s Entry
            </h1>
          </div>
          <JournalForm />
        </div>
      </main>
    </div>
  )
}
