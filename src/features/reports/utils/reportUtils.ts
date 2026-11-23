export const REPORT_PAGE_SIZE = 10;

const two = (n: number) =>
  n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const pad = (n: number) => String(n).padStart(2, "0");

export const money = (n: number) => `₹${two(n)}`;
export const moneyPdf = (n: number) => `Rs. ${two(n)}`;

/** Local date as dd/mm/yyyy. */
export const dmy = (d: Date | null | undefined) =>
  d ? `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}` : "-";

export const scrollTop = () => {
  window.scrollTo({ top: 0 });
  document.querySelector("main")?.scrollTo({ top: 0 });
};