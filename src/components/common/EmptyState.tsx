import type { ReactNode } from "react";
import {
  Stack,
  Typography,
} from "@mui/material";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export default function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <Stack
      spacing={2}
      sx={{
        py: 8,
        px: 2,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      {icon}

      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
        }}
      >
        {title}
      </Typography>

      <Typography
        color="text.secondary"
        sx={{
          maxWidth: 450,
        }}
      >
        {description}
      </Typography>

      {action}
    </Stack>
  );
}