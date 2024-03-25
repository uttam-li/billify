'use client'

import InvoiceForm from "@/components/inv-form"
import Loading from "@/components/loading"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getInvoiceById, getOrganizationById } from "@/lib/actions"
import { Invoice } from "@prisma/client"
import { QueryClient, useQuery } from "@tanstack/react-query"
import { FilePenLine, ReceiptIndianRupee } from "lucide-react"
import { useSearchParams } from "next/navigation"

export default function NewInvoicePage({ params }: { params: { orgId: string } }) {

    const searchParams = useSearchParams()
    const id = searchParams.get('id')
    const { data: orgData, isLoading: isLoadingOrgData } = useQuery({
        queryKey: ['org'],
        queryFn: async () => await getOrganizationById(params.orgId),
        staleTime: 1000 * 60 * 5
    })
    const { data: prevData, isLoading: isLoadingPrevData } = useQuery({
        queryKey: ['prevData'],
        queryFn: async () => await getInvoiceById(id as string),
        enabled: !!id,
        staleTime: 1000 * 60 * 5
    })
    console.log('id', id !== '')
    if (isLoadingOrgData || isLoadingPrevData ) return <Loading />
    return (
        <Card className="md:max-w-[900px] m-auto p-2 mb-5">
            <CardHeader className="flex items-center">
                <CardTitle className="inline-flex text-3xl items-center gap-2">
                    {id ?
                        <>
                            <FilePenLine />
                            Edit Invoice
                        </>
                        :
                        <>
                            <ReceiptIndianRupee />
                            New Invoice
                        </>
                    }
                </CardTitle>
                <CardDescription>
                    {id ?
                        <>
                            Change the details of the invoice below
                        </>
                        :
                        <>
                            Fill the form to create a new invoice
                        </>
                    }
                </CardDescription>
            </CardHeader>
            <InvoiceForm orgData={orgData!} prevData={prevData ?? undefined} />
        </Card>
    )
}