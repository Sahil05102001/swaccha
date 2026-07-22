import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";

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
    <Card elevation={2}>
      <CardContent>
        {(title || action) && (
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
            sx={{
              justifyContent: "space-between",
              alignItems: {
                xs: "flex-start",
                sm: "center",
              },
              mb: 3,
            }}
          >
            <Stack spacing={0.5}>
              {title && (
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  {title}
                </Typography>
              )}

              {subtitle && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
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