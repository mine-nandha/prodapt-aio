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

export async function timesheet(empCode, dates = null) {
  const res = await GET(`/api/timesheet/${empCode}`);
  const { data } = await res.json();
  const bookedDates = data
    ?.slice(0, 60)
    ?.map((item) => item?.compositeKey?.timeBookDate?.split(" ")[0]);
  if (!dates) {
    return { bookedDates };
  }
  const failedDates = dates.filter((date) => !bookedDates.includes(date));
  return {
    isBooked: failedDates.length === 0,
    failedDates: failedDates,
    bookedDates: bookedDates,
  };
}
