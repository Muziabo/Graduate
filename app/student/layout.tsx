'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/student/login')
    } else if (session?.user?.role !== 'STUDENT') {
      router.push('/student/login')
    }
  }, [session, status, router])

  if (status === "loading" || !session || session.user.role !== 'STUDENT') {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  )
}
