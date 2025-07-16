import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { SidebarProvider } from "@/components/ui/sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SolStock - AI Robo-advisor - Tokenized Stock Trading on Solana",
  description:
    "AI-powered robo-advisor for trading real stocks as tokens on Solana blockchain. Automated portfolio management with Backed Finance xStocks.",
  keywords: "solana, stocks, trading, defi, robo-advisor, tokenized securities, backed finance",
  generator: 'v0.dev',
  metadataBase: new URL('https://solstock.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "SolStock - AI Robo-advisor for Tokenized Stock Trading",
    description: "Trade real stocks as tokens on Solana with AI-powered portfolio management",
    url: 'https://solstock.app',
    siteName: 'SolStock',
    images: [
      {
        url: '/placeholder-logo.png',
        width: 1200,
        height: 630,
        alt: 'SolStock - Tokenized Stock Trading on Solana',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "SolStock - AI Robo-advisor for Tokenized Stock Trading",
    description: "Trade real stocks as tokens on Solana with AI-powered portfolio management",
    images: ['/placeholder-logo.png'],
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
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
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
        </Providers>
      </body>
    </html>
  )
}
