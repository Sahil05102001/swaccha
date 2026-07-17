import type { ReactNode } from "react";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { Provider } from "react-redux";

import { store } from "./store";
import theme from "./theme";

import { AuthProvider } from "@/features/auth/AuthContext";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}