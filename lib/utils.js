import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export async function GET(url) {
  return await fetch(url, {
    headers: {
      Authorization: `Basic ${process.env.AUTH_TOKEN}`,
    },
    method: "GET",
  });
}

export async function POST(url, data) {
  return await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${process.env.AUTH_TOKEN}`,
    },
    method: "POST",
    body: JSON.stringify(data),
  });
}
