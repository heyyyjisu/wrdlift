import { Geist_Mono, Inter } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"
import Header from "@/components/header"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata = {
  title: {
    template: "%s | Wrdlift",
    default: "Wrdlift",
  },
  description:
    "  Write a quick entry each day and see your word count instantly. Get friendly, learner-focused suggestions to make your writing clearer, more natural, and more confident.",
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Header />
      <div className={cn("min-h-screen", inter.variable)}>
        <Toaster />
        <ThemeProvider>{children}</ThemeProvider>
      </div>
    </>
  )
}
