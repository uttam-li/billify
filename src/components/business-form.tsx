import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
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
import { AxiosError } from "axios";
import { Business } from "@/types/schema";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z.string().min(3).max(100),
  gstno: z
    .string()
    .length(15)
    .regex(/^[a-zA-Z0-9]+$/),
  company_email: z.string().email(),
  company_phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  address: z.string().min(10).max(200), // required, min=10, max=200
  city: z.string().min(2).max(50),
  zip_code: z.string().length(6).regex(/^\d+$/),
  state: z.string().min(2).max(50),
  country: z.string().min(2).max(50),
  bank_name: z.string().min(3).max(100),
  account_no: z.string().min(9).max(18).regex(/^\d+$/),
  ifsc: z
    .string()
    .length(11)
    .regex(/^[a-zA-Z0-9]+$/),
  bank_branch: z.string().min(3).max(100),
});

type FormValues = z.infer<typeof formSchema>;

interface PageProps {
  goToNextPage?: () => void;
  initialValues?: Business;
  isNew?: boolean;
}

const BusinessForm = ({ goToNextPage, initialValues, isNew }: PageProps) => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const { id: bussID } = useParams();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialValues?.name || "",
      gstno: initialValues?.gstno || "",
      company_email: initialValues?.company_email || "",
      company_phone: initialValues?.company_phone || "",
      address: initialValues?.address || "",
      city: initialValues?.city || "",
      zip_code: initialValues?.zip_code || "",
      state: initialValues?.state || "",
      country: initialValues?.country || "",
      bank_name: initialValues?.bank_name || "",
      account_no: initialValues?.account_no || "",
      ifsc: initialValues?.ifsc || "",
      bank_branch: initialValues?.bank_branch || "",
    },
  });

  const createBusiness = useMutation({
    mutationFn: async (values: FormValues) => {
      const response = await axiosPrivate.post("/business", values);
      return response.data;
    },
    onSuccess: () => {
      console.log("Form Submit Success!");
      queryClient.refetchQueries({ queryKey: ["buss"] });
      setTimeout(() => {
        if (goToNextPage) {
          goToNextPage();
        }
      }, 1000);
    },
  });

  const updateBusiness = useMutation({
    mutationFn: async (values: FormValues) => {
      const response = await axiosPrivate.put(`/business`, {
        id: bussID,
        ...values,
      });
      return response.data;
    },
    onSuccess: () => {
      console.log("Form Update Success!");
      queryClient.refetchQueries({ queryKey: ["buss"] });
      setTimeout(() => {
        if (goToNextPage) {
          goToNextPage();
        }
      }, 1000);
    },
  });

  function onSubmit(values: FormValues) {
    const mutate = isNew ? createBusiness : updateBusiness;
    toast.promise(mutate.mutateAsync(values), {
      loading: isNew ? "Saving..." : "Updating...",
      success: `Business ${isNew ? "saved" : "updated"} successfully`,
      error: (err: AxiosError) => {
        if (err.response?.status === 409) {
          return "Business already exists";
        }
        return `An error occurred while ${isNew ? "saving" : "updating"}`;
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="container flex flex-col gap-2 mx-auto pt-5"
      >
        <div className="grid grid-cols-2 gap-4 items-baseline">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Amca Inc" required {...field} />
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
                <FormLabel>GST No</FormLabel>
                <FormControl>
                  <Input placeholder="" required {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4 items-baseline">
          <FormField
            control={form.control}
            name="company_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Email</FormLabel>
                <FormControl>
                  <Input placeholder="m@example.com" required {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company_phone"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
                <FormLabel>Company Phone</FormLabel>
                <FormControl className="w-full">
                  <PhoneInput
                    className="py-1"
                    placeholder=""
                    {...field}
                    defaultCountry="IN"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Abc Street ..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4 items-baseline">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="New Delhi" required {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="zip_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zip Code</FormLabel>
                <FormControl>
                  <Input placeholder="" required {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="Delhi" required {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="India" required {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 items-baseline">
          <FormField
            control={form.control}
            name="bank_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bank Name</FormLabel>
                <FormControl>
                  <Input placeholder="" required {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="account_no"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account No</FormLabel>
                <FormControl>
                  <Input placeholder="" required {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ifsc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IFSC</FormLabel>
                <FormControl>
                  <Input placeholder="" required {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bank_branch"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bank Branch</FormLabel>
                <FormControl>
                  <Input placeholder="" required {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className="mt-6 mb-2" type="submit">
          {isNew ? "Create" : "Update"}
        </Button>
      </form>
    </Form>
  );
};

export default BusinessForm;
