'use client'

import CustomerDialog from '@/components/cust-dialog'
import Loading from '@/components/loading'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from '@/components/ui/use-toast'
import { deleteCustomerById, getCustomersByOrgId, getOrganizationById } from '@/lib/actions'
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { Trash2, UserRound } from 'lucide-react'
import React from 'react'

export default function CustomerPage({ params }: { params: { orgId: string } }) {
  const queryClient = new QueryClient()
  const { data: orgData } = useQuery({
    queryKey: ['org'],
    queryFn: async () => await getOrganizationById(params.orgId),
    staleTime: Infinity
  })
  const { data: customerList, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => await getCustomersByOrgId(params.orgId),
    staleTime: Infinity
  })
  const deleteCustomer = useMutation({
    mutationKey: ['deleteCus'],
    mutationFn: deleteCustomerById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      toast({
        variant: 'destructive',
        title: 'Customer Deleted',
      })
    }
  })
  return (
    <main className='flex flex-col p-2 px-4'>
      <div className='flex items-center justify-evenly gap-2 my-2 mb-4'>
        <h1 className='text-2xl font-bold my-2'>Customers</h1>
        <CustomerDialog isNew />
      </div>
      {
        customerList ?
          <Table className='max-w-[1200px] m-auto my-4'>
            <TableCaption>Discover all the customers associated with your company</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Invoices</TableHead>
                <TableHead>Customers</TableHead>
                <TableHead>Due Amount</TableHead>
                <TableHead className='w-10'>Edit</TableHead>
                <TableHead className='w-10'>Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customerList?.length === 0 && !isLoading && <TableRow><TableCell colSpan={5} className='text-muted-foreground text-center'>No Customers Available</TableCell></TableRow>}
              {customerList?.map(({ Invoice, ...detail }) =>
                <TableRow key={detail.id}>
                  <TableCell>{Invoice.length}</TableCell>
                  <TableCell>{detail.name}</TableCell>
                  <TableCell>₹ {Invoice.map((i) => Number(i.totalAmount)).reduce((a, b) => a + b, 0)}</TableCell>
                  <TableCell><CustomerDialog prevData={detail} /></TableCell>
                  <TableCell><Button variant="destructive" size="icon" onClick={() => deleteCustomer.mutate(detail.id)}><Trash2 /></Button></TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          :
          <p className='m-auto my-40 text-muted-foreground'>! No Customers Available</p>
      }
    </main>
  )
}
