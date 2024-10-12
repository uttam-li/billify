import {
  Home,
  LucideIcon,
  Package,
  Package2,
  PanelLeft,
  Settings,
  Users2,
  ReceiptIndianRupee,
} from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ModeToggle } from "../mode-toggle";
import { cn } from "@/lib/utils";
import useAuth from "@/hooks/useAuth";

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  link: string;
  className?: string;
}

interface SheetNavItemProps {
  icon: LucideIcon;
  label: string;
  link: string;
  className?: string;
}

const getActiveNavItem = (path: string) => {
  const segments = path.split("/");
  return segments[3] || "";
};

const DashLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const activeNavItem = getActiveNavItem(location.pathname);

  const handleNavigation = (link: string) => {
    const segments = location.pathname.split("/");
    segments[segments.length - 1] = link;
    const newPath = segments.join("/");
    navigate(newPath);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <a className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full">
            <img
              src="/images/bill.webp"
              alt="Billify"
              className="h-8 w-8 transition-all group-hover:scale-110"
            />
            <span className="sr-only">Billify</span>
          </a>
          <TooltipProvider>
            <NavItem
              icon={Home}
              label="Dashboard"
              link="dashboard"
              className={
                activeNavItem === "dashboard"
                  ? "bg-accent text-accent-foreground"
                  : ""
              }
            />
            <NavItem
              icon={ReceiptIndianRupee}
              label="Invoices"
              link="invoices"
              className={
                activeNavItem === "invoice"
                  ? "bg-accent text-accent-foreground"
                  : ""
              }
            />
            <NavItem
              icon={Package}
              label="Products"
              link="products"
              className={
                activeNavItem === "products"
                  ? "bg-accent text-accent-foreground"
                  : ""
              }
            />
            <NavItem
              icon={Users2}
              label="Customers"
              link="customers"
              className={
                activeNavItem === "customers"
                  ? "bg-accent text-accent-foreground"
                  : ""
              }
            />
            {/* <NavItem
              icon={LineChart}
              label="Analytics"
              link="analytics"
              className={
                activeNavItem === "analytics"
                  ? "bg-accent text-accent-foreground"
                  : ""
              }
            /> */}
          </TooltipProvider>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          {/* <TooltipProvider>
            <NavItem
              icon={Settings}
              label="Settings"
              link="settings"
              className={
                activeNavItem === "settings"
                  ? "bg-accent text-accent-foreground"
                  : ""
              }
            />
          </TooltipProvider> */}
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <img
                  src="/images/avatars/image.png"
                  width={36}
                  height={36}
                  alt="Avatar"
                  className="overflow-hidden rounded-full"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleNavigation("settings")}>Settings</DropdownMenuItem>
              {/* <DropdownMenuItem>Support</DropdownMenuItem> */}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <a className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base">
                  <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                  <span className="sr-only">Acme Inc</span>
                </a>
                <SheetNavItem
                  icon={Home}
                  label="Dashboard"
                  link="dashboard"
                  className={
                    activeNavItem === "dashboard" ? "text-foreground" : ""
                  }
                />
                <SheetNavItem
                  icon={ReceiptIndianRupee}
                  label="Invoices"
                  link="invoices"
                  className={
                    activeNavItem === "invoices" ? "text-foreground" : ""
                  }
                />
                <SheetNavItem
                  icon={Package}
                  label="Products"
                  link="products"
                  className={
                    activeNavItem === "products" ? "text-foreground" : ""
                  }
                />
                <SheetNavItem
                  icon={Users2}
                  label="Customers"
                  link="customers"
                  className={
                    activeNavItem === "customers" ? "text-foreground" : ""
                  }
                />
                <SheetNavItem
                  icon={Settings}
                  label="Settings"
                  link="settings"
                  className={
                    activeNavItem === "settings" ? "text-foreground" : ""
                  }
                />
              </nav>
            </SheetContent>
          </Sheet>
          <a
            href="#home"
            aria-label="logo"
            className="flex space-x-2 items-center md:hidden"
          >
            <img src="/images/bill.webp" alt="logo" className="w-8 h-8" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary dark:to-white to-black">
              Billify
            </span>
          </a>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full md:hidden ml-auto"
              >
                <img
                  src="/images/avatars/image.png"
                  width={36}
                  height={36}
                  alt="Avatar"
                  className="overflow-hidden rounded-full"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleNavigation("settings")}>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <Outlet />
      </div>
    </div>
  );
};

const SheetNavItem = ({
  icon: Icon,
  label,
  link,
  className,
}: SheetNavItemProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = () => {
    const segments = location.pathname.split("/");
    segments[segments.length - 1] = link;
    const newPath = segments.join("/");
    navigate(newPath);
  };

  return (
    <a
      onClick={handleNavigation}
      className={cn(
        "flex justify-start items-center gap-4 px-2.5 font-semibold text-muted-foreground hover:text-foreground",
        className
      )}
    >
      <Icon className="h-5 w-5" />
      {label}
    </a>
  );
};

const NavItem = ({ icon: Icon, label, link, className }: NavItemProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = () => {
    const segments = location.pathname.split("/");
    segments[segments.length - 1] = link;
    const newPath = segments.join("/");
    navigate(newPath);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNavigation}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
            className
          )}
        >
          <Icon className="h-5 w-5" />
          <span className="sr-only">{label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
};

export default DashLayout;
