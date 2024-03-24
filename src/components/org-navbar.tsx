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
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { signOut, useSession } from "next-auth/react"
import { Organization } from "@prisma/client"
import Link from "next/link"
import { navLinks } from "@/lib/constant"
import { getOrganizationById } from "@/lib/actions"

export default function OrgNavbar() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  if (!session) return null
  const userImage = session?.user.image
  const org: Organization | undefined = queryClient.getQueryData(['org'])
  if (!org) return null
  return (
    <div className="fixed h-16 px-4 left-0 right-0 top-0 w-full flex items-center justify-between bg-secondary">
      <aside className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="aspect-square" size="icon"><Menu /></Button>
          </SheetTrigger>
          <SheetContent side={"left"}>
            <div className="flex flex-col items-center mt-6 gap-y-8">
                <BillifyLogo size="text-4xl" />
              {userImage &&
                <img
                  src={userImage}
                  className="object-fill rounded-full"
                  width={100}
                  height={100}
                  alt="User Image"
                />
              }
              <Button
                variant='outline'
                className="w-full max-w-[250px] inline-flex gap-2 hover:gap-x-4 hover:bg-red-500/30 transition-all"
                onClick={() => signOut()}
              ><LogOut /> Log Out</Button>
              <hr className="w-full border" />
            </div>
            <ul className="flex flex-col justify-center my-5 gap-y-3">
              {navLinks.map((link) => (
                <li key={link.href} >
                  <SheetClose asChild>
                    <Link
                      className="w-full hover:border hover:bg-secondary hover:gap-x-4 h-10 rounded-lg inline-flex gap-x-2 transition-all items-center pl-5 font-semibold"
                      href={`/organization/${org.orgId}/${link.href}`}
                    >{link.icon}{link.name}</Link>
                  </SheetClose>
                </li>
              ))}
            </ul>
          </SheetContent>
        </Sheet>
        <Link href={`/organization/${org.orgId}`}>
        <BillifyLogo size="text-4xl" />
        </Link>
      </aside>
      <aside>
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