'use client'

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { LogOut, Menu } from "lucide-react"
import BillifyLogo from "./logo"
import { useQueryClient } from "@tanstack/react-query"
import { signOut, useSession } from "next-auth/react"
import { Organization } from "@prisma/client"
import Link from "next/link"
import { navLinks } from "@/lib/constant"
import { ModeToggle } from "./mode-toggle"
import { ScrollArea } from "./ui/scroll-area"

export default function OrgNavbar() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  if (!session) return null
  const { name: userName, email: userEmail, image: userImage } = session?.user
  const org: Organization | undefined = queryClient.getQueryData(['org'])
  if (!org) return null
  return (
    <div className="fixed h-16 px-4 max-w-[1500px] mx-auto left-0 right-0 top-0 flex items-center justify-between bg-secondary rounded-full my-2">
      <aside className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="border-none hover:scale-105 transition-all active:scale-90 rounded-full" size="icon"><Menu /></Button>
          </SheetTrigger>
          <SheetContent side={"left"}>
            <div className="flex flex-col items-center mt-6 gap-y-8">
              <BillifyLogo size="text-4xl" />
              {userImage &&
                <>
                  <img
                    src={userImage}
                    className="object-fill rounded-full"
                    width={100}
                    height={100}
                    alt="User Image"
                  />
                  <div className="block text-center mt-[-20px]">
                    <h1 className="text-xl font-semibold">{userName}</h1>
                    <p className="text-muted-foreground">{userEmail}</p>
                  </div>
                </>
              }
              <Button
                variant='outline'
                className="w-full max-w-[250px] inline-flex gap-2 hover:gap-x-4 hover:bg-red-500/30 transition-all border-none"
                onClick={() => signOut()}
              ><LogOut /> Log Out</Button>
              <hr className="w-full border" />
            </div>
            {/* <ScrollArea className="h-60 md:h-80"> */}
              <ul className="flex w-full flex-col justify-between items-center my-2 gap-y-2">
                {navLinks.map((link) => (
                  <li key={link.href} className="w-full max-w-[250px]">
                    <SheetClose asChild>
                      <Link
                        className="w-full hover:scale-105 active:scale-90 hover:bg-secondary hover:gap-x-4 h-10 rounded-md flex gap-x-2 transition-all items-center justify-start pl-5 font-medium"
                        href={`/organization/${org.orgId}/${link.href}`}
                      >{link.icon}{link.name}</Link>
                    </SheetClose>
                  </li>
                ))}
              </ul>
            {/* </ScrollArea> */}
          </SheetContent>
        </Sheet>
        <Link href={`/organization/${org.orgId}`}>
          <BillifyLogo size="text-4xl" />
        </Link>
      </aside>
      <aside className="flex gap-2">
        <ModeToggle />
        {userImage &&
          <img
            src={userImage}
            className="object-fill rounded-full"
            width={40}
            height={40}
            alt="User Image"
          />
        }
      </aside>
    </div>
  )
}