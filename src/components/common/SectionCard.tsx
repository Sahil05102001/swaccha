import type { ReactNode } from "react";
import { Card, CardContent, Stack, Typography } from "@mui/material";

interface SectionCardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
}

export default function SectionCard({
  title,
  subtitle,
  children,
  action,
}: SectionCardProps) {
  return (
    <Card
      elevation={0}
      sx={{
        bgcolor: "#fff",
        border: "1px solid #E5E7EB",
        borderRadius: "14px",
        boxShadow: "none",
        backdropFilter: "none",
        WebkitBackdropFilter: "none",
        overflow: "visible",
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 2.5 }, "&:last-child": { pb: { xs: 2, md: 2.5 } } }}>
        {(title || action) && (
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              mb: 2.5,
            }}
          >
            <Stack spacing={0.5}>
              {title && (
                <Typography
                  component="h3"
                  sx={{ fontSize: "1.05rem", fontWeight: 700 }}
                >
                  {title}
                </Typography>
              )}

              {subtitle && (
                <Typography variant="body2" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Stack>

            {action}
          </Stack>
        )}

        {children}
      </CardContent>
    </Card>
  );
}