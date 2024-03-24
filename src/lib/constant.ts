import {ReceiptIndianRupee,UserRound, Package, Settings} from "lucide-react"
import { createElement } from "react";

export const features = [
  "Secure Login",
  "Customer CRM",
  "Product Catalog",
  "Sales Dashboard",
  "Payment Tracking",
  "Easy Invoicing",
] as const;

export const navLinks = [
  { name: "Invoice", href: "invoice", icon: createElement(ReceiptIndianRupee) },
  { name: "Customer", href: "customer", icon: createElement(UserRound) },
  { name: "Products", href: "products", icon: createElement(Package) },
  { name: "Settings", href: "settings", icon: createElement(Settings) },
] as const;