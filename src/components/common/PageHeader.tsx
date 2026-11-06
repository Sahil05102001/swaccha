import type { ReactNode } from "react";
import { Stack, Typography } from "@mui/material";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  action,
}: PageHeaderProps) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      sx={{
        justifyContent: "space-between",
        alignItems: { xs: "flex-start", sm: "center" },
        mb: 1,
      }}
    >
      <Stack spacing={0.5} sx={{ minWidth: 0 }}>
        <Typography
          component="h2"
          sx={{
            fontSize: { xs: "1.4rem", sm: "1.75rem" },
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            color: "text.primary",
          }}
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Stack>

      {action}
    </Stack>
  );
}