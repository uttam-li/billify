'use client'

import Loading from "@/components/loading"
import { getOrganizationById } from "@/lib/actions"
import { useQuery } from "@tanstack/react-query"
import { Box, Package, ReceiptIndianRupee, UserRound } from "lucide-react"
import Link from "next/link"

export default function OrganizationPage({ params }: { params: { orgId: string } }) {
  const { data: orgData } = useQuery({
    queryKey: ['org'],
    queryFn: async () => await getOrganizationById(params.orgId),
    staleTime: Infinity,
  })

  if (!orgData) return <Loading />

  return (
    <section className="flex flex-col justify-center items-center h-full w-full gap-2">
      <h1 className="text-3xl md:text-5xl font-bold text-blue-700">Welcome&#44;</h1>
      <h2 className="text-4xl md:text-6xl font-bold underline-blue">{orgData?.name}</h2>
      <p className="text-lg md:text-xl font-semibold text-gray-600">Get Started</p>
      <div className="flex flex-wrap items-center justify-center gap-5">
        <Link 
          href={`/organization/${orgData?.orgId}/invoice`}
          className="flex flex-col gap-2 items-center justify-center h-32 w-32 ring-4 rounded-lg text-xl"
        >
          <ReceiptIndianRupee size={46}/>
          Invoice
        </Link>
        <Link 
          href={`/organization/${orgData?.orgId}/customer`}
          className="flex flex-col gap-2 items-center justify-center h-32 w-32 ring-4 rounded-lg text-xl"
        >
          <UserRound size={46} />
          Customer
        </Link>
        <Link 
          href={`/organization/${orgData?.orgId}/invoice`}
          className="flex flex-col gap-2 items-center justify-center h-32 w-32 ring-4 rounded-lg text-xl"
        >
          <Package size={46} />
          Products
        </Link>
      </div>
    </section>
  )
}
