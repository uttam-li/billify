import { cn } from "@/lib/utils";
import Image  from "next/image";
import React from "react";

export default function BillifyLogo({size}: {size: string}) {
  return (
    <div className="flex items-center gap-2">
    <Image
      className="w-auto h-auto"
      src='/bill.png'
      height={40}
      width={40}
      alt="Billify-Logo"
    />
    <div className="bg-gradient-to-r from-primary to-secondary-foreground h-[44px] text-transparent bg-clip-text relative">
      <h1 className={cn("font-bold text-center", size)}>Billify</h1>
    </div>
    </div>
  );
}
