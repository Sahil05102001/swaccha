import {
  Alert,
  Snackbar,
} from "@mui/material";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type Severity =
  | "success"
  | "error"
  | "warning"
  | "info";

interface SnackbarState {
  open: boolean;
  message: string;
  severity: Severity;
}

interface SnackbarContextValue {
  showSnackbar: (
    message: string,
    severity?: Severity
  ) => void;
}

const SnackbarContext =
  createContext<SnackbarContextValue | null>(null);

export function SnackbarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [snackbar, setSnackbar] =
    useState<SnackbarState>({
      open: false,
      message: "",
      severity: "success",
    });

  const showSnackbar = useCallback(
    (
      message: string,
      severity: Severity = "success"
    ) => {
      setSnackbar({
        open: true,
        message,
        severity,
      });
    },
    []
  );

  const handleClose = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const value = useMemo(
    () => ({
      showSnackbar,
    }),
    [showSnackbar]
  );

  return (
    <SnackbarContext.Provider value={value}>
      {children}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={handleClose}
          variant="filled"
          sx={{
            width: "100%",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const context = useContext(SnackbarContext);

  if (!context) {
    throw new Error(
      "useSnackbar must be used within SnackbarProvider"
    );
  }

  return context;
}