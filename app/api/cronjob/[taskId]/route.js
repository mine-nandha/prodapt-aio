import { saveAndSubmitDay } from "../../timesheet/save/route";

export const revalidate = 0; // revalidate every time
export async function GET(req, { params }) {
  try {
    const id = params.taskId;
    const taskResult = await fetch(`${process.env.CRON_URL}/tasks/${id}`);
    const { name, cron, creator, taskId, projectId } = await taskResult.json();
    if (name && name === "Timesheet") {
      const res = await saveAndSubmitDay(
        new Date().toISOString().split("T")[0],
        creator,
        taskId,
        projectId
      );
      return new Response(res, {
        status: res ? 200 : 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      
    }
    return new Response(
      JSON.stringify({
        taskId: id,
        response: {
          status: 200,
          body: {
            ticketId: "",
            taskRes: cron,
          },
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
