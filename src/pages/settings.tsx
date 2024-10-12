import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BusinessForm from "@/components/business-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { BuildingIcon, UserIcon } from "lucide-react";
import { User } from "@/types/schema";

export function Settings() {
  return (
    <div className="min-h-screen container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <Tabs defaultValue="user">
        <TabsList className="mb-4">
          <TabsTrigger value="user">
            <UserIcon className="w-4 h-4 mr-2" />
            User Settings
          </TabsTrigger>
          <TabsTrigger value="business">
            <BuildingIcon className="w-4 h-4 mr-2" />
            Business Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="user">
          <UserCard />
        </TabsContent>

        <TabsContent value="business">
          <BusinessCard />
        </TabsContent>
      </Tabs>
    </div>
  );
}

const formSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  password: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

const UserCard = () => {
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();

  const user = queryClient.getQueryData<User>(["user"]);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: user?.first_name,
      last_name: user?.last_name,
      email: user?.email,
      password: "",
    },
  });

  const updateUser = useMutation({
    mutationFn: async (values: FormValues) => {
      await axiosPrivate.put(`user`, {
        first_name: values.first_name,
        last_name: values.last_name,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  function onSubmit(values: FormValues) {
    toast.promise(updateUser.mutateAsync(values), {
      loading: "Updating user...",
      success: "User updated successfully!",
    });
  }

  return (
    <Card>
      {/* <form onSubmit={handleUserSave}> */}
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
        <CardDescription>
          Manage your account settings and preferences.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 mx-auto"
          >
            <div className="flex flex-col sm:flex-row gap-4  w-full">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="" disabled {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="**********"
                      disabled
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button size="lg" className="w-full mt-4" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

const BusinessCard = () => {
  const { id: buss_id } = useParams();
  const axiosPrivate = useAxiosPrivate();

  const { data: bussinessData, isLoading } = useQuery({
    queryKey: ["business", buss_id],
    queryFn: async () => {
      const { data } = await axiosPrivate.get(`business/${buss_id}`);
      return data.data;
    },
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Information</CardTitle>
        <CardDescription>
          Manage your business details and banking information.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <BusinessForm isNew={false} initialValues={bussinessData} />
      </CardContent>
    </Card>
  );
};
