export async function POST(req) {
  try {
    const email = req.formData().get("email");
    const password = req.formData().get("password");
    const detailByUsername = await fetch(
      `https//toolsaks-cloud.prodapt.com/app/live/revamp/helpdeskentity/employeedetailbyusername/${
        email.split("@")[0]
      }`
    );
    if (detailByUsername.get("employeeId") === password) {
    }
    return new Response(await req.json(), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: "User Authenticated" }),
    });
  } catch (e) {
    return new Response(e.status, {
      status: 403,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: e.message }),
    });
  }
}
