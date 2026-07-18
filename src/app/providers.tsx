import type { ReactNode } from "react";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { Provider } from "react-redux";

import { store } from "./store";
import theme from "./theme";

import { AuthProvider } from "@/features/auth/AuthContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {children}
        </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </Provider>
  );
}