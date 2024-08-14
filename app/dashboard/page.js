import { columns } from "@/components/DataTable/column";
import { DataTable } from "@/components/DataTable/DataTable";
import { cookies } from "next/headers";
const cronParser = require("cron-parser");

const getData = async (empCode) => {
  const res = await fetch(`${process.env.CRON_URL}/tasks/${empCode}`);
  const tasks = await res.json();
  const now = new Date();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const result = [];
  //Future executions
  tasks.forEach((task) => {
    const interval = cronParser.parseExpression(task.cron, {
      currentDate: now,
    });
    while (true) {
      try {
        const next = interval.next().toDate();
        if (next > endOfMonth) break;

        result.push({
          id: task.id,
          ticketId: null,
          status: "pending",
          task: task.name,
          scheduledAt: next,
        });
      } catch (err) {
        break;
      }
    }
    //Past executions
    if (task.logs && task.logs.length > 0) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      task.logs.forEach((log) => {
        const executedAt = new Date(log.executedAt);
        if (
          executedAt.getDate() >= yesterday.getDate() &&
          executedAt.getMonth() === yesterday.getMonth() &&
          executedAt.getFullYear() === yesterday.getFullYear()
        ) {
          const status = log.response.status === 200 ? "success" : "failed";
          const ticketId =
            log.response.status === 200 ? log.response.body.ticketId : null;

          result.push({
            id: task.id,
            ticketId: ticketId,
            status: status,
            task: task.name,
            scheduledAt: executedAt,
          });
        }
      });
    }
  });

  result.sort((a, b) => a.scheduledAt - b.scheduledAt);

  return result.map((task) => ({
    id: task.id,
    ticketId: task.ticketId,
    status: task.status,
    task: task.task,
    scheduledDate: task.scheduledAt.toISOString().split("T")[0],
  }));
};

const Dashboard = async () => {
  const empCode = cookies().get("empCode");
  const data = await getData(empCode.value);
  return (
    <div>
      <h1 className="text-center mt-4">Dashboard</h1>
      <div className="container mx-auto">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default Dashboard;
