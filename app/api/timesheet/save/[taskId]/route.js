import { createLog } from "@/lib/utils";
import { saveAndSubmitDay } from "../route";

export const revalidate = 0; // revalidate every time
export async function GET(req, { params }) {}

export async function POST(req, { params }) {
  const id = params.taskId;
  try {
    const { projectId, taskId, empCode } = await req.json();
    if (
      await saveAndSubmitDay(
        new Date().toISOString().split("T")[0],
        empCode,
        taskId,
        projectId
      )
    ) {
      await createLog(process.env.CRON_URL, id, {
        response: {
          status: 200,
          message: "Success",
          date: new Date().toISOString().split("T")[0],
        },
      });
    } else {
      await createLog(process.env.CRON_URL, id, {
        response: {
          status: 500,
          message: "Already Booked",
          date: new Date().toISOString().split("T")[0],
        },
      });
    }
    return new Response(null);
  } catch (e) {
    await createLog(process.env.CRON_URL, id, {
      response: {
        status: 400,
        message: e.message,
        date: new Date().toISOString().split("T")[0],
      },
    });
  }
}
