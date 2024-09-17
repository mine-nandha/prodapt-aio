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

export async function saveTimesheet(selectedDates, empCode, taskId, projectId) {
  const res = await fetch(`/api/timesheet/save`, {
    method: "POST",
    body: JSON.stringify({
      selectedDates: selectedDates,
      empCode: empCode,
      taskId: taskId,
      projectId: projectId,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
}

export async function saveFutureTimesheet(
  CRON_URL,
  BASE_URL,
  cron,
  empCode,
  projectId,
  taskId,
  headers = { "Content-Type": "application/json" }
) {
  const id = crypto.randomUUID();
  const res = await fetch(`${CRON_URL}/task/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      url: `${BASE_URL}/api/timesheet/save/${id}`,
      method: "POST",
      headers: headers,
      name: "Timesheet",
      cron: cron,
      creator: empCode,
      body: {
        projectId,
        taskId,
        empCode,
      },
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
}

export async function createLog(CRON_URL, id, body) {
  console.log(id, body);
  const res = await fetch(`${CRON_URL}/task/${id}/logs`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(await res.json());
}
