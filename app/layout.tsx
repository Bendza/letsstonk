import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "sonner"
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LetsStonk - Tokenized Stock Trading on Solana",
  description:
    "Trade real stocks as tokens on Solana blockchain. Access S&P 500 stocks 24/7 with instant settlement and professional trading tools.",
  keywords: "solana, stocks, trading, defi, tokenized securities, backed finance, xstocks, letsstonk",
  generator: 'v0.dev',
  metadataBase: new URL('https://letsstonk.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "LetsStonk - Tokenized Stock Trading on Solana",
    description: "Trade real stocks as tokens on Solana. 24/7 access to S&P 500 stocks with instant settlement.",
    url: 'https://letsstonk.app',
    siteName: 'LetsStonk',
    images: [
      {
        url: '/logo-solstock.webp',
        width: 1200,
        height: 630,
        alt: 'LetsStonk - Tokenized Stock Trading on Solana',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "LetsStonk - Tokenized Stock Trading on Solana",
    description: "Trade real stocks as tokens on Solana. 24/7 access to S&P 500 stocks with instant settlement.",
    images: ['/logo-solstock.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/image.webp',
    shortcut: '/image.webp',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full overflow-x-hidden`}>
        <Providers>
          <SidebarProvider defaultOpen={true}>
            <div className="min-h-screen w-full">{children}</div>
          </SidebarProvider>
          <Toaster 
            position="bottom-right" 
            theme="dark"
            className="toaster group"
            toastOptions={{
              classNames: {
                toast: "group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
                description: "group-[.toast]:text-muted-foreground",
                actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
                cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
              },
            }}
          />
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
