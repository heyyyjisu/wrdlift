import Link from "next/link"

export default function Page() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-12 sm:py-16">

        {/* Hero */}
        <section className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-primary">
            English Learning Journal
          </p>
          <h1 className="font-serif text-5xl font-bold leading-tight sm:text-7xl">
            Write more.<br />Speak better.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Write a quick entry each day and get instant word counts. Receive
            learner-focused suggestions to make your English clearer, more
            natural, and more confident.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center rounded-lg bg-primary px-6 py-3 text-base font-medium text-primary-foreground transition-all duration-150 hover:bg-primary/85 active:scale-[0.98]"
            >
              Get started - it&apos;s free
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center rounded-lg border border-border bg-background px-6 py-3 text-base font-medium transition-all duration-150 hover:bg-muted active:scale-[0.98]"
            >
              Log in
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-8 shadow-sm transition-shadow hover:shadow-md">
            <p className="mb-3 text-3xl">📖</p>
            <h3 className="font-serif text-lg font-semibold">Word Count</h3>
            <p className="mt-2 text-base text-muted-foreground">
              See your entry length instantly to track progress over time.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-8 shadow-sm transition-shadow hover:shadow-md">
            <p className="mb-3 text-3xl">✨</p>
            <h3 className="font-serif text-lg font-semibold">Smart Suggestions</h3>
            <p className="mt-2 text-base text-muted-foreground">
              Tips aimed at non-native speakers for clearer, more natural English.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-8 shadow-sm transition-shadow hover:shadow-md">
            <p className="mb-3 text-3xl">📝</p>
            <h3 className="font-serif text-lg font-semibold">Tone & Grammar</h3>
            <p className="mt-2 text-base text-muted-foreground">
              Corrections and tone advice so your writing matches your intent.
            </p>
          </div>
        </section>

      </main>
    </div>
  )
}
