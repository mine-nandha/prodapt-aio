"use server";

import { sendMail } from "@/lib/mail";
import { deleteOtp, store } from "@/lib/store";
import { GET } from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const handleOtp = async (FormData) => {
  const email = FormData.get("email");
  const generatedOtp = store.get(email);
  console.log(generatedOtp);
  if (generatedOtp) {
    const otp = FormData.get("otp");
    if (otp === generatedOtp) {
      console.log("OTP verified successfully");
      deleteOtp(email);
      const detailByUsername = await GET(
        process.env.DETAILS_BY_USERNAME + email.split("@")[0]
      )
        .then((response) => response.json())
        .catch((e) => console.error(e));
      const { employeeId, employeeCode, fullName } = detailByUsername;
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
      redirect(`${baseUrl}/profile`);
    } else {
      console.log("Invalid OTP");
    }
  } else {
    console.log("OTP generation failed");
  }
};

export const handleOtpMail = async (FormData) => {
  // generate and send OTP to the given email address
  const email = FormData.get("email");
  const generatedOtp = crypto
    .getRandomValues(new Uint32Array(6))[0]
    .toString()
    .substring(0, 6) //takes first 6 characters if there are more than 6 characters
    .padStart(6, "0"); //fill zeros before the string if the character is less than 6
  store.set(email, generatedOtp);
  await sendMail(
    email,
    `OTP is ${generatedOtp}`,
    encodeURIComponent("<div>Hello</div>")
  );
};
