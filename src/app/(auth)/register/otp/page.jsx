import { redirect } from "next/navigation";
import Otp from "./otp";

export default async function OtpPage({ searchParams }) {
    const { email } = await searchParams;
  if (!email) { 
    redirect("/lupa_password");
  } 

  return <Otp email={email} />;
}