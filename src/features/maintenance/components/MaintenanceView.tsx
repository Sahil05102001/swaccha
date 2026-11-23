import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Link, Stack, Typography } from "@mui/material";
import ConstructionOutlinedIcon from "@mui/icons-material/ConstructionOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

import RichText from "@/features/cms/policy/components/RichText";

import type { MaintenanceSettings } from "../types/maintenance";
import {
  formatBackTime,
  splitDuration,
  telLink,
  whatsappLink,
} from "../utils/time";

const BORDER = "1px solid #E2E8F0";

function useNow(active: boolean) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [active]);

  return now;
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <Box sx={{ textAlign: "center", minWidth: 64 }}>
      <Typography
        sx={{
          fontSize: "1.75rem",
          fontWeight: 800,
          lineHeight: 1.1,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {String(value).padStart(2, "0")}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}

interface Props {
  settings: MaintenanceSettings;
  /** Shows a "Check again" button when given. */
  onRetry?: () => void;
  retrying?: boolean;
  /** Admin preview: hides the admin login link. */
  preview?: boolean;
}

export default function MaintenanceView({
  settings,
  onRetry,
  retrying,
  preview,
}: Props) {
  const endsMs = settings.endsAt ? new Date(settings.endsAt).getTime() : NaN;
  const hasEnd = Number.isFinite(endsMs);

  const now = useNow(hasEnd && settings.showCountdown);
  const remaining = hasEnd ? endsMs - now : 0;
  const overdue = hasEnd && remaining <= 0;
  const time = splitDuration(remaining);

  const call = settings.contactPhone ? telLink(settings.contactPhone) : null;
  const whatsapp = settings.whatsapp ? whatsappLink(settings.whatsapp) : null;
  const email = settings.contactEmail.trim();
  const hasContact = settings.showContact && Boolean(call || whatsapp || email);

  return (
    <Box
      sx={{
        minHeight: preview ? "100%" : "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 6,
        bgcolor: "#F8FAFC",
      }}
    >
      <Box
        component="main"
        sx={{
          width: "100%",
          maxWidth: 560,
          bgcolor: "#fff",
          border: BORDER,
          borderRadius: 2,
          p: { xs: 3, sm: 5 },
          textAlign: "center",
        }}
      >
        <Typography
          component="div"
          sx={{
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontSize: "0.95rem",
            mb: 3,
          }}
        >
          Swachha
        </Typography>

        <Box
          sx={{
            width: 64,
            height: 64,
            mx: "auto",
            mb: 2.5,
            display: "grid",
            placeItems: "center",
            borderRadius: "50%",
            bgcolor: "#F1F5F9",
            color: "#0F172A",
          }}
        >
          <ConstructionOutlinedIcon sx={{ fontSize: 32 }} />
        </Box>

        <Typography
          component="h1"
          sx={{ fontSize: { xs: "1.6rem", sm: "2rem" }, fontWeight: 800, mb: 1.5 }}
        >
          {settings.title}
        </Typography>

        <Box
          sx={{
            width: "100%",
            textAlign: "center",
            color: "text.secondary",
            "& p, & div, & span, & li": {
              textAlign: "center",
            },
          }}
        >
          <RichText text={settings.reason} />
        </Box>

        {hasEnd && (
          <Box
            sx={{
              mt: 3,
              p: 2.5,
              border: BORDER,
              borderRadius: 1.5,
              bgcolor: "#F8FAFC",
            }}
          >
            {overdue ? (
              <>
                <Typography sx={{ fontWeight: 700 }}>
                  This is taking a little longer than planned.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Thank you for your patience. We'll be open as soon as we can.
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="body2" color="text.secondary">
                  We expect to be back on
                </Typography>
                <Typography sx={{ fontWeight: 700, mt: 0.5 }}>
                  {formatBackTime(settings.endsAt as string)}
                </Typography>

                {settings.showCountdown && (
                  <Stack
                    direction="row"
                    role="timer"
                    aria-live="off"
                    sx={{ mt: 2, justifyContent: "center", gap: 1 }}
                  >
                    <Unit value={time.days} label="Days" />
                    <Unit value={time.hours} label="Hours" />
                    <Unit value={time.minutes} label="Min" />
                    <Unit value={time.seconds} label="Sec" />
                  </Stack>
                )}
              </>
            )}
          </Box>
        )}

        {hasContact && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              Need help with an order? Reach us here:
            </Typography>
            <Stack
              direction="row"
              useFlexGap
              sx={{ flexWrap: "wrap", justifyContent: "center", gap: 1 }}
            >
              {call && (
                <Button
                  component="a"
                  href={call}
                  variant="outlined"
                  color="inherit"
                  size="small"
                  startIcon={<PhoneOutlinedIcon />}
                >
                  Call
                </Button>
              )}
              {whatsapp && (
                <Button
                  component="a"
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  color="inherit"
                  size="small"
                  startIcon={<WhatsAppIcon />}
                >
                  WhatsApp
                </Button>
              )}
              {email && (
                <Button
                  component="a"
                  href={`mailto:${email}`}
                  variant="outlined"
                  color="inherit"
                  size="small"
                  startIcon={<EmailOutlinedIcon />}
                >
                  Email
                </Button>
              )}
            </Stack>
          </Box>
        )}

        {onRetry && (
          <Button
            variant="contained"
            onClick={onRetry}
            disabled={retrying}
            sx={{ mt: 3 }}
          >
            {retrying ? "Checking…" : "Check again"}
          </Button>
        )}

        {!preview && (
          <Box sx={{ mt: 4 }}>
            <Link
              component={RouterLink}
              to="/login"
              underline="hover"
              color="text.secondary"
              sx={{ fontSize: "0.8rem" }}
            >
              Admin login
            </Link>
          </Box>
        )}
      </Box>
    </Box>
  );
}