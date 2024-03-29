'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { v4 } from 'uuid'
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertOrganization } from "@/lib/actions";
import { Organization } from "@prisma/client";
import { toast } from "./ui/use-toast";
import { DialogClose } from "@radix-ui/react-dialog";
import { useSession } from "next-auth/react";
import { Separator } from "./ui/separator";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Company name should be atleast 2 characters.",
  }),
  gstno: z.string().min(1),
  companyEmail: z.string().email().min(1),
  companyPhone: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  zipCode: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  bankName: z.string().min(1),
  bankBranch: z.string().min(1),
  accountNo: z.string().min(1).max(12),
  ifsc: z.string().min(1)
});

export default function OrganizationForm({ prevData, inDialog = false }: { prevData?: Organization, inDialog?: boolean }) {

  const queryClient = useQueryClient();
  const { data: session } = useSession()

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: prevData?.name || "",
      gstno: prevData?.gstno || "",
      companyEmail: prevData?.companyEmail || "",
      companyPhone: prevData?.companyPhone || "",
      address: prevData?.address || "",
      city: prevData?.city || "",
      zipCode: prevData?.zipCode || "",
      state: prevData?.state || "",
      country: prevData?.country || "",
      bankName: prevData?.bankName || "",
      bankBranch: prevData?.bankBranch || "",
      accountNo: prevData?.accountNo || "",
      ifsc: prevData?.ifsc || ""
    },
  });

  const isLoading = form.formState.isSubmitting;
  const isValid = form.formState.isValid;

  const onSubmit = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => await upsertOrganization({
      orgId: prevData?.orgId || v4(),
      gstno: values.gstno,
      userId: session?.user.id as string,
      name: values.name,
      companyEmail: values.companyEmail,
      companyPhone: values.companyPhone,
      address: values.address,
      city: values.city,
      zipCode: values.zipCode,
      state: values.state,
      country: values.country,
      createdAt: prevData?.createdAt || new Date(),
      updatedAt: new Date(),
      bankName: values.bankName,
      bankBranch: values.bankBranch,
      accountNo: values.accountNo,
      ifsc: values.ifsc
    }),
    mutationKey: ['orgs', form.getValues().name],
    onSuccess: () => {
      toast({
        title: 'Organization Saved',
      })
      queryClient.invalidateQueries({ queryKey: ['orgs'] })
      queryClient.invalidateQueries({ queryKey: ['org'] })  
    }
  })

  if (!session) return null


  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data, event) => onSubmit.mutate(data))}
        className="flex flex-col gap-2 p-1"
      >
        <FormField
          disabled={isLoading}
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="ABC Ltd" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled={isLoading}
          control={form.control}
          name="gstno"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GST No</FormLabel>
              <FormControl>
                <Input placeholder="Company GST" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid md:grid-cols-2 gap-2">
          <FormField
            disabled={isLoading}
            control={form.control}
            name="companyEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Email</FormLabel>
                <FormControl>
                  <Input placeholder="xyz@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={isLoading}
            control={form.control}
            name="companyPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+91XXXXXXXXXX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          disabled={isLoading}
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="ABC Street ......" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="md: grid grid-cols-2 gap-2">
          <FormField
            disabled={isLoading}
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Surat" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={isLoading}
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ZIP Code</FormLabel>
                <FormControl>
                  <Input placeholder="39XXXX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={isLoading}
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="Gujarat" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={isLoading}
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="India" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        <FormField
          disabled={isLoading}
          control={form.control}
          name="bankName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bank Name</FormLabel>
              <FormControl>
                <Input placeholder="HDFC Bank" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
          <FormField
            disabled={isLoading}
            control={form.control}
            name="accountNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account No</FormLabel>
                <FormControl>
                  <Input placeholder="1234567890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        <FormField
          disabled={isLoading}
          control={form.control}
          name="bankBranch"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bank Branch</FormLabel>
              <FormControl>
                <Input placeholder="Surat" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled={isLoading}
          control={form.control}
          name="ifsc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>IFSC</FormLabel>
              <FormControl>
                <Input placeholder="HDFC0001234" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        {inDialog ? (
          <DialogClose asChild>
            <Button disabled={isLoading || !isValid} className="mt-4" type="submit">Submit</Button>
          </DialogClose>
        ) : (

          <Button disabled={isLoading || !isValid} className="mt-4 w-full max-w-[250px] mx-auto" type="submit">Submit</Button>
        )}
      </form>
    </Form>
  );
}
