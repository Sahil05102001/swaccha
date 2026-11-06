import { useEffect, useState, type FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Link as MuiLink,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";

import { auth } from "@/firebase/auth";

const COLORS = {
  blue: "#00D9FF",
  white: "#FFFFFF",
  black: "#000000",
  text: "#212121",
  muted: "#757575",
  border: "#E0E0E0",
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    bgcolor: COLORS.white,
    "& fieldset": { borderColor: COLORS.border, transition: "none" },
    "&:hover fieldset": { borderColor: COLORS.muted },
    "&.Mui-focused fieldset": { borderColor: COLORS.blue, borderWidth: 1 },
  },
  "& .MuiInputLabel-root": { color: COLORS.muted, transition: "none" },
  "& .MuiInputLabel-root.Mui-focused": { color: COLORS.text },
  "& .MuiInputBase-input": { color: COLORS.text },
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Most sites use 30-60 seconds before allowing another reset email.
const COOLDOWN_SECONDS = 60;
const STORAGE_KEY = "forgotPasswordCooldownEnd";

function readStoredCooldownEnd(): number | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const end = raw ? Number(raw) : NaN;
    return Number.isFinite(end) && end > Date.now() ? end : null;
  } catch {
    return null;
  }
}

function storeCooldownEnd(end: number | null) {
  try {
    if (end === null) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, String(end));
    }
  } catch {
    // Storage unavailable; the timer still works for this page visit.
  }
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Cooldown survives a page refresh, so reloading doesn't bypass it.
  const [cooldownEnd, setCooldownEnd] = useState<number | null>(
    readStoredCooldownEnd
  );
  const [secondsLeft, setSecondsLeft] = useState(() => {
    const end = readStoredCooldownEnd();
    return end ? Math.ceil((end - Date.now()) / 1000) : 0;
  });
  const [sent, setSent] = useState(() => readStoredCooldownEnd() !== null);

  useEffect(() => {
    if (cooldownEnd === null) {
      setSecondsLeft(0);
      return;
    }

    // Based on the end timestamp, so it stays accurate in background tabs.
    const tick = () => {
      const remaining = Math.ceil((cooldownEnd - Date.now()) / 1000);

      if (remaining <= 0) {
        setSecondsLeft(0);
        setCooldownEnd(null);
        storeCooldownEnd(null);
      } else {
        setSecondsLeft(remaining);
      }
    };

    tick();
    const interval = window.setInterval(tick, 1000);

    return () => window.clearInterval(interval);
  }, [cooldownEnd]);

  const startCooldown = () => {
    const end = Date.now() + COOLDOWN_SECONDS * 1000;
    setCooldownEnd(end);
    setSecondsLeft(COOLDOWN_SECONDS);
    storeCooldownEnd(end);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (secondsLeft > 0 || loading) return;

    setSubmitError(null);

    const trimmed = email.trim();

    if (!trimmed) {
      setFieldError("Email is required");
      return;
    }

    if (!EMAIL_PATTERN.test(trimmed)) {
      setFieldError("Enter a valid email address");
      return;
    }

    setFieldError(null);
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, trimmed);
      setSent(true);
      startCooldown();
    } catch (error: unknown) {
      const code = (error as { code?: string }).code;

      if (code === "auth/user-not-found") {
        // Don't reveal whether an account exists for this email.
        setSent(true);
        startCooldown();
      } else if (code === "auth/invalid-email") {
        setFieldError("Enter a valid email address");
      } else if (code === "auth/too-many-requests") {
        setSubmitError("Too many attempts. Please try again later.");
      } else {
        setSubmitError(
          error instanceof Error
            ? error.message
            : "Could not send the reset email. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const onCooldown = secondsLeft > 0;

  const buttonLabel = loading
    ? "Sending..."
    : onCooldown
      ? `Resend in ${formatTime(secondsLeft)}`
      : sent
        ? "Resend link"
        : "Send reset link";

  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 2, sm: 3 },
        py: { xs: 3, sm: 6 },
        bgcolor: COLORS.white,
      }}
    >
      <Paper
        variant="outlined"
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 440,
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          borderColor: COLORS.border,
          bgcolor: COLORS.white,
          backgroundImage: "none",
          boxShadow: "none",
        }}
      >
        <Typography
          component="h1"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "1.5rem", sm: "1.75rem" },
            letterSpacing: "-0.01em",
            color: COLORS.text,
          }}
        >
          Forgot password?
        </Typography>

        <Typography
          sx={{
            mt: 0.5,
            fontSize: "0.9rem",
            lineHeight: 1.6,
            color: COLORS.muted,
          }}
        >
          Enter the email linked to your account and we'll send you a link to
          reset your password.
        </Typography>

        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{
            mt: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
          }}
        >
          {sent && (
            <Stack spacing={1.5}>
              <Alert
                severity="success"
                variant="outlined"
                sx={{ borderRadius: 2, fontSize: "0.85rem" }}
              >
                If an account exists for that email, a reset link is on its
                way.
              </Alert>

              {/* Spam folder note */}
              <Box
                role="note"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  px: 1.75,
                  py: 1.25,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 2,
                  bgcolor: "#FAFAFA",
                }}
              >
                <InfoOutlinedIcon
                  sx={{
                    fontSize: 18,
                    flexShrink: 0,
                    color: COLORS.muted,
                  }}
                />

                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    lineHeight: 1.6,
                    color: COLORS.muted,
                  }}
                >
                  Can't find it? Check your Spam or Junk folder and mark it as{" "}
                  <Box
                    component="span"
                    sx={{ fontWeight: 600, color: COLORS.text }}
                  >
                    "Not spam"
                  </Box>
                  .
                </Typography>
              </Box>
            </Stack>
          )}

          {submitError && (
            <Alert
              severity="error"
              variant="outlined"
              sx={{ borderRadius: 2, fontSize: "0.85rem" }}
            >
              {submitError}
            </Alert>
          )}

          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            fullWidth
            sx={fieldSx}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldError) setFieldError(null);
            }}
            error={!!fieldError}
            helperText={fieldError}
          />

          <Button
            type="submit"
            fullWidth
            disableRipple
            disableElevation
            variant="contained"
            disabled={loading || onCooldown}
            sx={{
              py: 1.4,
              borderRadius: 999,
              fontWeight: 600,
              fontSize: "0.95rem",
              textTransform: "none",
              boxShadow: "none",
              transition: "none",
              fontVariantNumeric: "tabular-nums",
              bgcolor: COLORS.black,
              color: COLORS.white,
              "&:hover": { bgcolor: COLORS.text, boxShadow: "none" },
              "&.Mui-disabled": {
                bgcolor: COLORS.border,
                color: COLORS.muted,
              },
            }}
          >
            {buttonLabel}
          </Button>
        </Box>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <MuiLink
            component={Link}
            to="/login"
            underline="hover"
            sx={{ fontSize: "0.875rem", fontWeight: 600, color: COLORS.text }}
          >
            Back to log in
          </MuiLink>
        </Box>
      </Paper>
    </Box>
  );
}