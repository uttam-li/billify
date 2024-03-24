import { Product } from "@prisma/client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { FileBox, Package } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import ProductsForm from "./prod-form";

export default function ProductsDialog({ prevData, isNew = false }: { prevData?: Product, isNew?: boolean }) {

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={isNew ? "default" : "secondary"} size={isNew ? "default" : "icon"} className="inline-flex gap-2 items-center">
                    {isNew ?
                        <>
                            <Package />
                            New Product
                        </>
                        :
                        <>
                            <FileBox />
                        </>
                    }
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[350px] md:w-[600px] h-[500px] md:h-auto overflow-auto">
                <ScrollArea>
                    <DialogHeader className='flex flex-col items-center my-2'>
                        <DialogTitle className="text-2xl inline-flex items-center justify-center gap-2">{isNew ? <>
                            <Package />
                            Add New Product
                        </> :
                            <>
                                <FileBox />
                                Edit Prodcuts
                            </>
                        }</DialogTitle>
                        <DialogDescription className="text-xs font-base">
                            {isNew ? "Fill in the form below to add a new product." : "Fill in the form below to edit the product details."}
                        </DialogDescription>
                    </DialogHeader>
                    <ProductsForm prevData={prevData} />
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}