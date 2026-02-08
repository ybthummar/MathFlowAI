import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/layout/theme-provider"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Toaster } from "@/components/ui/toaster"
import { SplashScreen } from "@/components/layout/splash-screen"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MathFlow AI | MATH for AI Club",
  description: "MathFlow AI - A flagship event by MATH for AI Club. Join the ultimate Math and AI escape room challenge. Form your team and compete!",
  keywords: ["MathFlow", "MATH for AI", "MATH for AI Club", "math", "AI", "escape room", "hackathon", "college event", "technical event"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SplashScreen>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </SplashScreen>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
