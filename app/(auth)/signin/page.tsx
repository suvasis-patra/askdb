import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { SigninForm } from "@/components/custom/sign-in-form";

export default async function SigninPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    redirect("/chat");
  }
  return <SigninForm />;
}
