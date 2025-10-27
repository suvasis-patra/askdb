import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isSafeSQLQuery(sql: string): boolean {
  const forbidden = [
    "insert",
    "update",
    "delete",
    "drop",
    "alter",
    "truncate",
    "create",
    "replace",
    "grant",
    "revoke",
    "comment",
    "commit",
    "rollback",
    "set",
  ];

  const lower = sql.toLowerCase().trim();

  if (!/^(\s*select|\s*with)/.test(lower)) return false;

  if (forbidden.some((kw) => lower.includes(kw))) return false;

  if (lower.includes(";")) return false;

  return true;
}
