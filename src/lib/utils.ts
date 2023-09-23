import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sumArrayOfNumbers(arr: number[]) {
  return arr.reduce((acc, item) => acc + item, 0);
}

export const formatMoneyValue = (val: number, currencySymbol = "zł") =>
  val?.toLocaleString("pl", {
    style: "currency",
    currency: "PLN",
  });

export const range = (start: number, end?: number, step = 1) => {
  let output = [];
  if (typeof end === "undefined") {
    end = start;
    start = 0;
  }
  for (let i = start; i < end; i += step) {
    output.push(i);
  }
  return output;
};
