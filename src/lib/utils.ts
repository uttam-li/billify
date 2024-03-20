import { useQuery } from "@tanstack/react-query";
import { type ClassValue, clsx } from "clsx"
import { getSession } from "next-auth/react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}