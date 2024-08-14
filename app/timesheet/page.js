import CalendarWrapper from "@/components/Calendar";
import { GET } from "@/lib/utils";
import { cookies } from "next/headers";

const TimeSheet = async () => {
  const empCode = cookies().get("empCode");
  const res = await GET(`${process.env.DETAILS_OF_TIMESHEET}/${empCode.value}`);
  const { data } = await res.json();
  const taskId = data[0]?.compositeKey?.taskId;
  const projectId = data[0]?.compositeKey?.projectId;
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
      <h1>Timesheet</h1>
      <div className="pt-3">
        <CalendarWrapper
          BASE_URL={process.env.BASE_URL}
          CRON_URL={process.env.CRON_URL}
          empCode={empCode.value}
          taskId={taskId}
          projectId={projectId}
        />
      </div>
    </div>
  );
};

export default TimeSheet;
