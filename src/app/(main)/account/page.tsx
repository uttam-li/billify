"use client";

import CreateOrganization from "@/components/create-org";
import BillifyLogo from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserOrganization } from "@/lib/actions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function AccountPage() {
  const [model, setModel] = useState(false)
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["orgs"],
    queryFn: () => getUserOrganization(),
  });
  return (
    <main className="h-screen w-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-[600px]">
        <CardHeader>
          <CardTitle className="m-auto text-4xl flex flex-wrap justify-center gap-1">
            Welcome to <BillifyLogo size="text-4xl" />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center mx-10 my-5 gap-y-2">
        <Button className="w-full max-w-[400px] h-14 block" variant="outline">
            <h1>Company Name</h1>
            <p className="text-muted-foreground">GST No: 348998348</p>
          </Button>
          <Button className="w-full max-w-[400px] h-14 block" variant="outline">
            <h1>Company Name</h1>
            <p className="text-muted-foreground">GST No: 348998348</p>
          </Button>
          <Button className="w-full max-w-[400px] h-14 block" variant="outline">
            <h1>Company Name</h1>
            <p className="text-muted-foreground">GST No: 348998348</p>
          </Button>
        </CardContent>
        <CardFooter className="flex items-center justify-center">
          <CreateOrganization />
        </CardFooter>
      </Card>
    </main>
  );
}
