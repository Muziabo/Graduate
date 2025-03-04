'use client'

import AdminHeader from '@/components/admin/AdminHeader'
import Footer from '@/components/Footer'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!session) {
      router.push('/admin/login')
    } else if (session.user.role !== 'ADMIN' && session.user.role !== 'INSTITUTION_ADMIN') {
      router.push('/admin/login')
    }
  }, [session, router])

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'INSTITUTION_ADMIN')) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  )
}
