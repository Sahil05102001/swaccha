import type { ReactNode } from "react";
import { Box, Stack, Typography } from "@mui/material";

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <Typography
      component="h3"
      sx={{
        fontSize: "0.78rem",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "text.secondary",
      }}
    >
      {children}
    </Typography>
  );
}

export function InfoField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block" }}
      >
        {label}
      </Typography>
      <Typography
        component="div"
        variant="body2"
        sx={{ fontWeight: 600, overflowWrap: "anywhere" }}
      >
        {children}
      </Typography>
    </Box>
  );
}

export default function OrderSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Stack component="section" spacing={1.5}>
      <SectionTitle>{title}</SectionTitle>
      {children}
    </Stack>
  );
}