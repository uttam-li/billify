import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import OrganizationForm from "./org-form"
import { ScrollArea } from "@/components/ui/scroll-area";
import { Building2 } from "lucide-react"

export default function CreateOrganization() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex gap-2"><Building2 />Create New Company</Button>
      </DialogTrigger>
      <DialogContent className="min-w-[350px] w-auto h-[500px] md:h-[700px]">
        <ScrollArea>
        <DialogHeader className="flex items-center">
          <DialogTitle className="inline-flex items-center gap-2 text-2xl"><Building2 />Create New Company</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Fill in the form below to create a new company.
          </DialogDescription>
        </DialogHeader>
        {/* <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              defaultValue="Pedro Duarte"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              defaultValue="@peduarte"
              className="col-span-3"
            />
          </div>
        </div> */}
        <OrganizationForm inDialog />
        {/* <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter> */}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
