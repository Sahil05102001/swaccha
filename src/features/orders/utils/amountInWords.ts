const ONES = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen",
];

const TENS = [
  "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
];

// 0 to 99
function underHundred(n: number): string {
  if (n < 20) return ONES[n];
  const unit = n % 10;
  return unit ? `${TENS[Math.floor(n / 10)]}-${ONES[unit]}` : TENS[Math.floor(n / 10)];
}

// 0 to 999
function underThousand(n: number): string {
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  const parts: string[] = [];

  if (hundreds) parts.push(`${ONES[hundreds]} Hundred`);
  if (rest) parts.push(underHundred(rest));

  return parts.join(" ");
}

/** Whole rupees in the Indian system (thousand, lakh, crore). */
function rupeesInWords(rupees: number): string {
  if (rupees === 0) return "Zero";

  const parts: string[] = [];
  let rest = rupees;

  const crore = Math.floor(rest / 10_000_000);
  rest %= 10_000_000;
  const lakh = Math.floor(rest / 100_000);
  rest %= 100_000;
  const thousand = Math.floor(rest / 1000);
  rest %= 1000;

  // Crores can themselves be large, so they are spoken in the same way.
  if (crore) parts.push(`${rupeesInWords(crore)} Crore`);
  if (lakh) parts.push(`${underHundred(lakh)} Lakh`);
  if (thousand) parts.push(`${underHundred(thousand)} Thousand`);
  if (rest) parts.push(underThousand(rest));

  return parts.join(" ");
}

/** 123456 paise -> "Rupees One Thousand Two Hundred Thirty-Four and Fifty-Six Paise Only" */
export function amountInWords(paise: number): string {
  const total = Math.max(0, Math.round(paise));
  const rupees = Math.floor(total / 100);
  const remainder = total % 100;

  const rupeeText = `Rupees ${rupeesInWords(rupees)}`;

  return remainder
    ? `${rupeeText} and ${underHundred(remainder)} Paise Only`
    : `${rupeeText} Only`;
}