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
import { getUserOrganization, getUserSession } from "@/lib/actions";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


export default function AccountPage() {

  const router = useRouter()
  const { data: user} = useSession()
  const userId = user?.user?.id
  const { data: orgs } = useQuery({
    queryKey: ["orgs"],
    queryFn: async () => await getUserOrganization(userId as string),
    enabled: !!userId,
  });

  return (
    <main className="h-screen w-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-[600px]">
        <CardHeader>
          <CardTitle className="m-auto text-4xl flex flex-wrap justify-center gap-1 h-full">
            Welcome to <BillifyLogo size="text-4xl" />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center my-5 gap-y-2">
          {orgs ? (
            orgs.map((org) => (
              <Button
                key={org.orgId}
                className="w-full max-w-[400px] h-14 block"
                variant="outline"
                onClick={() => router.push(`/organization/${org.orgId}`)}
              >
                <h1>{org.name}</h1>
                <p className="text-muted-foreground">GST No: {org.gstno}</p>
              </Button>
            ))
          ) : (
            <p>No Companys found, Create one now.</p>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-center">
          <CreateOrganization />
        </CardFooter>
      </Card>
    </main>
  );
}
