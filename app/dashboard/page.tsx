"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to markets page since it's our main page
    router.replace('/dashboard/markets')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="text-center">
        <div className="text-lg text-gray-600">Redirecting to Markets...</div>
      </div>
    </div>
  )
} 