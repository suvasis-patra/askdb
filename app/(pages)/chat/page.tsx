import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import ChatInterface from "@/components/custom/chat-interface";

export default async function ChatPage() {
  try {
    const hdrs = await headers();
    const session = await auth.api.getSession({ headers: hdrs });

    if (!session) {
      return redirect("/signin");
    }

    return <ChatInterface userInitial={session.user.email[0]} />;
  } catch (error) {
    console.error("Failed to get session:", error);
    return redirect("/signin");
  }
}
