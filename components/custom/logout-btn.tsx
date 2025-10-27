"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { LogOut } from "lucide-react";

import { Spinner } from "../ui/spinner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function LogoutBtn() {
  const router = useRouter();
  const [showLoader, setShowLoader] = useState(false);

  const handleLogout = async () => {
    setShowLoader(true);

    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/signin");
          },
        },
      });
    } catch (error) {
      console.error("Logout failed:", error);
      setShowLoader(false);
    }
  };

  return (
    <Button
      onClick={handleLogout}
      variant="ghost"
      disabled={showLoader}
      className="w-full justify-start px-3 py-1.5 text-sm border border-amber-500/40 text-amber-400 
                 hover:bg-amber-500/10 hover:text-amber-300 transition-all duration-200 
                 focus:outline-none flex items-center gap-2 rounded-md"
    >
      {showLoader ? (
        <span className="inline-flex items-center gap-2">
          <Spinner className="text-amber-400" />
          <span className="text-gray-300">Logging out...</span>
        </span>
      ) : (
        <>
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </>
      )}
    </Button>
  );
}
