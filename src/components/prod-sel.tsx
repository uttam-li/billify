'use client'

import { useQuery } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { getProductsByOrgId } from "@/lib/actions";
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const formSchema = z.object({
    productId: z.string(),
    rate: z.number(),
    quantity: z.number(),
})

export default function ProductSelector({id, orgId}: {id: string, orgId: string}) {
    const [prodArray, setProdArray] = useState<z.infer<typeof formSchema>[]>([])

    const form = useForm<z.infer<typeof formSchema>>({
        mode: 'onChange',
        resolver: zodResolver(formSchema),
        defaultValues: {
            productId: '',
            rate: 0,
            quantity: 0,
        }
    })
    const isLoading = form.formState.isSubmitting
    const isValid = form.formState.isValid

    const { data: prodList } = useQuery({
        queryKey: ['prodList'],
        queryFn: async () => await getProductsByOrgId(orgId),
    })

    console.log(prodArray)

    const onSubmit = (value: z.infer<typeof formSchema>) => {
        setProdArray([...prodArray, value])
        form.reset()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                        disabled={isLoading}
                        control={form.control}
                        name="productId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Select Product</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Product" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {prodList?.map((p) => (
                                            <SelectItem key={p.id} value={p.id}>
                                                {p.name}
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
                    name="rate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Rate</FormLabel>
                            <FormControl>
                                <Input placeholder="Rate" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                                <Input placeholder="Quantity" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <button type="submit" disabled={!isValid || isLoading}>Add Product</button>
            </form> 
        </Form>
    )
}