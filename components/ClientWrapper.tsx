'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  useEffect(() => {
    // Any client-side initialization can go here
  }, [pathname])

  return <>{children}</>
}
