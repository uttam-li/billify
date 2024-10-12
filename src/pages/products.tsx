import { useEffect, useState } from "react";
import { PlusCircleIcon, SearchIcon, Package, Trash2Icon } from "lucide-react";

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
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Product } from "@/types/schema";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ProductForm from "@/components/product-form";
import { toast } from "sonner";

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const { id: bussID } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product>();

  const { data: productsData, isLoading: isProductsLoading } = useQuery<
    Product[]
  >({
    queryKey: ["products", bussID],
    queryFn: async () => {
      const { data } = await axiosPrivate.get(`/products/business/${bussID}`);
      return data.data;
    },
  });

  useEffect(() => {
    if (productsData != null) {
      setProducts(productsData);
    }
  }, [productsData]);

  const deleteProduct = useMutation({
    mutationFn: async (productId: string) => {
      await axiosPrivate.delete(`/products/${productId}`);
    },
    onSuccess: () => {
      toast.success("Product deleted successfully!");
      queryClient.refetchQueries({ queryKey: ["products", bussID] });
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    },
  });

  const handleProductDelete = (productId: string) => {
    deleteProduct.mutate(productId);
  };

  const openDeleteDialog = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  if (isProductsLoading) {
    return <div>Loading...</div>;
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.hsn_code.includes(searchTerm)
  );

  return (
    <div className="container w-full p-6">
      <div className="flex flex-col md:flex-row items-start justify-between my-10 gap-4">
        <h1 className="text-3xl font-bold">Products</h1>
        <div className="flex flex-col items-end md:flex-row md:items-center gap-4 ml-auto">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircleIcon className="mr-2 h-4 w-4" /> Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Enter the details of the new product here.
                </DialogDescription>
              </DialogHeader>
              <ProductForm />
            </DialogContent>
          </Dialog>
          <div className="relative">
            <SearchIcon className="absolute p-0.5 left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
          <CardDescription>
            Manage your products and their information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!productsData ? (
            <div className="flex flex-col items-center justify-center gap-4 py-10">
              <Package name="info" className="text-muted-foreground" />
              <p className="text-xl text-muted-foreground">
                No product data available.
              </p>
            </div>
          ) : (
            <Table className="min-w-[600px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Tax Rate</TableHead>
                  <TableHead>HSN Code</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell className="text-nowrap">
                      ₹ {product.price}
                    </TableCell>
                    <TableCell>{product.tax_rate}%</TableCell>
                    <TableCell>{product.hsn_code}</TableCell>
                    <TableCell>{product.unit}</TableCell>
                    <TableCell className="inline-flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedProduct(product)}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => openDeleteDialog(product)}
                      >
                        <Trash2Icon size="18" className="mr-1" /> Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {selectedProduct && (
        <Dialog
          open={!!selectedProduct}
          onOpenChange={() => setSelectedProduct(undefined)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedProduct.name}</DialogTitle>
              <DialogDescription>Product Details</DialogDescription>
            </DialogHeader>
            <ProductForm
              productId={selectedProduct.id}
              prevData={selectedProduct}
            />
          </DialogContent>
        </Dialog>
      )}

      {productToDelete && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={closeDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the product{" "}
                <strong>{productToDelete.name}</strong>?
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-4 mt-4">
              <Button variant="outline" onClick={closeDeleteDialog}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleProductDelete(productToDelete.id)}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}