import { ThemeProvider, CssBaseline } from "@mui/material";
import { ReactNode } from "react";
import theme from "./theme";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}