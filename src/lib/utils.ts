import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sumArrayOfNumbers(arr: number[]) {
  return arr.reduce((acc, item) => acc + item, 0);
}
