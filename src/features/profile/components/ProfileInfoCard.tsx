import {
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";

interface ProfileInfoCardProps {
  user: any;
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  onSaveProfile: () => void;
  // Return false (or throw) when sending fails, so the cooldown doesn't start.
  onVerifyEmail: () => void | boolean | Promise<void | boolean>;
  onRefreshStatus: () => void;
}

const RESEND_SECONDS = 60;

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
  "& .MuiInputBase-input": { color: COLORS.text },
};

const pillBase = {
  borderRadius: 999,
  px: 3,
  py: 1,
  fontWeight: 600,
  fontSize: "0.875rem",
  textTransform: "none",
  boxShadow: "none",
  transition: "none",
};

const primaryButtonSx = {
  ...pillBase,
  bgcolor: COLORS.black,
  color: COLORS.white,
  "&:hover": { bgcolor: COLORS.text, boxShadow: "none" },
  "&.Mui-disabled": { bgcolor: COLORS.border, color: COLORS.muted },
};

const secondaryButtonSx = {
  ...pillBase,
  color: COLORS.text,
  borderColor: COLORS.border,
  "&:hover": {
    borderColor: COLORS.text,
    bgcolor: "transparent",
    boxShadow: "none",
  },
};

/**
 * Resend cooldown. The end time is stored in localStorage (per user), so
 * refreshing the page doesn't reset the timer.
 */
function useResendCooldown(userKey: string) {
  const storageKey = `verifyEmailCooldownEnd:${userKey}`;

  const [endsAt, setEndsAt] = useState<number>(() => {
    try {
      return Number(localStorage.getItem(storageKey)) || 0;
    } catch {
      return 0;
    }
  });
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (endsAt <= Date.now()) return;

    setNow(Date.now());
    const id = window.setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= endsAt) window.clearInterval(id);
    }, 1000);

    return () => window.clearInterval(id);
  }, [endsAt]);

  const start = () => {
    const end = Date.now() + RESEND_SECONDS * 1000;
    try {
      localStorage.setItem(storageKey, String(end));
    } catch {
      // Storage unavailable (private mode etc.): the timer still works in memory.
    }
    setNow(Date.now());
    setEndsAt(end);
  };

  return {
    remaining: Math.max(0, Math.ceil((endsAt - now) / 1000)),
    hasSent: endsAt > 0,
    start,
  };
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      sx={{
        mb: 0.75,
        fontSize: "0.75rem",
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        color: COLORS.muted,
      }}
    >
      {children}
    </Typography>
  );
}

export default function ProfileInfoCard({
  user,
  name,
  setName,
  onSaveProfile,
  onVerifyEmail,
  onRefreshStatus,
}: ProfileInfoCardProps) {
  const displayName: string = user.displayName ?? "";
  const initial = displayName.trim().charAt(0).toUpperCase() || "U";

  const trimmedName = name.trim();
  const canSave = trimmedName.length > 0 && trimmedName !== displayName.trim();

  const { remaining, hasSent, start } = useResendCooldown(user.uid);
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (sending || remaining > 0) return;

    setSending(true);
    try {
      const result = await onVerifyEmail();
      // Start the cooldown unless the parent reported a failure.
      if (result !== false) start();
    } catch {
      // The parent shows the error; no cooldown on failure.
    } finally {
      setSending(false);
    }
  };

  const sendLabel = sending
    ? "Sending..."
    : remaining > 0
      ? `Resend in ${remaining}s`
      : hasSent
        ? "Resend verification email"
        : "Send verification email";

  return (
    <Paper
      variant="outlined"
      elevation={0}
      sx={{
        borderRadius: 3,
        borderColor: COLORS.border,
        bgcolor: COLORS.white,
        backgroundImage: "none",
        boxShadow: "none",
        overflow: "hidden",
      }}
    >
      {/* Identity header */}
      <Stack
        direction="row"
        spacing={2}
        sx={{
          p: { xs: 2, sm: 3 },
          alignItems: "center",
          borderBottom: `1px solid ${COLORS.border}`,
        }}
      >
        <Avatar
          src={user.photoURL ?? undefined}
          alt={displayName || "User"}
          sx={{
            width: { xs: 56, sm: 64 },
            height: { xs: 56, sm: 64 },
            fontSize: { xs: 22, sm: 26 },
            fontWeight: 600,
            bgcolor: COLORS.black,
            color: COLORS.white,
          }}
        >
          {initial}
        </Avatar>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.05rem", sm: "1.2rem" },
              color: COLORS.text,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {displayName || "Your account"}
          </Typography>

          <Typography
            sx={{
              fontSize: "0.85rem",
              color: COLORS.muted,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {user.email}
          </Typography>
        </Box>
      </Stack>

      {/* Details */}
      <Stack spacing={3} sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Full name */}
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            if (canSave) onSaveProfile();
          }}
        >
          <FieldLabel>Full name</FieldLabel>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{ alignItems: { sm: "flex-start" } }}
          >
            <TextField
              fullWidth
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              sx={fieldSx}
              slotProps={{ htmlInput: { "aria-label": "Full name" } }}
            />

            <Button
              type="submit"
              disableRipple
              disableElevation
              variant="contained"
              disabled={!canSave}
              sx={{
                ...primaryButtonSx,
                flexShrink: 0,
                width: { xs: "100%", sm: "auto" },
              }}
            >
              Save changes
            </Button>
          </Stack>
        </Box>

        {/* Email + verification */}
        <Box>
          <FieldLabel>Email</FieldLabel>

          <Stack
            direction="row"
            spacing={1.5}
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              rowGap: 1,
            }}
          >
            <Typography
              sx={{
                minWidth: 0,
                fontSize: "0.95rem",
                color: COLORS.text,
                wordBreak: "break-all",
              }}
            >
              {user.email}
            </Typography>

            <Chip
              size="small"
              variant="outlined"
              icon={
                user.emailVerified ? (
                  <CheckCircleOutlineRoundedIcon />
                ) : (
                  <ErrorOutlineRoundedIcon />
                )
              }
              label={user.emailVerified ? "Verified" : "Not verified"}
              sx={{
                fontWeight: 600,
                fontSize: "0.75rem",
                color: COLORS.text,
                borderColor: user.emailVerified ? COLORS.blue : COLORS.border,
                "& .MuiChip-icon": {
                  fontSize: 16,
                  color: user.emailVerified ? COLORS.blue : COLORS.muted,
                },
              }}
            />
          </Stack>

          {!user.emailVerified && (
            <Box
              sx={{
                mt: 1.5,
                p: { xs: 1.5, sm: 2 },
                border: `1px solid ${COLORS.border}`,
                borderRadius: 2,
                bgcolor: "#FAFAFA",
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.8rem",
                  lineHeight: 1.6,
                  color: COLORS.muted,
                }}
              >
                Verify your email to secure your account. After clicking the
                link we send you, come back and refresh your status.
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                sx={{ mt: 1.5 }}
              >
                <Button
                  disableRipple
                  disableElevation
                  variant="contained"
                  onClick={handleSend}
                  disabled={sending || remaining > 0}
                  sx={primaryButtonSx}
                >
                  {sendLabel}
                </Button>

                <Button
                  disableRipple
                  variant="outlined"
                  onClick={onRefreshStatus}
                  sx={secondaryButtonSx}
                >
                  Refresh status
                </Button>
              </Stack>

              {hasSent && (
                <Typography
                  sx={{
                    mt: 1.5,
                    fontSize: "0.75rem",
                    lineHeight: 1.5,
                    color: COLORS.muted,
                  }}
                >
                  Can't find it? Check your Spam or Junk folder and mark it
                  as "Not spam".
                </Typography>
              )}
            </Box>
          )}
        </Box>

        {/* User ID */}
        <Box sx={{ pt: 2, borderTop: `1px solid ${COLORS.border}` }}>
          <FieldLabel>User ID</FieldLabel>

          <Typography
            sx={{
              fontFamily: "monospace",
              fontSize: "0.78rem",
              color: COLORS.muted,
              wordBreak: "break-all",
            }}
          >
            {user.uid}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}