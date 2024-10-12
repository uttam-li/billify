import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { PhoneInput } from "@/components/ui/phone-input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Customer } from "@/types/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useParams } from "react-router-dom";

type CustomerFormProps = {
  cusid?: string;
  prevData?: Customer;
};

const formSchema = z.object({
  name: z.string(),
  gstno: z
    .string()
    .length(15)
    .regex(/^[a-zA-Z0-9]+$/),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  b_address: z.string().min(10).max(200),
  s_address: z.string().min(10).max(200),
});

type customerSchema = z.infer<typeof formSchema>;

// const dummyData1 = {
//   name: "John Doe",
//   gstno: "12ABCDE3456FGHI",
//   email: "john.doe@example.com",
//   phone: "+12345678901",
//   b_address: "123 Business St, Business City, BC 12345",
//   s_address: "456 Shipping Ln, Shipping Town, ST 67890",
// };

// const dummyData2 = {
//   name: "Jane Smith",
//   gstno: "98ZYXWV5432UTSR",
//   email: "jane.smith@example.com",
//   phone: "+19876543210",
//   b_address: "789 Commerce Ave, Commerce City, CC 98765",
//   s_address: "321 Delivery Rd, Delivery Town, DT 54321",
// };

const dummyData3 = {
  name: "Alice Johnson",
  gstno: "34LMNOP6789QRST",
  email: "alice.johnson@example.com",
  phone: "+11234567890",
  b_address: "101 Trade Blvd, Trade City, TC 10101",
  s_address: "202 Freight St, Freight Town, FT 20202",
};

function CustomerForm({ cusid, prevData }: CustomerFormProps) {
  const { id: bus_id } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  const isEditMode = !!cusid;
  console.log(
    "PrevCustomerData: ", prevData
  )
  const form = useForm<customerSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: prevData?.name || dummyData3.name,
      gstno: prevData?.gstno || dummyData3.gstno,
      email: prevData?.email || dummyData3.email,
      phone: prevData?.phone || dummyData3.phone,
      b_address: prevData?.b_address || dummyData3.b_address,
      s_address: prevData?.s_address || dummyData3.s_address,
    },
  });

  const createCustomer = useMutation({
    mutationFn: async (values: customerSchema) => {
      const { data } = await axiosPrivate.post("/customers", {
        bus_id,
        ...values,
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["customers"] });
    },
  });

  const updateCustomer = useMutation({
    mutationFn: async (values: customerSchema) => {
      const { data } = await axiosPrivate.put(`/customers`, {
        id: cusid,
        bus_id,
        ...values,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["customers"] });
    },
  });

  function onSubmit(values: customerSchema) {
    const mutation = isEditMode ? updateCustomer : createCustomer;
    toast.promise(mutation.mutateAsync(values), {
      loading: isEditMode ? "Updating..." : "Saving...",
      success: `Customer ${values.name} ${
        isEditMode ? "updated" : "saved"
      } successfully`,
      error: (err) => {

        if (err.response?.status === 409) {
          return "Customer already exists";
        }
        return `An error occurred while ${isEditMode ? "updating" : "saving"}`;
      },
    });
  }

  return (
    <ScrollArea className="max-h-[70vh]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 max-w-3xl mx-auto px-1"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" required {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gstno"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GST NO</FormLabel>
                <FormControl>
                  <Input placeholder="" required {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="m@example.com" required {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
                <FormLabel>Phone</FormLabel>
                <FormControl className="w-full">
                  <PhoneInput placeholder="" {...field} defaultCountry="IN" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="b_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Billing Address</FormLabel>
                <FormControl>
                  <Textarea placeholder="" className="resize-none" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="s_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sender Address</FormLabel>
                <FormControl>
                  <Textarea placeholder="" className="resize-none" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button size="lg" className="w-full" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </ScrollArea>
  );
}

export default CustomerForm;
