import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Instagram is where byvivelle actually takes orders. */
export const INSTAGRAM_URL = "https://instagram.com/byvivelle";
export const INSTAGRAM_HANDLE = "@byvivelle";
