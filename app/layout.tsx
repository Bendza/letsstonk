import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SolStock AI - Tokenized Stock Trading on Solana",
  description:
    "AI-powered robo-advisor for trading real stocks as tokens on Solana blockchain. Automated portfolio management with Backed Finance xStocks.",
  keywords: "solana, stocks, trading, defi, robo-advisor, tokenized securities, backed finance",
    generator: 'v0.dev'
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
          <div className="min-h-screen w-full">{children}</div>
        </Providers>
      </body>
    </html>
  )
}
