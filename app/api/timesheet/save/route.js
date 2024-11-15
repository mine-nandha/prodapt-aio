export async function GET() {
  try {
    return new Response(JSON.stringify({ message: "Hello" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(req) {
  try {
    const { selectedDates, empCode, taskId, projectId } = await req.json();
    const failedDates = [...selectedDates];
    for (const day of selectedDates) {
      if (await saveAndSubmitDay(day, empCode, taskId, projectId)) {
        failedDates.splice(failedDates.indexOf(day), 1);
      }
    }

    return new Response(
      JSON.stringify({
        message:
          failedDates.length === 0
            ? `Booked`
            : `Failed to book for the following dates ${failedDates.toString()}`,
        failedDates: failedDates,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    console.log(e);
    return new Response(JSON.stringify({ error: e }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

const maxRetries = 3;
export async function saveAndSubmitDay(day, empCode, taskId, projectId) {
  let saveOk = false;
  let retries = 0;

  while (!saveOk && retries < maxRetries) {
    const save = await fetch(process.env.SAVE_TIMESHEET, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${process.env.AUTH_TOKEN}`,
      },
      method: "POST",
      body: JSON.stringify({
        emp_code: empCode,
        book_date: day,
        project_id: projectId,
        task_id: taskId,
        hours_logged: "8",
        remarks_s: " ",
      }),
    });
    if (save.ok) {
      console.log(`Save for ${day}: ${await save.ok}`);
      const submit = await fetch(process.env.SUBMIT_TIMESHEET, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${process.env.AUTH_TOKEN}`,
        },
        method: "POST",
        body: JSON.stringify({
          empCode: empCode,
          bookDate: day,
          projectId: projectId,
          taskId: taskId,
        }),
      });
      console.log(`Submit for ${day}: ${await submit.ok}`);
      if (submit.ok) {
        saveOk = true;
      } else {
        console.log(`Submit failed for ${day}, retrying...`);
      }
    } else {
      console.log(`Save failed for ${day}, retrying...`);
    }
    retries++;
  }

  if (!saveOk) {
    console.log(
      `Failed to save and submit for ${day} after ${maxRetries} retries.`
    );
    return false;
  } else {
    return true;
  }
}
