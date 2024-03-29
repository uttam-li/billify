'use client'

import Loading from '@/components/loading'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function Layout({children}: {children: React.ReactNode}) {
    const {data: session, status } = useSession()
    const router = useRouter()
    if (status === 'loading') return <Loading />
    if (!session) {
        router.push('/')
    }
  return (
    <div>{children}</div>
  )
}
