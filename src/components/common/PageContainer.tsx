import type { ReactNode } from "react";
import { Box, Stack } from "@mui/material";

interface PageContainerProps {
  children: ReactNode;
  spacing?: number;
}

export default function PageContainer({
  children,
  spacing = 3,
}: PageContainerProps) {
  return (
    <Box sx={{ width: "100%", maxWidth: 1400, mx: "auto", py: { xs: 1, md: 2 } }}>
      <Stack spacing={spacing}>{children}</Stack>
    </Box>
  );
}