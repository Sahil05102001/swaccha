import type { SyntheticEvent } from "react";
import {
    Box,
    IconButton,
    Snackbar,
    Typography,
    type SnackbarCloseReason,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";


export type SnackbarSeverity = "success" | "error" | "warning" | "info";

interface AppSnackbarProps {
    open: boolean;
    message: string;
    severity: SnackbarSeverity;
    /** Changes for every new message, so the auto-hide timer restarts. */
    messageKey?: number;
    onClose: (event?: SyntheticEvent | Event, reason?: SnackbarCloseReason) => void;
}

const CONTENT = {
    success: { title: "Success", Icon: CheckCircleOutlineIcon },
    error: { title: "Error", Icon: ErrorOutlineIcon },
    warning: { title: "Warning", Icon: WarningAmberIcon },
    info: { title: "Info", Icon: InfoOutlinedIcon },
} as const;

export default function AppSnackbar({
    open,
    message,
    severity,
    messageKey,
    onClose,
}: AppSnackbarProps) {
    const { title, Icon } = CONTENT[severity];

    const handleClose = (
        event: SyntheticEvent | Event,
        reason: SnackbarCloseReason,
    ) => {
        if (reason === "clickaway") {
            return;
        }

        onClose(event, reason);
    };

    return (
        <Snackbar
            key={messageKey}
            open={open}
            autoHideDuration={severity === "error" || severity === "warning" ? 5000 : 3500}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            sx={{
                // Full width with side margins on phones.
                left: { xs: 16, sm: "auto" },
                right: { xs: 16, sm: 24 },
                bottom: { xs: 16, sm: 24 },
                maxWidth: { sm: 440 },
            }}
        >
            <Box
                role={severity === "error" || severity === "warning" ? "alert" : "status"}
                sx={(theme) => {
                    const color = theme.palette[severity];
                    return {
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1.5,
                        width: "100%",
                        px: 2,
                        py: 1.5,
                        bgcolor: theme.palette.background.paper,
                        border: `1px solid ${alpha(color.main, 0.28)}`,
                        borderRadius: "14px",
                        boxShadow: `0 10px 30px ${alpha(color.main, 0.18)}, 0 2px 8px rgba(26, 26, 26, 0.06)`,
                    };
                }}
            >
                <Icon
                    aria-hidden="true"
                    sx={{ mt: "1px", fontSize: 22, flexShrink: 0, color: `${severity}.main` }}
                />

                <Typography
                    component="p"
                    sx={{
                        flex: 1,
                        minWidth: 0,
                        m: 0,
                        fontSize: "0.9rem",
                        lineHeight: 1.5,
                        color: "text.primary",
                        overflowWrap: "anywhere",
                    }}
                >
                    <Box component="span" sx={{ fontWeight: 800, color: `${severity}.dark` }}>
                        {title}!
                    </Box>{" "}
                    {message}
                </Typography>

                <IconButton
                    aria-label="Close notification"
                    size="small"
                    onClick={(event) => handleClose(event, "escapeKeyDown")}
                    sx={{
                        mt: "-2px",
                        mr: "-6px",
                        flexShrink: 0,
                        color: `${severity}.main`,
                        "&:hover": { bgcolor: "action.hover" },
                    }}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>
        </Snackbar>
    );
}