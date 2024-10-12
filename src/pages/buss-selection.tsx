import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BriefcaseBusinessIcon, PlusCircleIcon } from "lucide-react";
import { CheckIcon } from "@radix-ui/react-icons";
import { Business, User } from "@/types/schema";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";

const BussSelectionPage = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const user = queryClient.getQueryData<User>(["user"]);

  // const { data: user, isLoading: isUserLoading } = useQuery<User>({
  //   queryKey: ["user"],
  //   queryFn: async () => {
  //     const { data } = await axiosPrivate.get("/user");
  //     return data.data;
  //   },
  //   initialData: cachedUser,
  // });

  const { data: BussList, isLoading: isBusLoading } = useQuery<
    Business[] | string
  >({
    queryKey: ["buss"],
    queryFn: async () => {
      const response = await axiosPrivate.get("/business");
      return response.data.data;
    },
  });

  const handleSelect = (id: string) => {
    console.log("Card Clicked!");
    navigate(`/buss/${id}/dashboard`);
  };

  if (isBusLoading) {
    return <div>Loading...</div>;
  }

  console.log("BussList: ", BussList);
  if (BussList === "No businesses found for this user") {
    return <Navigate to="/startup" replace />;
  }
  if (user === undefined || BussList === undefined) return null;

  console.log(BussList);
  console.log("User Info:", user);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center max-w-3xl mx-auto px-4">
      <div className="text-center my-4 mx-4">
        <h2 className="text-3xl font-bold">
          Select Your Business,{" "}
          <span className="text-primary">{user.first_name}</span>
        </h2>
        <p className="text-muted-foreground mt-2">
          Choose from the list of businesses below to get started.
        </p>
      </div>
      <div className="w-full max-w-xl my-2">
        {typeof BussList === "string" ? (
          <div className="flex flex-col items-center justify-center">
            <p className="text-xl text-muted-foreground">
              No businesses found. Please create a business first.
            </p>
          </div>
        ) : (
          <ol className="space-y-4 mx-4">
            {BussList.map((item) => (
              <li key={item.gstno}>
                <Card
                  onClick={() => handleSelect(item.id)}
                  className="shadow-lg rounded-lg flex flex-row items-center py-2 px-4 transition-all hover:scale-[102%] hover:shadow-lg cursor-pointer group"
                >
                  <div className="flex-grow flex items-center">
                    <BriefcaseBusinessIcon className="text-primary mr-6 w-6 h-6" />
                    <div>
                      <CardHeader className="p-0">
                        <CardTitle className="text-lg font-semibold">
                          {item.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 text-xs text-muted-foreground">
                        <p>GST Number: {item.gstno}</p>
                      </CardContent>
                    </div>
                  </div>
                  <CardFooter className="p-0 text-4xl hidden group-hover:block">
                    <CheckIcon className="text-primary ml-4 w-6 h-6" />
                  </CardFooter>
                </Card>
              </li>
            ))}
          </ol>
        )}
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button size="lg" className="my-14 w-full max-w-xl">
            <PlusCircleIcon className="mr-2 h-4 w-4" /> Create Business
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>Create Business</DialogHeader>
          <DialogDescription>
            You can create a business by filling out the form below.
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default BussSelectionPage;
