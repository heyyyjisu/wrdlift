import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import Header from "@/components/header"

export const metadata = {
  title: {
    template: "%s | Wrdlift",
    default: "Wrdlift",
  },
  description:
    "Write a quick entry each day and see your word count instantly. Get friendly, learner-focused suggestions to make your writing clearer, more natural, and more confident.",
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Header />
      <div className="min-h-screen">
        <Toaster />
        <ThemeProvider>{children}</ThemeProvider>
      </div>
    </>
  )
}
