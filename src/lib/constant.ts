import {
  LayoutDashboard,
  ReceiptIndianRupee,
  UserRound,
  Package,
  Settings,
  ShieldCheck,
  UsersRound,
  CircleUserRound,
  ReceiptText,
  BadgeIndianRupee,
} from "lucide-react";
import { createElement } from "react";

export const features = [
  {
    title: "Secure Login",
    description: "Keep your data safe with robust security measures.",
    icon: createElement(ShieldCheck, { size: 80, color: "#3B82F6" }),
  },
  {
    title: "Customer CRM",
    description:
      "Build lasting relationships by managing interactions effortlessly.",
    icon: createElement(CircleUserRound, { size: 80, color: "#3B82F6" }),
  },
  {
    title: "Product Catalog",
    description:
      "Showcase products beautifully for easy browsing and purchasing.",
    icon: createElement(Package, { size: 80, color: "#3B82F6" }),
  },
  // {
  //   title: "Sales Dashboard",
  //   description:
  //     "Gain valuable insights into sales performance for informed decisions.",
  //   icon: createElement(LayoutDashboard, { size: 80, color: "#3B82F6" }),
  // },
  {
    title: "Multiple Accounts",
    description: "Manage multiple accounts seamlessly under one umbrella.",
    icon: createElement(UsersRound, { size: 80, color: "#3B82F6" }),
  },
  {
    title: "Easy Invoicing",
    description: "Simplify invoicing with a user-friendly interface.",
    icon: createElement(ReceiptText, { size: 80, color: "#3B82F6" }),
  },
] as const;

export const navLinks = [
  { name: "Dashboard", href: "", icon: createElement(LayoutDashboard) },
  // { name: "Sales", href: "sales", icon: createElement(BadgeIndianRupee)},
  { name: "Invoice", href: "invoice", icon: createElement(ReceiptIndianRupee) },
  { name: "Customer", href: "customer", icon: createElement(UserRound) },
  { name: "Products", href: "products", icon: createElement(Package) },
  { name: "Settings", href: "settings", icon: createElement(Settings) },
] as const;
