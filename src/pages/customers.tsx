import { useEffect, useState } from "react";
import { PlusCircleIcon, SearchIcon, User2, Trash2Icon, EditIcon } from "lucide-react";

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
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CustomerForm from "@/components/customer-form";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Customer } from "@/types/schema";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(
    null
  );

  const { id: bussID } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>();

  const { data: customersData, isLoading: isCustomersLoading } = useQuery<
    Customer[]
  >({
    queryKey: ["customers", bussID],
    queryFn: async () => {
      const { data } = await axiosPrivate.get(`/customers/business/${bussID}`);
      return data.data;
    },
  });

  useEffect(() => {
    if (customersData != null) {
      setCustomers(customersData);
    }
  }, [customersData]);

  const deleteCustomer = useMutation({
    mutationFn: async (customerId: string) => {
      await axiosPrivate.delete(`/customers/${customerId}`);
    },
    onSuccess: () => {
      toast.success("Customer deleted successfully!");
      queryClient.refetchQueries({ queryKey: ["customers", bussID] });
      setIsDeleteDialogOpen(false);
      setCustomerToDelete(null);
    },
  });

  const handleCustomerDelete = (customerId: string) => {
    deleteCustomer.mutate(customerId);
  };

  const openDeleteDialog = (customer: Customer) => {
    setCustomerToDelete(customer);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setCustomerToDelete(null);
  };

  if (isCustomersLoading) {
    return <div>Loading...</div>;
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container w-full p-6">
      <div className="flex flex-col md:flex-row items-start justify-between my-10 gap-4">
        <h1 className="text-3xl font-bold">Customers</h1>
        <div className="flex flex-col items-end md:flex-row md:items-center gap-4 ml-auto">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircleIcon className="mr-2 h-4 w-4" /> Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogDescription>
                  Enter the details of the new customer here.
                </DialogDescription>
              </DialogHeader>
              <CustomerForm />
            </DialogContent>
          </Dialog>
          <div className="relative">
            <SearchIcon className="absolute px-0.5 left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search customers..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>
            Manage your customers and their information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!customersData ? (
            <div className="flex flex-col items-center justify-center gap-4 py-10">
              <User2 name="info" className="text-muted-foreground" />
              <p className="text-xl text-muted-foreground">
                No customer data available.
              </p>
            </div>
          ) : (
            <Table className="min-w-[600px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Pending Amount</TableHead>
                  <TableHead>Total Invoices</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => {
                  console.log(customer)
                  return <TableRow key={customer.id}>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell className="text-nowrap">₹ {customer.pending_amount}</TableCell>
                    <TableCell>{customer.total_invoices}</TableCell>
                    <TableCell className="inline-flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCustomer(customer)}
                      >
                       <EditIcon className="mr-2 h-4 w-4" /> Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => openDeleteDialog(customer)}
                      >
                        <Trash2Icon size="18" className="mr-1" /> Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {selectedCustomer && (
        <Dialog
          open={!!selectedCustomer}
          onOpenChange={() => setSelectedCustomer(undefined)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedCustomer.name}</DialogTitle>
              <DialogDescription>Customer Details</DialogDescription>
            </DialogHeader>
            <CustomerForm
              cusid={selectedCustomer.id}
              prevData={selectedCustomer}
            />
          </DialogContent>
        </Dialog>
      )}

      {customerToDelete && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={closeDeleteDialog}>
          <div className="m-4">
            {" "}
            {/* Add margin here */}
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete the customer{" "}
                  <strong>{customerToDelete.name}</strong>?
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-4 mt-4">
                <Button variant="outline" onClick={closeDeleteDialog}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleCustomerDelete(customerToDelete.id)}
                >
                  Delete
                </Button>
              </div>
            </DialogContent>
          </div>
        </Dialog>
      )}
    </div>
  );
}
