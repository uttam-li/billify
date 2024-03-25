'use client'

import { getCustomersByOrgId, getInvoiceById, getInvoiceItemById, getProductsByOrgId, upsertInvoice, upsertInvoiceItem } from "@/lib/actions";
import { Customer, Invoice, InvoiceItem, Organization, Product } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { format, set } from "date-fns";
import { CalendarIcon, Plus, Slice, Trash2 } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { Input } from "./ui/input";
import { v4 } from "uuid";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "./ui/table";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { toast } from "./ui/use-toast";
import Loading from "./loading";

const formSchema = z.object({
    invoiceNo: z.number().min(1, { message: "Invoice No should be atleast 1." }),
    customerId: z.string().min(1),
    invDate: z.date(),
    dueDate: z.date()
})

export default function InvoiceForm({ orgData, prevData }: { orgData: Organization, prevData?: Invoice }) {

    const queryClient = useQueryClient()
    const [selectedProd, setSelectedProd] = useState('')
    const [prodQty, setProdQty] = useState(0)
    const [prodPrice, setProdPrice] = useState(0)
    const [invItem, setInvItem] = useState<InvoiceItem[]>([])
    const [invId] = useState<string>(prevData?.id || v4())
    
    const { data } = useQuery({
        queryKey: ['data'],
        queryFn: async () => {
            const custList: Customer[] | undefined = await getCustomersByOrgId(orgData.orgId);
            const prodList: Product[] | undefined = await getProductsByOrgId(orgData.orgId);
            const prevInvItem: InvoiceItem[] | undefined = await getInvoiceItemById(invId);
            
            return { custList, prodList, prevInvItem };
        },
        enabled: !!orgData.orgId && !!invId,
        staleTime: 1000 * 60 * 5
    })
    
    const { custList , prodList, prevInvItem } = data as { custList: Customer[], prodList: Product[], prevInvItem: InvoiceItem[] } | undefined || {};
    
    const form = useForm<z.infer<typeof formSchema>>({
        mode: 'onChange',
        resolver: zodResolver(formSchema),
        defaultValues: {
            invoiceNo: prevData?.invoiceNo || 0,
            customerId: prevData?.customerId || '',
            invDate: prevData?.invDate || new Date(),
            dueDate: prevData?.dueDate || new Date(),
        }
    })

    const isLoading = form.formState.isSubmitting
    const isValid = form.formState.isValid
    const isEmpty = invItem.length === 0
    
    const deleteInvItem = (id: string) => {
        const newItem = invItem.filter((item) => item.id !== id)
        setInvItem(newItem)
    }
    
    const totalAmount = useMemo(() => {
        return invItem?.reduce((acc, item) => {
            const prodItem = prodList?.find((p) => p.id === item.productId)
            const taxAmt = prodItem?.taxRate ? (prodItem?.taxRate / 100) * (item.quantity * item.unitPrice) : 0
            const taxableAmt = item.quantity * item.unitPrice
            const totalAmt = taxableAmt + taxAmt
            return acc + totalAmt
        }, 0)
    }, [invItem, prodList]);

    console.log('total', totalAmount)
    console.log('invItem', invItem)

    useEffect(() => {
        if (prevInvItem) {
            setInvItem(prevInvItem);
        }
    }, [prevInvItem]);

    const onSubmit = useMutation({
        mutationKey: ['createInvoice'],
        mutationFn: async (data: z.infer<typeof formSchema>) => {
            const newInvoice = await upsertInvoice({
                id: invId,
                invoiceNo: data.invoiceNo,
                organizationId: orgData.orgId,
                customerId: data.customerId,
                totalAmount: totalAmount,
                invDate: data.invDate || new Date(),
                dueDate: data.dueDate || new Date(),
                isPaid: false,
                createdAt: prevData?.createdAt || new Date(),
                paidDate: null
            })
            const newInvItem = invItem.map(async (item) => {
                await upsertInvoiceItem({
                    id: item.id,
                    invoiceId: invId,
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice
                })
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['invoiceList']})
            queryClient.invalidateQueries({queryKey: ['invItem']})
            toast({
                title: "Success",
                description: "Invoice generated successfully",
            })
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: 'destructive'
            })
        }
    })

    return (
        <Form {...form}>
            <form onSubmit={
                form.handleSubmit((data) => onSubmit.mutate(data))} className="flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-5 p-1">
                    <FormField
                        disabled={isLoading}
                        control={form.control}
                        name="invoiceNo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Invoice No</FormLabel>
                                <FormControl>
                                    <Input placeholder="Invoice No" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        disabled={isLoading}
                        control={form.control}
                        name="customerId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Select Customer</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Customer" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {custList?.map((c) => (
                                            <SelectItem key={c.id} value={c.id}>
                                                {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />
                    <FormField
                        disabled={isLoading}
                        control={form.control}
                        name="invDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Invoice Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "dd-MM-yyyy")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={isLoading}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )} />
                    <FormField
                        disabled={isLoading}
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Due Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "dd-MM-yyyy")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={isLoading}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Separator className="my-2" />
                <div className="grid grid-cols-2 gap-x-1 gap-5 p-1 my-2">
                    <Select onValueChange={(value) => setSelectedProd(value)}>
                        <SelectTrigger>
                            <SelectValue placeholder='select a product' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Products</SelectLabel>
                                {prodList?.map((p) => (
                                    <SelectItem key={p.id} value={p.id}>
                                        {p.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Button
                        className="w-[100px] ml-auto gap-1"
                        disabled={selectedProd === '' || prodQty === 0 || prodPrice === 0}
                        onClick={() => {
                            setInvItem([...invItem, {
                                id: v4(),
                                invoiceId: invId,
                                productId: selectedProd,
                                quantity: prodQty,
                                unitPrice: prodPrice
                            }])
                            setSelectedProd('')
                            setProdQty(0)
                            setProdPrice(0)
                        }}><Plus /> Product</Button>
                    {
                        selectedProd !== '' &&
                        <>
                            <div className="flex flex-col gap-2">
                                <Label>Quantity</Label>
                                <Input placeholder="Quantity" type="number" value={prodQty} onChange={(e) => setProdQty(Number(e.target.value))} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>Price</Label>
                                <Input placeholder="Price" type="number" value={prodPrice} onChange={(e) => setProdPrice(Number(e.target.value))} />
                            </div>
                        </>
                    }
                </div>
                <Table className="overflow-y-auto">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product Name</TableHead>
                            <TableHead>Rate&#047;Item</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Taxable Amt</TableHead>
                            <TableHead>Tax Amt</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead className='w-10'>Delete</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invItem?.length === 0 && !isLoading && <TableRow><TableCell colSpan={7} className='text-muted-foreground text-center'>No Products Added</TableCell></TableRow>}
                        {invItem?.map((item) => {
                            const prodItem = prodList?.find((p) => p.id === item.productId)
                            const taxAmt = prodItem?.taxRate ? (prodItem?.taxRate / 100) * (item.quantity * item.unitPrice) : 0
                            const taxableAmt = item.quantity * item.unitPrice
                            const totalAmt = taxableAmt + taxAmt
                            return (
                                <TableRow key={item.id}>
                                    <TableCell>{prodItem?.name}</TableCell>
                                    <TableCell>{prodItem?.taxRate}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>₹ {taxableAmt}</TableCell>
                                    <TableCell>{taxAmt} &#40; {prodItem?.taxRate}% &#41;</TableCell>
                                    <TableCell>₹ {totalAmt}</TableCell>
                                    <TableCell><Button variant="destructive" size="icon" onClick={() => deleteInvItem(item.id)}><Trash2 /></Button></TableCell>
                                </TableRow>
                            )
                        }
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={5}>Total Amount</TableCell>
                            <TableCell>₹ {totalAmount}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
                <Separator className="my-2" />
                <Button type="submit" disabled={isLoading || !isValid || isEmpty } className="my-2 max-w-[300px] m-auto w-full">Generate Invoice</Button>
            </form>
        </Form >
    )
}