import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    if (session.user.role === "admin") {
      redirect("/admin/dashboard");
    }
    redirect("/user/dashboard");
  }
  return <LoginForm />;
}
