import React from "react";
import { CheckCircle, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export type TShowMessageProps = {
  type: "info" | "error";
  message: string;
  className?: string;
};

const ShowMessage = ({ type, message, className }: TShowMessageProps) => {
  const isInfo = type === "info";

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg p-4 text-sm font-medium shadow-md border transition-all",
        isInfo
          ? "bg-amber-500/10 border-amber-400 text-amber-300"
          : "bg-red-500/10 border-red-500 text-red-400",
        className
      )}
    >
      {isInfo ? (
        <CheckCircle size={20} className="text-amber-400 flex-shrink-0" />
      ) : (
        <TriangleAlert size={20} className="text-red-400 flex-shrink-0" />
      )}
      <span>{message}</span>
    </div>
  );
};

export default ShowMessage;
