// Define the User type
export interface User {
  created_at: string;
  email: string;
  first_name: string;
  id: string;
  last_name: string;
}

export interface Business {
  account_no: string;
  address: string;
  bank_branch: string;
  bank_name: string;
  city: string;
  company_email: string;
  company_phone: string;
  country: string;
  created_at: string;
  gstno: string;
  id: string;
  ifsc: string;
  name: string;
  state: string;
  updated_at: string;
  user_id: string;
  zip_code: string;
}

export interface Customer {
  id: string;
  bus_id: string;
  name: string;
  gstno: string;
  email: string;
  phone: string;
  b_address: string;
  s_address: string;
  created_at: string;
  pending_amount: number;
  total_invoices: number;
}

export interface Product {
  id: string;
  bus_id: string;
  name: string;
  price: number;
  tax_rate: number;
  unit: string;
  hsn_code: string;
  created_at: string;
}

export interface Invoice {
  id: string;
  inv_no: number;
  buss_id: string;
  cust_id: string;
  total_amount: number;
  inv_date: string; // Use string for date to handle ISO date strings
  due_date: string; // Use string for date to handle ISO date strings
  is_paid: boolean;
  paid_date?: string; // Optional field
  items: InvoiceItem[];
  created_at: string; // Use string for date to handle ISO date strings
}

export interface InvoiceItem {
  id: string;
  inv_id: string;
  prod_id: string;
  quantity: number;
  unit_price: number;
}