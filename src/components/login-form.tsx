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
import { useMutation } from "@tanstack/react-query";
import axios from "@/api/axios";
import useAuth from "@/hooks/useAuth";
import { Navigate, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

const BASE_URL: string = import.meta.env.VITE_BASE_URL;

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginValues = z.infer<typeof formSchema>;

export default function LoginInForm({
  setIsSignUp,
}: {
  setIsSignUp: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { isAuthenticated, setAuth } = useAuth();
  const navigate = useNavigate();
  const form = useForm<LoginValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "supercelluttam@gmail.com",
      password: "UTTAM03l",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (values: LoginValues) => {
      const response = await axios.post("/auth/login", values, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: (data: { accessToken: string }) => {
      setAuth({ accessToken: data.accessToken });
      console.log("Login Page");
      navigate("/buss");
    },
    onError: (error: AxiosError) => {
      console.log("Login error:", error.response?.data)
    },
  });

  async function onSubmit(values: LoginValues) {
    toast.promise(loginMutation.mutateAsync(values), {
      loading: "Logging in...",
      success: `Welcome back!`,
      error: (error) => {
        const err = error?.response?.data?.error || "An error occurred";
        return err.charAt(0).toUpperCase() + err.slice(1);
      },
    });
  }

  if (isAuthenticated()) return <Navigate to="/buss" replace />;

  const handleGoogleLogin = () => {
    window.location.href = `${BASE_URL}/oauth/google`;
  };

  return (
    <Card className="mx-auto w-full max-w-lg lg:border-none lg:shadow-none">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          size="lg"
          variant="outline"
          onClick={handleGoogleLogin}
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
              Login
            </Button>
          </form>
        </Form>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <a
            href="#"
            className="ml-1 underline text-blue-500 dark:text-blue-300 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              setIsSignUp((prev) => !prev);
            }}
          >
            Sign up
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
