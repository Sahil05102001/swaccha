import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color?: string;
  subtitle?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  color = "primary.main",
  subtitle,
}: StatCardProps) {
  return (
    <Card
      elevation={2}
      sx={{
        height: "100%",
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Stack spacing={1}>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              {title}
            </Typography>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
              }}
            >
              {value}
            </Typography>

            {subtitle && (
              <Typography
                variant="body2"
                color="text.secondary"
              >
                {subtitle}
              </Typography>
            )}
          </Stack>

          <Stack
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              bgcolor: color,
              color: "white",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {icon}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}