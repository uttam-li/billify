"use client";

import Loading from "@/components/loading";
import OrganizationForm from "@/components/org-form"
import { getOrganizationById } from "@/lib/actions";
import { useQuery } from "@tanstack/react-query"

export default function SettinsPage({params}: { params: { orgId: string }}) {
  const { data: orgData, isLoading } = useQuery({
    queryKey: ['org'],
    queryFn: async () => await getOrganizationById(params.orgId),
    staleTime: Infinity
  })
  
  return (
    <div className="h-full w-full flex flex-col items-center justify-center px-2 py-4 bg-secondary/30">
      {/* <Tabs defaultValue="account" className="">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Company Edit</TabsTrigger>
          <TabsTrigger value="password">Edit Profile</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="flex items-center justify-center">
          <Card>
            <CardHeader>
              <CardTitle>Company Edit</CardTitle>
              <CardDescription>
                Fill in the form below to edit your company details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2"> */}
          <h1 className="font-bold text-2xl mb-3">Settings</h1>
          {!isLoading && orgData ? <OrganizationForm prevData={orgData} /> : <Loading />}
            {/* </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password here. After saving, you'll be logged out.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current">Current password</Label>
                <Input id="current" type="password" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">New password</Label>
                <Input id="new" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs> */}
    </div>
  )
}
