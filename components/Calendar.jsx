"use client";

import React, { useEffect, useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import "react-multi-date-picker/styles/colors/red.css";
import { Button } from "./ui/button";
import { GET } from "@/lib/utils";

const fetchExtractedDates = async (empCode, setExtractedDates) => {
  const res = await GET(`/api/timesheet/${empCode}`);
  const { data } = await res.json();
  const dates = data
    ?.slice(0, 90)
    ?.map((item) => new Date(item?.compositeKey?.timeBookDate?.split(" ")[0]));
  setExtractedDates(dates);
  return data
    ?.slice(0, 90)
    ?.map((item) => item?.compositeKey?.timeBookDate?.split(" ")[0]);
};
const Calendar = ({ empCode, taskId, projectId, ...props }) => {
  const [extractedDates, setExtractedDates] = useState([]);
  const [value, setValue] = useState([]);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    fetchExtractedDates(empCode, setExtractedDates);
  }, [empCode]);

  const handleValueChange = (newValue) => {
    setValue(newValue);
    setDisabled(newValue === null || newValue.length === 0);
  };

  const isDisabledDate = (date, extractedDates) =>
    extractedDates.some(
      (disabledDate) =>
        date.day === disabledDate.getDate() &&
        date.month.index === disabledDate.getMonth() &&
        date.year === disabledDate.getFullYear()
    );

  const handleConfirmClick = async () => {
    const selectedDates = [];
    value.forEach((range) => {
      if (!range[1] && !isDisabledDate(range[0], extractedDates)) {
        selectedDates.push(new Date(range[0]).toISOString().split("T")[0]);
      } else {
        for (
          let date = new Date(range[0]);
          date <= range[1];
          date.setDate(date.getDate() + 1)
        ) {
          if (!isDisabledDate(new DateObject(date), extractedDates)) {
            selectedDates.push(date.toISOString().split("T")[0]);
          }
        }
      }
    });

    await fetch(`/api/timesheet/save?maxRetries=3`, {
      method: "POST",
      body: JSON.stringify({
        date: selectedDates,
        empCode: empCode,
        taskId: taskId,
        projectId: projectId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    refreshDisabledDates(selectedDates, 0);
  };

  const maxRetries = 3;
  const refreshDisabledDates = async (selectedDates, retryCount) => {
    if (retryCount >= maxRetries) return;
    setTimeout(async () => {
      const updated = await fetchExtractedDates(empCode, setExtractedDates);
      const allDatesDisabled = selectedDates.every((dateStr) =>
        updated.includes(dateStr)
      );
      if (!allDatesDisabled) {
        refreshDisabledDates(selectedDates, retryCount + 1);
      } else {
        const failedDates = selectedDates.reduce((arr, date) => {
          if (!updated.includes(date)) {
            arr.push(new Array([date, date]));
          }
        }, []);
        setValue(failedDates);
      }
    }, 3000);
  };

  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  return (
    <div>
      <DatePicker
        className="red"
        {...props}
        inputClass="p-3"
        value={value}
        onChange={handleValueChange}
        multiple
        range
        minDate={threeMonthsAgo}
        maxDate={new Date()}
        format="YYYY-MM-DD"
        mapDays={({ date }) => {
          const isDisabled = isDisabledDate(date, extractedDates);
          return {
            disabled: isDisabled,
          };
        }}
      >
        <Button
          disabled={disabled}
          variant="destructive"
          className="mb-3"
          onClick={handleConfirmClick}
        >
          Confirm
        </Button>
      </DatePicker>
    </div>
  );
};

export default Calendar;
