import {
    Alert,
    Snackbar,
} from "@mui/material";
import {
    createContext,
    useContext,
    useState,
} from "react";

type SnackbarSeverity =
    | "success"
    | "error"
    | "warning"
    | "info";

interface SnackbarContextType {
    showSnackbar: (
        message: string,
        severity?: SnackbarSeverity
    ) => void;
}

const SnackbarContext =
    createContext<SnackbarContextType | undefined>(undefined);

export function SnackbarProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);

    const [message, setMessage] = useState("");

    const [severity, setSeverity] =
        useState<SnackbarSeverity>("success");

    const showSnackbar = (
        message: string,
        severity: SnackbarSeverity = "success"
    ) => {
        setMessage(message);
        setSeverity(severity);
        setOpen(true);
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}

            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={() => setOpen(false)}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
            >
                <Alert
                    severity={severity}
                    onClose={() => setOpen(false)}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
}

export function useSnackbar() {
    const context = useContext(SnackbarContext);

    if (!context) {
        throw new Error(
            "useSnackbar must be used within SnackbarProvider."
        );
    }

    return context;
}