export const revalidate = 0; // revalidate every time
export async function GET(req, { params }) {
  try {
    const empCode = params.empCode;
    const response = await fetch(
      `${process.env.DETAILS_OF_TIMESHEET}/${empCode}`,
      {
        headers: {
          Authorization: `Basic ${process.env.AUTH_TOKEN}`,
        },
        method: "GET",
      }
    );
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
