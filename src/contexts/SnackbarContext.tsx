import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import AppSnackbar, {
  type SnackbarSeverity,
} from "@/components/ui/AppSnackbar";

type Severity = SnackbarSeverity;

interface SnackbarState {
  open: boolean;
  message: string;
  severity: Severity;
  key: number;
}

interface SnackbarContextValue {
  showSnackbar: (message: string, severity?: Severity) => void;
}

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

export function SnackbarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
    key: 0,
  });

  const showSnackbar = useCallback(
    (message: string, severity: Severity = "success") => {
      setSnackbar((prev) =>
        // The same message is already on screen: don't show it twice.
        prev.open && prev.message === message && prev.severity === severity
          ? prev
          : { open: true, message, severity, key: prev.key + 1 },
      );
    },
    [],
  );

  const handleClose = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  const value = useMemo(() => ({ showSnackbar }), [showSnackbar]);

  return (
    <SnackbarContext.Provider value={value}>
      {children}

      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        messageKey={snackbar.key}
        onClose={handleClose}
      />
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const context = useContext(SnackbarContext);

  if (!context) {
    throw new Error("useSnackbar must be used within SnackbarProvider");
  }

  return context;
}