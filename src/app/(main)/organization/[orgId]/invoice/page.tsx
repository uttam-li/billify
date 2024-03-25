'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { deleteInvoiceById, getInvoicesByOrgId, getOrganizationById } from "@/lib/actions"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { FilePenLine, ReceiptIndianRupee, Trash } from "lucide-react"
import { useRouter } from "next/navigation"

export default function InvoicePage({ params }: { params: { orgId: string } }) {

  const queryClient = useQueryClient()
  const router = useRouter()
  const { data: orgData } = useQuery({
    queryKey: ['org'],
    queryFn: async () => await getOrganizationById(params.orgId),
    staleTime: Infinity,
  })
  const { data: invList } = useQuery({
    queryKey: ['invList'],
    queryFn: async () => await getInvoicesByOrgId(params.orgId),
  })

  const deleteInvoice = (id: string) => {
    const invDel = useMutation({
      mutationKey: ['deleteInvoice', id],
      mutationFn: async () => await deleteInvoiceById(id),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['invList']})
        toast({
          title: 'Invoice Deleted',
          description: 'Invoice has been deleted successfully',
          variant: 'destructive'
        })
      },
    })
  }
  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-evenly">
            <>
              <span className="inline-flex items-center gap-1">
                <ReceiptIndianRupee /> Invoice
              </span>
              <Button onClick={() => router.push(`/organization/${params.orgId}/invoice/form`)}>New Invoice</Button>
            </>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Discover all the invoices associated with your company</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice No</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Pdf</TableHead>
                <TableHead>Edit</TableHead>
                <TableHead>Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invList?.length === 0 && <TableRow><TableCell colSpan={7} className="text-muted-foreground text-center">No Invoices Available</TableCell></TableRow>}
              {invList?.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell>{inv.invoiceNo}</TableCell>
                  <TableCell>{new Date(inv.invDate).toLocaleDateString('en-IN')}</TableCell>
                  <TableCell>{inv.isPaid ? <Badge variant='default'>Paid</Badge> : <Badge variant='destructive'>Pending</Badge>}</TableCell>
                  <TableCell>{inv.totalAmount}</TableCell>
                  <TableCell><Button variant='secondary'>PDF</Button></TableCell>
                  <TableCell><Button variant='secondary' onClick={() => router.push(`/organization/${params.orgId}/invoice/form?id=${inv.id}`)}><FilePenLine className="mr-2" />Edit</Button></TableCell>
                  <TableCell><Button size='icon' variant='destructive' onClick={() => deleteInvoice(inv.id)}><Trash /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>

  )
}
