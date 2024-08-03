"use server";
import { GET } from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function setCookie(key, value) {
  cookies().set({
    name: key,
    value: value,
    path: "/",
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "strict",
  });
}

export const handleLogin = async (FormData) => {
  const email = FormData.get("email");
  const password = FormData.get("password");
  const detailByUsername = await GET(
    process.env.DETAILS_BY_USERNAME + email.split("@")[0]
  )
    .then((response) => response.json())
    .catch((e) => console.error(e));
  if (detailByUsername) {
    const { employeeId, employeeCode, email, fullName } = detailByUsername;
    if (+password === employeeId) {
      console.log("Cookies set");
      setCookie("empCode", employeeCode);
      setCookie("password", employeeId);
      setCookie("email", email);
      setCookie("fullName", fullName);
      const baseUrl = process.env.BASE_URL || "http://localhost:3000";
      redirect(baseUrl);
    } else {
      // TODO: password not matching
      console.log("Password not matching");
    }
  } else {
    // TODO: email not found
    console.log("Email not found");
  }
};
