"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ModeToggle } from "./mode-toggle";

export default function NavBar() {
  const { data: session } = useSession();
  const router = useRouter()
  const userImage = session?.user.image;
  return (
    <main className="relative h-24 py-4 px-8 left-0 right-0 top-0 w-full flex items-center justify-between">
      <aside className="hidden md:block">
        <Image src={"/bill.png"} height={40} width={40} alt="Billify-Logo" />
      </aside>
      <aside className="md:hidden">
      <Button onClick={() => router.push('/organization')}>Dashboard</Button>
      </aside>
      <aside>
        {userImage ? (
          <div className="flex gap-2 md:gap-4">
            <ModeToggle />
            <Image
              src={userImage}
              className="object-fill rounded-full"
              width={40}
              height={40}
              alt="User Image"
            />
            <Button className="hidden md:block" onClick={() => router.push('/organization')}>Dashboard</Button>
            <Button variant="destructive" size="icon" onClick={() => signOut()}><LogOut/></Button>
          </div>
        ) : (
          <>
            <Button onClick={() => signIn()}>Sign In</Button>
          </>
        )}
      </aside>
    </main>
  );
}
