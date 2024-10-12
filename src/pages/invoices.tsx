import { useState } from "react";
import {
  PlusCircleIcon,
  SearchIcon,
  FileTextIcon,
  Trash2Icon,
  EditIcon,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import InvoiceForm from "@/components/invoice-form";
import { Customer, Invoice } from "@/types/schema";
import { format } from "date-fns";
import { toast } from "sonner";
import { Badge } from "../components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";

export function Invoices() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null); // State to manage PDF URL

  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const { id: bussID } = useParams<{ id: string }>();

  const { data: invoicesData, isLoading: isInvoicesLoading } = useQuery<
    Invoice[]
  >({
    queryKey: ["invoices", bussID],
    queryFn: async () => {
      const { data } = await axiosPrivate.get(`/invoices/business/${bussID}`);
      return data;
    },
  });

  const { data: customersData, isLoading: isCustomersLoading } = useQuery<
    Customer[]
  >({
    queryKey: ["customers", bussID],
    queryFn: async () => {
      const { data } = await axiosPrivate.get(`/customers/business/${bussID}`);
      return data.data;
    },
  });

  const deleteInvoice = useMutation({
    mutationFn: async (invoiceId: string) => {
      await axiosPrivate.delete(`/invoices/${invoiceId}`);
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["invoices", bussID] });
      toast.success("Invoice deleted successfully.");
      setIsDeleteDialogOpen(false);
      setInvoiceToDelete(null);
    },
  });

  const updateInvoiceStatus = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axiosPrivate.put(`/invoices/${id}/status`);
      return data;
    },
    onSuccess: (data, id) => {
      toast.success("Invoice status updated successfully");
      const invoiceToUpdate = invoicesData?.find(
        (invoice) => invoice.id === id
      );
      if (invoiceToUpdate) {
        invoiceToUpdate.is_paid = !invoiceToUpdate.is_paid;
      }
    },
    onError: () => {
      toast.error("Failed to update invoice status");
    },
  });

  if (isInvoicesLoading || isCustomersLoading) {
    return <div>Loading...</div>;
  }

  const handleInvoiceDelete = (invoiceId: string) => {
    deleteInvoice.mutate(invoiceId);
  };

  const handleStatusChange = (status: string) => {
    updateInvoiceStatus.mutate(status);
  };

  const openDeleteDialog = (invoice: Invoice) => {
    setInvoiceToDelete(invoice);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setInvoiceToDelete(null);
  };

  const openPDFDialog = async (invoiceId: string) => {
    try {
      const response = await axiosPrivate.get(`/invoices/${invoiceId}/pdf`, {
        responseType: "blob",
      });
      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfUrl);
    } catch (error: unknown) {
      console.error(error);
      toast.error("Failed to fetch PDF");
    }
  };

  const closePDFDialog = () => {
    setPdfUrl(null);
  };

  console.log("invoiceDate", invoicesData);
  console.log("customerData", customersData);

  const filteredInvoices = invoicesData?.filter(
    (invoice: Invoice) =>
      invoice.inv_no.toString().includes(searchTerm) ||
      (customersData
        ?.find((cust) => cust.id === invoice.cust_id)
        ?.name.toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
        (filterStatus === "All" ||
          (invoice.is_paid ? "Paid" : "Pending") === filterStatus))
  );

  return (
    <div className="container p-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 my-10">
        <h1 className="text-3xl font-bold">Invoices</h1>
        <div className="flex flex-col-reverse md:flex-row-reverse items-end gap-4">
          <div className="relative">
            <SearchIcon className="absolute p-0.5 left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search invoices..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select> */}
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircleIcon className="mr-2 h-4 w-4" /> Create Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Create New Invoice</DialogTitle>
                <DialogDescription>
                  Enter the details of the new invoice here.
                </DialogDescription>
              </DialogHeader>
              <InvoiceForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice List</CardTitle>
          <CardDescription>
            Manage your invoices and their statuses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices?.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.inv_no}</TableCell>
                  <TableCell>
                    {
                      customersData?.find((cust) => cust.id == invoice.cust_id)
                        ?.name
                    }
                  </TableCell>
                  <TableCell className="text-nowrap">
                    ₹ {invoice.total_amount}
                  </TableCell>
                  <TableCell>
                    {format(invoice.inv_date, "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>
                    {format(invoice.due_date, "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <DialogTrigger asChild>
                              <button className="border-none bg-none p-0">
                                <Badge
                                  className="text-md cursor-pointer"
                                  variant={
                                    invoice.is_paid
                                      ? "green"
                                      : new Date(invoice.due_date) < new Date()
                                      ? "overdue"
                                      : "unpaid"
                                  }
                                >
                                  {invoice.is_paid
                                    ? "Paid"
                                    : new Date(invoice.due_date) < new Date()
                                    ? "Overdue"
                                    : "Pending"}
                                </Badge>
                              </button>
                            </DialogTrigger>
                          </TooltipTrigger>
                          <TooltipContent className="p-2 bg-primary-foreground text-secondary-foreground rounded-md shadow-lg">
                            Click to change status
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <DialogContent className="p-6 shadow-lg rounded-md">
                        <DialogTitle>Change Invoice Status</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to change the status of this
                          invoice?
                        </DialogDescription>
                        <div className="flex flex-col md:flex-row gap-4 mt-4">
                          <DialogClose asChild>
                            <Button
                              size="lg"
                              variant="secondary"
                              className="w-full"
                              onClick={() => handleStatusChange(invoice.id)}
                            >
                              Yes
                            </Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button
                              className="w-full"
                              size="lg"
                              variant="outline"
                            >
                              No
                            </Button>
                          </DialogClose>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell className="inline-flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedInvoice(invoice)}
                    >
                      <EditIcon className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openPDFDialog(invoice.id)}
                    >
                      <FileTextIcon className="mr-2 h-4 w-4" /> View PDF
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => openDeleteDialog(invoice)}
                    >
                      <Trash2Icon size="18" className="mr-1" /> Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedInvoice && (
        <Dialog
          open={!!selectedInvoice}
          onOpenChange={() => setSelectedInvoice(null)}
        >
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Invoice {selectedInvoice.inv_no}</DialogTitle>
              <DialogDescription>Invoice Details</DialogDescription>
            </DialogHeader>
            <InvoiceForm
              inv_id={selectedInvoice.id}
              prevData={selectedInvoice}
            />
          </DialogContent>
        </Dialog>
      )}

      {invoiceToDelete && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={closeDeleteDialog}>
          <div className="m-4">
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete the invoice{" "}
                  <strong>{invoiceToDelete.inv_no}</strong>?
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-4 mt-4">
                <Button variant="outline" onClick={closeDeleteDialog}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleInvoiceDelete(invoiceToDelete.id)}
                >
                  Delete
                </Button>
              </div>
            </DialogContent>
          </div>
        </Dialog>
      )}

      {pdfUrl && (
        <Dialog open={!!pdfUrl} onOpenChange={closePDFDialog}>
          <DialogContent className="max-w-7xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Invoice PDF</DialogTitle>
            </DialogHeader>
            <iframe
              src={pdfUrl}
              width="100%"
              height="600px"
              title="Invoice PDF"
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
