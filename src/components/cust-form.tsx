'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { Customer, Organization } from "@prisma/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import Loading from "./loading"
import { DialogClose } from "./ui/dialog"
import { v4 } from "uuid"
import { upsertCustomer } from "@/lib/actions"
import { toast } from "./ui/use-toast"

const formSchema = z.object({
    name: z.string().min(2, { message: "Customer name should be atleast 2 characters." }),
    gstno: z.string().min(1),
    email: z.string().email().min(1),
    phone: z.string().min(1),
    baddress: z.string().min(1),
    saddress: z.string().min(1),
})

export default function CustomerForm({ prevData }: { prevData?: Customer }) {

    const queryClient = useQueryClient()
    const orgData: Organization | undefined = queryClient.getQueryData(['org'])
    if (orgData === undefined) return null
    const form = useForm<z.infer<typeof formSchema>>({
        mode: "onChange",
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: prevData?.name || "",
            gstno: prevData?.gstno || "",
            email: prevData?.email || "",
            phone: prevData?.phone || "",
            baddress: prevData?.baddress || "",
            saddress: prevData?.saddress || "",
        },
    })

    const isLoading = form.formState.isSubmitting
    const isValid = form.formState.isValid

    const onSubmit = useMutation({
        mutationKey: ["customer"],
        mutationFn: async (values: z.infer<typeof formSchema>) => await upsertCustomer({
            id: prevData?.id || v4(),
            organizationId: prevData?.organizationId || orgData?.orgId,
            name: values.name,
            gstno: values.gstno,
            email: values.email,
            phone: values.phone,
            baddress: values.baddress,
            saddress: values.saddress,
            createdAt: prevData?.createdAt || new Date(),
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers"] })
            toast({
                title: "Customer Saved"
            })
            form.reset()
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message
            })
        }
    })
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => onSubmit.mutate(data))}
                className="flex flex-col gap-2 w-full"
            >
                <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="p-1">
                            <FormLabel>Customer Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Customer Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="gstno"
                    render={({ field }) => (
                        <FormItem className="p-1">
                            <FormLabel>GST No:</FormLabel>
                            <FormControl>
                                <Input placeholder="Customer GST No" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                <div className="md:grid grid-cols-2">
                    <FormField
                        disabled={isLoading}
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="p-1">
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Customer Email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    <FormField
                        disabled={isLoading}
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem className="p-1">
                                <FormLabel>Phone No:</FormLabel>
                                <FormControl>
                                    <Input placeholder="Customer Phone No" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                </div>
                <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="baddress"
                    render={({ field }) => (
                        <FormItem className="p-1">
                            <FormLabel>Billing Address</FormLabel>
                            <FormControl>
                                <Input placeholder="Billing Address" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="saddress"
                    render={({ field }) => (
                        <FormItem className="p-1">
                            <FormLabel>Shipping Address</FormLabel>
                            <FormControl>
                                <Input placeholder="Shipping Address" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                <DialogClose>
                    <Button type="submit" disabled={isLoading || !isValid} className="my-2 w-full">
                        {isLoading ? <Loading /> : "Submit"}
                    </Button>
                </DialogClose>

            </form>

        </Form>
    )
}