import { Organization, Product } from "@prisma/client";
import { z } from 'zod'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "./ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import Loading from "./loading";
import { upsertProduct } from "@/lib/actions";
import { v4 } from "uuid";
import { toast } from "./ui/use-toast";

const formSchema = z.object({
    name: z.string().min(2, { message: "Product name should be atleast 2 characters." }),
    price: z.number().min(1),
    taxRate: z.number().min(1),
    unit: z.string().min(1),
    hsnCode: z.string().min(1),
})

export default function ProductsForm({ prevData }: { prevData?: Product }) {

    const queryClient = useQueryClient()
    const orgData: Organization | undefined = queryClient.getQueryData(['org'])
    if (orgData === undefined) return null
    const form = useForm<z.infer<typeof formSchema>>({
        mode: 'onChange',
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: prevData?.name || "",
            price: prevData?.price || 0,
            taxRate: prevData?.taxRate || 0,
            unit: prevData?.unit || "",
            hsnCode: prevData?.hsnCode || "",
        }
    })

    const isLoading = form.formState.isSubmitting
    const isValid = form.formState.isValid

    const onSubmit = useMutation({
        mutationKey: ['product'],
        mutationFn: async (values: z.infer<typeof formSchema>) => await upsertProduct({
            id: prevData?.id || v4(),
            organizationId: prevData?.organizationId || orgData?.orgId,
            name: values.name,
            price: values.price,
            taxRate: values.taxRate,
            unit: values.unit,
            hsnCode: values.hsnCode,
            createdAt: prevData?.createdAt || new Date()
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['products']})
            toast({
                title: 'Product Saved'
            })
        },
        onError: (error: any) => {
            toast({
                variant: 'destructive',
                title: 'ERROR',
                description: error.message
            })
        }
    })

    return (
        <Form {...form}>
            <form
                className="flex flex-col gap-2 w-full p-1"
                onSubmit={form.handleSubmit((data) => onSubmit.mutate(data))}>
                <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Product Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price/Rate &#40; ₹ &#41; </FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="taxRate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tax Rate &#40; % &#41;</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Unit</FormLabel>
                            <FormControl>
                                <Input placeholder="KGS" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="hsnCode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>HSN&#47;SAC Code</FormLabel>
                            <FormControl>
                                <Input placeholder="Product HSN/SAC Code" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <DialogClose asChild>
                    <Button type="submit" disabled={isLoading || !isValid} className="my-2 w-full">
                        {isLoading ? <Loading /> : "Submit"}
                    </Button>
                </DialogClose>
            </form>
        </Form>
    )
}