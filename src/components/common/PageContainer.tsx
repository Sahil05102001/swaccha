import type { ReactNode } from "react";
import { Container, Stack } from "@mui/material";

interface PageContainerProps {
  children: ReactNode;
  spacing?: number;
}

export default function PageContainer({
  children,
  spacing = 3,
}: PageContainerProps) {
  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 4,
      }}
    >
      <Stack spacing={spacing}>
        {children}
      </Stack>
    </Container>
  );
}