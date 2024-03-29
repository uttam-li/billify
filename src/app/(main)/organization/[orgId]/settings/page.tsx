"use client";

import Loading from "@/components/loading";
import OrganizationForm from "@/components/org-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrganizationById } from "@/lib/actions";
import { useQuery } from "@tanstack/react-query"
import { NotebookPen } from "lucide-react";

export default function SettinsPage({ params }: { params: { orgId: string } }) {
  const { data: orgData, isLoading } = useQuery({
    queryKey: ['org'],
    queryFn: async () => await getOrganizationById(params.orgId),
    staleTime: Infinity
  })

  return (
    <Card className="max-w-[900px] m-2 md:m-auto">
      <CardHeader className="flex items-center">
        <CardTitle className="inline-flex gap-2"><NotebookPen />Edit Company</CardTitle>
        <CardDescription>Update your company details from the form below</CardDescription>
      </CardHeader>
      <CardContent>
      {!isLoading && orgData ? <OrganizationForm prevData={orgData} /> : <Loading />}
      </CardContent>
    </Card>
  )
}
