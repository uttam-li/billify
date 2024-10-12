import { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  CreditCardIcon,
  IndianRupeeIcon,
  PlusCircleIcon,
  UserIcon,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { addMonths, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "../components/ui/calendar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type BusinessOverview = {
  total_invoices: number;
  pending_invoices: number;
  total_revenue: number;
  unpaid_amount: number;
  recent_invoices: [];
};

export function DashboardComponent() {
  const { id } = useParams();
  const queryClient = new QueryClient();
  const axiosPrivate = useAxiosPrivate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [date, setDate] = useState<DateRange | undefined>({
    from: addMonths(new Date(), -1),
    to: new Date(),
  });
  const [data, setData] = useState<BusinessOverview>({
    total_invoices: 0,
    pending_invoices: 0,
    total_revenue: 0,
    unpaid_amount: 0,
    recent_invoices: [],
  });

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue",
        data: [12000, 19000, 3000, 5000, 2000, 3000],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const { data: DashboardData, isLoading } = useQuery<BusinessOverview>({
    queryKey: ["dashboard", id],
    queryFn: async () => {
      const { data } = await axiosPrivate.post("/business/dashboard", {
        busId: id,
        from: date?.from,
        to: date?.to,
      });
      return data.data;
    },
    enabled: id !== undefined && date != undefined,
  });

  useEffect(() => {
    if (DashboardData) {
      setData(DashboardData);
    }
  }, [DashboardData]);

  if (isLoading) return <div>Loading...</div>;

  const handleApplyClick = () => {
    console.log("Date Time:", `${date?.from} - ${date?.to}`);
    setIsOpen(false);
    queryClient.refetchQueries({ queryKey: ["dashboard", id] });
  };

  console.log("Dashboard Data:", DashboardData);

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        {/* <Select value={selectedBusiness} onValueChange={setSelectedBusiness}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Business" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Businesses</SelectItem>
            <SelectItem value="Business A">Business A</SelectItem>
            <SelectItem value="Business B">Business B</SelectItem>
          </SelectContent>
        </Select> */}
        <div className={cn("grid gap-2 mt-4")}>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[216px] ml-auto justify-start text-center font-normal",
                  !date && "text-muted-foreground"
                )}
                onClick={() => setIsOpen(true)}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "dd/MM/yyyy")} -{" "}
                      {format(date.to, "dd/MM/yyyy")}
                    </>
                  ) : (
                    format(date.from, "dd/MM/yyyy")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-4 shadow-lg rounded-lg"
              align="start"
            >
              <div className="flex flex-col items-end">
                <Button onClick={handleApplyClick}>Apply</Button>
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Invoices
            </CardTitle>
            <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.total_invoices}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Invoices
            </CardTitle>
            <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.pending_invoices}</div>
            <p className="text-xs text-muted-foreground">
              -3.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupeeIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.total_revenue}
            </div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Amount
            </CardTitle>
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.unpaid_amount}</div>
            <p className="text-xs text-muted-foreground">
              +180 since last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 mb-8 md:grid-cols-2 overflow-auto">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={chartData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Customer Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <Line data={chartData} />
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your recent invoices and their statuses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* {DashboardData?.recent_invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{activity.customer}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          activity.status === "Paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {activity.status}
                      </span>
                    </TableCell>
                    <TableCell>${activity.amount}</TableCell>
                    <TableCell>{activity.dueDate}</TableCell>
                  </TableRow>
                ))} */}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <div className="fixed bottom-8 right-8">
        <Button size="lg">
          <PlusCircleIcon className="mr-2 h-4 w-4" /> Quick Actions
        </Button>
      </div>
    </div>
  );
}
