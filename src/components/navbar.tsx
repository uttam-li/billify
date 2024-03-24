"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const { data: session } = useSession();
  const router = useRouter()
  const userImage = session?.user.image;
  return (
    <main className="relative h-24 py-4 px-8 left-0 right-0 top-0 w-full flex items-center justify-between">
      <aside>
        <Image src={"/bill.png"} height={40} width={40} alt="Billify-Logo" />
      </aside>
      <aside>
        {userImage ? (
          <div className="flex gap-2 md:gap-4">
            <Image
              src={userImage}
              className="object-fill rounded-full"
              width={40}
              height={40}
              alt="User Image"
            />
            <Button onClick={() => router.push('/organization')}>Dashboard</Button>
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
