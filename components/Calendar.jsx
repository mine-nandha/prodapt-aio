"use client";

import React, { useEffect, useRef, useState } from "react";
import { Calendar } from "react-multi-date-picker";
import "react-multi-date-picker/styles/colors/red.css";
import { Button } from "./ui/button";
import { timesheet } from "@/lib/utils";
import { Tabs } from "flowbite-react";
import { HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "./ui/skeleton";

const CalendarWrapper = ({
  BASE_URL,
  CRON_URL,
  empCode,
  taskId,
  projectId,
  ...props
}) => {
  const [value, setValue] = useState([]);
  const [futureValue, setFutureValue] = useState([]);
  const [bookedDates, setBookedDates] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const [disabledFuture, setDisabledFuture] = useState(true);
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(false);
  const alertDialogRef = useRef(null);
  let cron;

  useEffect(() => {
    isMounted.current = true;
    async function fetchData() {
      const { bookedDates } = await timesheet(empCode);
      if (isMounted.current) {
        setBookedDates(bookedDates);
      }
    }
    fetchData();
    return () => {
      isMounted.current = false;
    };
  }, [empCode]);

  const handleValueChange = (newValue) => {
    setValue(newValue);
    setDisabled(newValue === null || newValue.length === 0);
  };
  const handleFutureValueChange = (newValue) => {
    setFutureValue(newValue);
    setDisabledFuture(newValue === null || newValue.length === 0);
  };

  const isBookedDate = (dateStr, bookedDates) => {
    return bookedDates.includes(dateStr);
  };

  const handleConfirmClick = async () => {
    setLoading(true); // Start loading
    const selectedDates = [];
    value.forEach((range) => {
      if (!range[1]) {
        selectedDates.push(range[0].toString());
      } else {
        for (
          let date = new Date(range[0]);
          date <= range[1];
          date.setDate(date.getDate() + 1)
        ) {
          let dateStr = date.toISOString().split("T")[0];
          if (!isBookedDate(dateStr, bookedDates)) {
            selectedDates.push(dateStr);
          }
        }
      }
    });
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
    console.log(selectedDates);
    const { message, failedDates } = await res.json();
    console.log(message);
    if (failedDates && failedDates.length > 0) {
      console.log(failedDates);
    } else {
      setValue(null);
    }
    const data = await timesheet(empCode, selectedDates);
    setBookedDates(data.bookedDates);
    setLoading(false);
    if (alertDialogRef.current) {
      alertDialogRef.current.click();
    }
  };
  const handleFutureConfirmClick = async () => {
    setDisabledFuture(true);
    setLoading(true);
    const selectedFutureDates = [];
    const days = [];
    futureValue.forEach((range) => {
      if (!range[1]) {
        selectedFutureDates.push(range[0].toString());
        days.push(new Date(range[0]).getDate().toString());
      } else {
        let start = new Date(range[0]);
        let end = new Date(range[1]);
        for (
          let date = new Date(start);
          date <= end;
          date.setDate(date.getDate() + 1)
        ) {
          selectedFutureDates.push(date.toISOString().split("T")[0]);
        }
        if (start.getDate() === end.getDate()) {
          days.push(start.getDate().toString());
        } else {
          days.push(`${start.getDate()}-${end.getDate()}`);
        }
      }
    });
    cron = `0 0 ${days.toString()} ${new Date().getMonth() + 1} *`;
    const res = await fetch(`${CRON_URL}/tasks`, {
      method: "POST",
      body: JSON.stringify({
        url: `${BASE_URL}/api/cronjob/taskId`,
        method: "GET",
        name: "Timesheet",
        cron: cron,
        creator: empCode,
        projectId: projectId,
        taskId: taskId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((e) => console.error(e));

    if (alertDialogRef.current) {
      alertDialogRef.current.click();
    }
    setLoading(false);
    setFutureValue(null);
    setDisabledFuture(false);
  };

  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const date = new Date();
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [timer, setTimer] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => setTimer(false), 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div>
      <Tabs aria-label="tabs" variant="pills" className="p-1">
        <Tabs.Item active title="Past Booking" icon={HiUserCircle}>
          <div className="flex flex-col items-center justify-center">
            {timer ? (
              <div className="*:m-2">
                <Skeleton className="w-[220px] h-[220px]" />
                <div className="flex justify-evenly pb-3">
                  <Skeleton className="w-[100px] h-[62px]" />
                  <Skeleton className="w-[100px] h-[62px]" />
                </div>
              </div>
            ) : (
              <Calendar
                {...props}
                className="red"
                value={value}
                onChange={handleValueChange}
                multiple
                range
                minDate={threeMonthsAgo}
                maxDate={new Date()}
                format="YYYY-MM-DD"
                mapDays={({ date }) => {
                  const dateStr = `${date.year}-${(date.month.index + 1)
                    .toString()
                    .padStart(2, "0")}-${date.day.toString().padStart(2, "0")}`;
                  return {
                    disabled: isBookedDate(dateStr, bookedDates),
                  };
                }}
              >
                <div className="flex justify-evenly pb-3 *:w-2/5">
                  <AlertDialog>
                    <AlertDialogTrigger
                      disabled={disabled || loading}
                      className="disabled:cursor-not-allowed"
                    >
                      Book
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This will take a while. Also currently due to server
                          restrictions single request will only run about 10
                          seconds. In case your bulk bookings failed, please try
                          again for the remaining dates
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel ref={alertDialogRef}>
                          Cancel
                        </AlertDialogCancel>
                        <Button
                          onClick={handleConfirmClick}
                          className="bg-red-500 hover:bg-red-400 w-1/4"
                        >
                          {loading ? (
                            <svg
                              width="30"
                              height="30"
                              fill="currentColor"
                              className="animate-spin mx-auto"
                              viewBox="0 0 1792 1792"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z"></path>
                            </svg>
                          ) : (
                            "Confirm"
                          )}
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleValueChange([]);
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </Calendar>
            )}
          </div>
        </Tabs.Item>
        <Tabs.Item title="Future Booking" icon={MdDashboard}>
          <div className="flex flex-col items-center justify-center">
            {timer ? (
              <div className="*:m-2">
                <Skeleton className="w-[220px] h-[220px]" />
                <div className="flex justify-evenly pb-3">
                  <Skeleton className="w-[100px] h-[62px]" />
                  <Skeleton className="w-[100px] h-[62px]" />
                </div>
              </div>
            ) : (
              <Calendar
                {...props}
                className="red"
                value={futureValue}
                onChange={handleFutureValueChange}
                multiple
                range
                minDate={tomorrow}
                maxDate={lastDay}
                format="YYYY-MM-DD"
              >
                <div className="flex justify-evenly pb-3 *:w-2/5">
                  <AlertDialog>
                    <AlertDialogTrigger
                      disabled={disabledFuture || loading}
                      className="disabled:cursor-not-allowed"
                    >
                      Book
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          After booking a bunch of dates for this month,
                          you&apos;ll have a task added to your dashboard. That
                          task will be excecuted on all the days that
                          you&apos;ve booked for. You will get a mail if a
                          scheduled task on one of the days fails. You can try
                          booking again. If still fails, contact the{" "}
                          <a
                            href="mailto:nandhakishore.s@prodapt.com"
                            className="text-blue-600"
                          >
                            developer
                          </a>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel ref={alertDialogRef}>
                          Cancel
                        </AlertDialogCancel>
                        <Button
                          onClick={handleFutureConfirmClick}
                          className="bg-red-500 hover:bg-red-400 w-1/4"
                        >
                          {loading ? (
                            <svg
                              width="30"
                              height="30"
                              fill="currentColor"
                              className="animate-spin mx-auto"
                              viewBox="0 0 1792 1792"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z"></path>
                            </svg>
                          ) : (
                            "Confirm"
                          )}
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleFutureValueChange([]);
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </Calendar>
            )}
          </div>
        </Tabs.Item>
      </Tabs>
    </div>
  );
};

export default CalendarWrapper;
