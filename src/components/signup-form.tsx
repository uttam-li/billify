import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import axios from "@/api/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

const BASE_URL: string = import.meta.env.VITE_BASE_URL;

type SignUpValues = z.infer<typeof formSchema>;

const formSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function SignUpForm({
  setIsSignUp,
}: {
  setIsSignUp: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const form = useForm<SignUpValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: SignUpValues) => {
    const response = await axios.post("/auth/register", values);
    return response.data;
  }});

  async function onSubmit(values: SignUpValues) {
    toast.promise(mutation.mutateAsync(values), {
      loading: "Submitting...",
      success: `Success! Account created successfully`,
      error: (error: AxiosError) =>
        `${
          error.status == 409
            ? `An account with the email address already exists`
            : "An error occurred"
        }`,
    });
  }

  const handleGoogleLogin = () => {
    window.location.href = `${BASE_URL}/oauth/google`
  }

  return (
    <Card className="mx-auto w-full max-w-lg lg:border-none lg:shadow-none">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          size="lg"
          onClick={handleGoogleLogin}
          variant="outline"
          className="py-5 w-full relative rounded-lg font-medium"
        >
          <img
            className="mr-2 h-8 absolute left-2"
            src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000"
            alt="Google Logo"
          />{" "}
          Log in with Google
        </Button>
        {/* <Button
          size="lg"
          variant="outline"
          className="py-5 w-full relative rounded-lg font-medium"
        >
          <img
            className="mr-2 h-8 absolute left-2"
            src="https://img.icons8.com/?size=100&id=AZOZNnY73haj&format=png&color=000000"
            alt="Google Logo"
          />{" "}
          Log in with Github
        </Button> */}
        <div className="relative my-2 flex items-center">
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          <span className="mx-4 text-gray-500 dark:text-gray-400">
            or continue with
          </span>
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" required {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" required {...field} />
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
                    <Input placeholder="m@example.com" required {...field} />
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
                    <PasswordInput placeholder="password" required {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="lg" className="w-full">
              Create an account
            </Button>
          </form>
        </Form>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <a
            href="#"
            className="ml-1 underline text-blue-500 dark:text-blue-300 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              setIsSignUp((prev) => !prev);
            }}
          >
            Sign in
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
