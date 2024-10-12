import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Product } from "@/types/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useParams } from "react-router-dom";
import { IndianRupeeIcon, PercentIcon } from "lucide-react";

type ProductFormProps = {
  productId?: string;
  prevData?: Product;
};

const formSchema = z.object({
  name: z.string(),
  price: z.preprocess((val) => Number(val), z.number().positive()),
  tax_rate: z.preprocess((val) => Number(val), z.number().min(0).max(100)),
  hsn_code: z.string().length(4),
  unit: z.string(),
});

type productSchema = z.infer<typeof formSchema>;

const dummyData = {
  name: "Sample Product",
  price: 100,
  tax_rate: 10,
  hsn_code: "1234",
  unit: "kg",
};

function ProductForm({ productId, prevData }: ProductFormProps) {
  const { id: bus_id } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  const isEditMode = !!productId;

  const form = useForm<productSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: prevData?.name || dummyData.name,
      price: prevData?.price || dummyData.price,
      tax_rate: prevData?.tax_rate || dummyData.tax_rate,
      hsn_code: prevData?.hsn_code || dummyData.hsn_code,
      unit: prevData?.unit || dummyData.unit,
    },
  });

  const createProduct = useMutation({
    mutationFn: async (values: productSchema) => {
      const { data } = await axiosPrivate.post("/products", {
        bus_id,
        ...values,
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["products"] });
    },
  });

  const updateProduct = useMutation({
    mutationFn: async (values: productSchema) => {
      const { data } = await axiosPrivate.put(`/products`, {
        id: productId,
        ...values,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["products"] });
    },
  });

  function onSubmit(values: productSchema) {
    const mutation = isEditMode ? updateProduct : createProduct;
    toast.promise(mutation.mutateAsync(values), {
      loading: isEditMode ? "Updating..." : "Saving...",
      success: `Product ${values.name} ${
        isEditMode ? "updated" : "saved"
      } successfully`,
      error: (err) => {
        if (err.response?.status === 409) {
          return "Product already exists";
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
                  <Input placeholder="Product Name" required {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <div className="relative">
                    <IndianRupeeIcon className="absolute p-1 left-2 top-1/2 transform -translate-y-1/2" />
                    <Input
                      type="number"
                      placeholder="100"
                      required
                      {...field}
                      className="pl-8" // Add padding to the left to make space for the icon
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tax_rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax Rate</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="5"
                      required
                      {...field}
                      className="pl-10" // Add padding to the right to make space for the icon
                    />
                    <PercentIcon className="absolute p-1 left-2 top-1/2 transform -translate-y-1/2" />
                  </div>
                </FormControl>
                <FormDescription>
                  Enter tax rate in percentage(0-100)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hsn_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>HSN Code</FormLabel>
                <FormControl>
                  <Input placeholder="1234" required {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <FormControl>
                  <Input placeholder="" required {...field} />
                </FormControl>
                <FormDescription>
                  Enter the unit of the product (e.g. KGS, L, M)
                </FormDescription>
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

export default ProductForm;
