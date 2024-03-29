import { UserCog, UserRoundPlus } from "lucide-react"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { ScrollArea } from "./ui/scroll-area"
import CustomerForm from "./cust-form"
import { Customer } from "@prisma/client"

export default function CustomerDialog({ prevData, isNew = false }: { prevData?: Customer, isNew?: boolean }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={isNew ? "default" : "secondary"} size={isNew ? "default" : "icon"} className="inline-flex gap-2 items-center">
                    {isNew ?
                        <>
                            <UserRoundPlus />
                            New Customer
                        </>
                        :
                        <>
                            <UserCog />
                        </>
                    }
                </Button>
            </DialogTrigger>
            <DialogContent className="min-w-[350px] w-auto h-[500px] md:h-auto overflow-auto">
                <ScrollArea>
                    <DialogHeader className='flex flex-col items-center my-2'>
                        <DialogTitle className="text-2xl inline-flex items-center justify-center gap-2">{isNew ? <>
                            <UserRoundPlus />
                            Add New Customer
                        </> :
                            <>
                                <UserCog />
                                Edit Customer
                            </>
                        }</DialogTitle>
                        <DialogDescription className="text-xs font-base">
                            {isNew ? "Fill in the form below to add a new customer." : "Fill in the form below to edit the customer details."}
                        </DialogDescription>
                    </DialogHeader>
                    <CustomerForm prevData={prevData} />
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}