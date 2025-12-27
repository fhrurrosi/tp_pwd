import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if(!session) {
    redirect("/login");
  }
  if (session) {
    if (session.user.role === "ADMIN") {
      redirect("/admin/dashboard");
    }
    redirect("/ui_user/dashboard");
  }
}
