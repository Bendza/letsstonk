interface SolscanLogoProps {
  className?: string
}

export function SolscanLogo({ className = "h-4 w-4" }: SolscanLogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
      <path d="M8 9h8v2H8zm0 4h8v2H8z"/>
      <circle cx="12" cy="12" r="2" fill="white"/>
    </svg>
  )
} 