// One place for the password rules, used by the schema (to block weak
// passwords) and by the register page (to show the strength meter).

export const PASSWORD_MIN_LENGTH = 10;

export interface PasswordContext {
  email?: string;
  fullName?: string;
}

export interface PasswordCheck {
  id: string;
  /** Shown in the checklist. */
  label: string;
  /** Used in the error message, e.g. "Password needs: a number". */
  short: string;
  met: boolean;
}

export type PasswordLevel = "none" | "weak" | "fair" | "good" | "strong";

export interface PasswordStrength {
  level: PasswordLevel;
  label: string;
  /** 0 to 4 filled segments. */
  score: number;
  /** True when every requirement is met. */
  ok: boolean;
  checks: PasswordCheck[];
}

const BLOCKED_PARTS = [
  "password",
  "passw0rd",
  "qwerty",
  "asdfgh",
  "123456",
  "654321",
  "abcdef",
  "letmein",
  "welcome",
  "iloveyou",
  "admin",
  "swachha",
];

const letters = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

function isCommonOrPatterned(password: string): boolean {
  const lower = password.toLowerCase();

  return (
    BLOCKED_PARTS.some((part) => lower.includes(part)) ||
    /(.)\1{3,}/.test(password) // e.g. aaaa or 1111
  );
}

function containsPersonalInfo(password: string, context: PasswordContext): boolean {
  const normalised = letters(password);
  const parts: string[] = [];

  const emailName = context.email?.split("@")[0];
  if (emailName) parts.push(letters(emailName));

  context.fullName
    ?.split(/\s+/)
    .forEach((word) => parts.push(letters(word)));

  return parts.some((part) => part.length >= 4 && normalised.includes(part));
}

/** Context-free requirements (used by the schema's password field). */
export function getPasswordChecks(
  password: string,
  context: PasswordContext = {},
): PasswordCheck[] {
  return [
    {
      id: "length",
      label: `At least ${PASSWORD_MIN_LENGTH} characters`,
      short: `${PASSWORD_MIN_LENGTH}+ characters`,
      met: password.length >= PASSWORD_MIN_LENGTH,
    },
    {
      id: "upper",
      label: "An uppercase letter (A-Z)",
      short: "an uppercase letter",
      met: /[A-Z]/.test(password),
    },
    {
      id: "lower",
      label: "A lowercase letter (a-z)",
      short: "a lowercase letter",
      met: /[a-z]/.test(password),
    },
    {
      id: "number",
      label: "A number (0-9)",
      short: "a number",
      met: /\d/.test(password),
    },
    {
      id: "symbol",
      label: "A symbol (like ! @ # ?)",
      short: "a symbol",
      met: /[^A-Za-z0-9]/.test(password),
    },
    {
      id: "common",
      label: "Not a common word or pattern",
      short: "a less common password",
      met: password.length > 0 && !isCommonOrPatterned(password),
    },
    {
      id: "personal",
      label: "Doesn't contain your name or email",
      short: "a password without your name or email",
      met: password.length > 0 && !containsPersonalInfo(password, context),
    },
  ];
}

export function getPasswordStrength(
  password: string,
  context: PasswordContext = {},
): PasswordStrength {
  const checks = getPasswordChecks(password, context);

  if (!password) {
    return { level: "none", label: "", score: 0, ok: false, checks };
  }

  const metCount = checks.filter((check) => check.met).length;
  const ok = metCount === checks.length;

  if (ok) {
    return password.length >= 12
      ? { level: "strong", label: "Strong", score: 4, ok, checks }
      : { level: "good", label: "Good", score: 3, ok, checks };
  }

  return metCount >= 5
    ? { level: "fair", label: "Fair", score: 2, ok, checks }
    : { level: "weak", label: "Weak", score: 1, ok, checks };
}