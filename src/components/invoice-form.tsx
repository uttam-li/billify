import { v4 as uuidv4 } from "uuid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Trash2Icon, PlusCircleIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Customer, Invoice, Product } from "@/types/schema";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const formSchema = z.object({
  id: z.string().optional(),
  inv_no: z.preprocess((val) => Number(val), z.number().positive()),
  cust_id: z.string().uuid(),
  total_amount: z.number().positive(),
  inv_date: z.date(),
  due_date: z.date(),
  is_paid: z.boolean().optional(),
  paid_date: z.date().optional(),
  items: z.array(
    z.object({
      // id: z.string().uuid().optional(),
      prod_id: z.string().uuid(),
      quantity: z.number().positive(),
      unit_price: z.number().positive(),
      tax_rate: z.number().positive().optional(),
    })
  ),
});

type InvoiceFormSchema = z.infer<typeof formSchema>;

interface InvoiceFormProps {
  inv_id?: string;
  prevData?: Invoice;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ inv_id, prevData }) => {
  const { id: buss_id } = useParams<{ id: string }>();
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const isEditMode = !!inv_id;

  const { data: customersData, isLoading: isLoadingCustomerData } = useQuery<
    Customer[]
  >({
    queryKey: ["customers", buss_id],
    queryFn: async () => {
      const { data } = await axiosPrivate.get(`/customers/business/${buss_id}`);
      return data.data;
    },
  });

  const { data: nextInvNo, isLoading: isNextInvLoading } = useQuery<number>({
    queryKey: ["nextInvNo", buss_id],
    queryFn: async () => {
      const { data } = await axiosPrivate.get(
        `/invoices/next-invoice-no/${buss_id}`
      );
      return data.next_invoice_number;
    },
    enabled: !isEditMode,
  });

  const { data: productsData, isLoading: isLoadingProductData } = useQuery<
    Product[]
  >({
    queryKey: ["products", buss_id],
    queryFn: async () => {
      const { data } = await axiosPrivate.get(`/products/business/${buss_id}`);
      return data.data;
    },
  });

  const form = useForm<InvoiceFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: prevData?.id || uuidv4(),
      inv_no: prevData?.inv_no || 0,
      cust_id: prevData?.cust_id || "",
      total_amount: prevData?.total_amount || 0,
      inv_date: prevData?.inv_date ? new Date(prevData.inv_date) : new Date(),
      due_date: prevData?.due_date ? new Date(prevData.due_date) : new Date(),
      is_paid: prevData?.is_paid || false,
      items: prevData?.items || [],
    },
  });

  useEffect(() => {
    if (nextInvNo && !isEditMode) {
      form.setValue("inv_no", nextInvNo);
    }
  }, [nextInvNo, isEditMode, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const [selectedProduct, setSelectedProduct] = useState<string | undefined>(
    undefined
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [unitPrice, setUnitPrice] = useState<number>(0);

  const createInvoice = useMutation({
    mutationFn: async (values: InvoiceFormSchema) => {
      const { data } = await axiosPrivate.post("/invoices", {
        bus_id: buss_id,
        ...values,
        inv_date: values.inv_date.toISOString(),
        due_date: values.due_date.toISOString(),
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["invoices", buss_id] });
      queryClient.refetchQueries({ queryKey: ["nextInvNo", buss_id] });
    },
  });

  const updateInvoice = useMutation({
    mutationFn: async (values: InvoiceFormSchema) => {
      const { data } = await axiosPrivate.put(`/invoices`, {
        bus_id: buss_id,
        ...values,
        inv_date: values.inv_date.toISOString(),
        due_date: values.due_date.toISOString(),
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["invoices", buss_id] });
    },
  });

  const calculateTaxableAmount = (quantity: number, unitPrice: number) => {
    return quantity * unitPrice;
  };

  const calculateTaxAmount = (taxableAmount: number, taxRate: number) => {
    return (taxableAmount * taxRate) / 100;
  };

  const calculateTotalAmount = (taxableAmount: number, taxAmount: number) => {
    return taxableAmount + taxAmount;
  };

  const calculateTotals = useCallback(() => {
    let totalTaxableAmount = 0;
    let totalTaxAmount = 0;
    let totalAmount = 0;

    fields.forEach((item) => {
      const taxableAmount = calculateTaxableAmount(
        item.quantity,
        item.unit_price
      );
      const product = productsData?.find(
        (product) => product.id === item.prod_id
      );
      const taxAmount = calculateTaxAmount(
        taxableAmount,
        product?.tax_rate || 0
      );
      totalTaxableAmount += taxableAmount;
      totalTaxAmount += taxAmount;
      totalAmount += calculateTotalAmount(taxableAmount, taxAmount);
    });

    return { totalTaxableAmount, totalTaxAmount, totalAmount };
  }, [fields, productsData]);

  const { totalTaxableAmount, totalTaxAmount, totalAmount } = calculateTotals();

  useEffect(() => {
    const { totalAmount } = calculateTotals();
    form.setValue("total_amount", totalAmount);
  }, [fields, form, calculateTotals]);

  if (isLoadingCustomerData || isLoadingProductData || isNextInvLoading) {
    return <div>Loading...</div>;
  }

  if (!customersData || !productsData) return null;

  const onSubmit = (values: InvoiceFormSchema) => {
    const mutation = inv_id ? updateInvoice : createInvoice;
    toast.promise(mutation.mutateAsync(values), {
      loading: inv_id ? "Updating..." : "Saving...",
      success: `Invoice ${inv_id ? "updated" : "saved"} successfully`,
      error: (err: AxiosError) => {
        if (err.response?.status === 409) {
          return "Invoice already exists";
        }
        return `An error occurred while ${inv_id ? "updating" : "saving"}`;
      },
    });
  };

  const isItemValid = () => {
    return selectedProduct && quantity > 0 && unitPrice > 0;
  };

  const handleAddItem = () => {
    if (isItemValid()) {
      const product = productsData?.find((p) => p.id === selectedProduct);
      if (product) {
        append({
          prod_id: selectedProduct!,
          quantity,
          unit_price: unitPrice,
          tax_rate: product.tax_rate,
        });
        setSelectedProduct(undefined);
        setQuantity(1);
        setUnitPrice(0);
      }
    }
  };

  return (
    <ScrollArea className="max-h-[70vh]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full px-2"
        >
          <div className="grid md:grid-cols-2 gap-4 px-1">
            <FormField
              control={form.control}
              name="inv_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice No</FormLabel>
                  <FormControl>
                    <Input placeholder="Invoice No" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cust_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customersData?.map(
                          (customer: { id: string; name: string }) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.name}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="inv_date"
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
                            format(field.value, "dd MMM yyyy")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto z-50 p-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                        className="rounded-lg"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="due_date"
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
                            format(field.value, "dd MMM yyyy")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto z-50 p-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator className="my-4" />
          <div className="flex flex-col gap-4 md:flex-row md:justify-between">
            <Select onValueChange={setSelectedProduct} value={selectedProduct}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Product" />
              </SelectTrigger>
              <SelectContent>
                {productsData?.map(
                  (product: { id: string; name: string; price: number }) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
            <Button
              onClick={handleAddItem}
              disabled={!isItemValid()}
              className="w-full md:w-auto"
            >
              <PlusCircleIcon className="mr-2 h-4 w-4" /> Add Item
            </Button>
          </div>
          {selectedProduct && (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Unit Price</Label>
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full md:w-auto"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  placeholder="Unit Price"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(Number(e.target.value))}
                  className="w-full md:w-auto"
                />
              </div>
            </div>
          )}
          <Table className="min-w-[600px] overflow-auto">
            <TableHeader>
              <TableRow>
                <TableHead> &#35;</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Rate/Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Taxable Amt</TableHead>
                <TableHead>Tax Amt</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.length ? (
                fields.map((item, index) => {
                  const product = productsData?.find(
                    (product) => product.id === item.prod_id
                  );
                  const taxableAmount = calculateTaxableAmount(
                    item.quantity,
                    item.unit_price
                  );
                  const taxAmount = calculateTaxAmount(
                    taxableAmount,
                    product?.tax_rate || 0
                  );
                  const totalAmount = calculateTotalAmount(
                    taxableAmount,
                    taxAmount
                  );

                  return (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {product?.name || "Unknown Product"}
                      </TableCell>
                      <TableCell>{item.unit_price}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{taxableAmount.toFixed(2)}</TableCell>
                      <TableCell>
                        {taxAmount.toFixed(2)} &#40;{product?.tax_rate}%&#41;
                      </TableCell>
                      <TableCell>{totalAmount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => remove(index)}
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-muted-foreground"
                  >
                    No items added. Please add items above.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4} className="text-right font-bold">
                  Total
                </TableCell>
                <TableCell>{totalTaxableAmount.toFixed(2)}</TableCell>
                <TableCell>{totalTaxAmount.toFixed(2)}</TableCell>
                <TableCell>{totalAmount.toFixed(2)}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableFooter>
          </Table>
          <Button
            // disabled={fields.length == 0 || form.formState.isValid}
            className="mt-5"
            onClick={() => console.log("Form Error", form.formState.errors)}
            type="submit"
            size="lg"
          >
            Submit
          </Button>
        </form>
      </Form>
    </ScrollArea>
  );
};

export default InvoiceForm;
