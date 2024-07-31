"use server";
import { GET } from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
      const baseUrl = process.env.BASE_URL || "http://localhost:3000";
      cookies().set({
        name: "empCode",
        value: employeeCode,
        path: "/",
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "strict",
      });
      cookies().set({
        name: "password",
        value: employeeId,
        path: "/",
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "strict",
      });
      cookies().set({
        name: "email",
        value: email,
        path: "/",
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "strict",
      });
      cookies().set({
        name: "fullName",
        value: fullName,
        path: "/",
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "strict",
      });
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
