'use client'

import { getOrganizationById } from "@/lib/actions"
import { useQuery } from "@tanstack/react-query"

export default function OrganizationPage({params}:{params:{orgId: string}}) {
    const { data: org } = useQuery({
      queryKey: ['org'],
      queryFn: async () => await getOrganizationById(params.orgId),
      staleTime: Infinity,
    })

    return (
        <div>Organization: {org?.orgId}</div>
    )
}
