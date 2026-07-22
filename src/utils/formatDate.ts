import type { Timestamp } from "firebase/firestore";

export function formatDate(
  value?: Timestamp | Date | null
) {
  if (!value) return "-";

  const date =
    value instanceof Date
      ? value
      : value.toDate();

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}