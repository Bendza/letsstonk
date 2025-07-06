"use client"

import { TrendingUp } from "lucide-react"

interface LogoProps {
  className?: string
  showText?: boolean
}

export function Logo({ className = "", showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-10 h-10 bg-gray-900 flex items-center justify-center">
        <TrendingUp className="h-6 w-6 text-white" />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className="font-bold text-xl leading-none tracking-tight">SOLSTOCK AI</span>
          <span className="text-xs text-gray-500 leading-none uppercase tracking-wide">ROBO-ADVISOR</span>
        </div>
      )}
    </div>
  )
}
