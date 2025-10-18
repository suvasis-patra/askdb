"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Spinner } from "../ui/spinner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function LogoutBtn() {
  const router = useRouter();
  const [showLoader, setShowLoader] = useState(false);
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setShowLoader(true);
          router.push("/signin");
        },
      },
    });
  };
  return (
    <Button
      onClick={handleLogout}
      variant={"ghost"}
      className="border focus:outline-none flex items-center gap-2 border-amber-500 text-amber-400 hover:bg-amber-500 cursor-pointer"
    >
      {showLoader ? (
        <span className="inline-flex gap-2 items-center justify-center">
          <Spinner className="text-white" />
          loggin out...
        </span>
      ) : (
        "Logout"
      )}
    </Button>
  );
}
