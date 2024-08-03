import Calendar from "@/components/Calendar";
import { GET } from "@/lib/utils";
import { cookies } from "next/headers";

const TimeSheet = async () => {
  const empCode = cookies().get("empCode");
  const res = await GET(`${process.env.DETAILS_OF_TIMESHEET}/${empCode.value}`);
  const { data } = await res.json();
  const taskId = data[0]?.compositeKey?.taskId;
  const projectId = data[0]?.compositeKey?.projectId;
  return (
    <div className="flex flex-col text-center mt-3">
      <h1>Timesheet</h1>
      <div className="pt-3">
        <Calendar
          empCode={empCode.value}
          projectId={projectId}
          taskId={taskId}
        />
      </div>
    </div>
  );
};

export default TimeSheet;
