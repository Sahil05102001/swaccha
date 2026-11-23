import type { ReactNode } from "react";
import { Box, Card, CardContent, Skeleton, Stack, Typography } from "@mui/material";

interface StatCardProps {
  title: string;
  /** undefined = still loading (shows a placeholder of the same size). */
  value?: string | number;
  icon: ReactNode;
  /** Kept so existing callers still compile. The card is neutral now. */
  color?: string;
  subtitle?: string;
  /** Smaller card for phones: no icon, no subtitle. */
  compact?: boolean;
}

export default function StatCard({
  title,
  value,
  icon,
  subtitle,
  compact = false,
}: StatCardProps) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent
        sx={compact ? { p: 1.5, "&:last-child": { pb: 1.5 } } : undefined}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ justifyContent: "space-between", alignItems: "flex-start" }}
        >
          <Stack spacing={0.5} sx={{ minWidth: 0 }}>
            <Typography variant="body2" color="text.secondary" noWrap>
              {title}
            </Typography>

            <Typography
              variant={compact ? "h5" : "h4"}
              component="div"
              noWrap
              title={value === undefined ? undefined : String(value)}
              sx={{ fontWeight: 700 }}
            >
              {value === undefined ? (
                <Skeleton width={compact ? 64 : 96} />
              ) : (
                value
              )}
            </Typography>

            {subtitle && !compact && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Stack>

          {!compact && (
            <Box
              sx={{
                width: 40,
                height: 40,
                flexShrink: 0,
                borderRadius: 2,
                bgcolor: "#F3F4F6",
                color: "text.primary",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "& svg": { fontSize: 22 },
              }}
            >
              {icon}
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}