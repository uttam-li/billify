'use client'

import ProductsDialog from '@/components/prod-dialog'
import { Button } from '@/components/ui/button'
import { Table, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from '@/components/ui/use-toast'
import { deleteProductById, getOrganizationById, getProductsByOrgId } from '@/lib/actions'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import React from 'react'

export default function ProductsPage({params}: {params: {orgId: string}}) {
  
  const queryClient = useQueryClient()
  const { data: orgData} = useQuery({
    queryKey: ['org'],
    queryFn: async () => await getOrganizationById(params.orgId),
    staleTime: Infinity
  })

  const { data: prodList } = useQuery({
    queryKey: ['products'],
    queryFn: async () => await getProductsByOrgId(params.orgId),
    staleTime: Infinity
  })

  const deleteProduct = useMutation({
    mutationKey: ['deleteProd'],
    mutationFn: deleteProductById,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['products']})
      toast({
        variant: 'destructive',
        title: 'Product Deleted',
      })
    }
  })

  return (
   <main className='flex flex-col p-2 px-4'>
      <div className='flex items-center justify-evenly gap-2 my-2 mb-4'>
        <h1 className='text-2xl font-bold my-2'>Products</h1>
        <ProductsDialog isNew />
      </div>
      {
        prodList ?
          <Table className='max-w-[1200px] m-auto my-4'>
            <TableCaption>List of all the products at your company</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Selling Price</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className='w-10'>Edit</TableHead>
                <TableHead className='w-10'>Delete</TableHead>
              </TableRow>
            </TableHeader>
            {prodList?.length === 0 && <TableRow><TableCell colSpan={5} className='text-muted-foreground text-center'>No Products Available</TableCell></TableRow>}
            {prodList?.map((p) =>
              <TableRow key={p.id}>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>₹ {p.price}</TableCell>
                  <TableCell>{p.unit}</TableCell>
                  <TableCell><ProductsDialog prevData={p} /></TableCell>
                  <TableCell><Button variant="destructive" size="icon" onClick={() => deleteProduct.mutate(p.id)}><Trash2 /></Button></TableCell>
              </TableRow>
            )}
          </Table>
          :
          <p className='m-auto my-40 text-muted-foreground'>! No Products Available</p>
      }
    </main> 
  )
}
