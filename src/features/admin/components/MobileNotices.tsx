import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DesktopWindowsOutlinedIcon from "@mui/icons-material/DesktopWindowsOutlined";

interface AdvisoryProps {
  open: boolean;
  onClose: () => void;
}

/** Shown once after each sign-in on a phone. */
export function MobileAdvisoryDialog({ open, onClose }: AdvisoryProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      transitionDuration={0}
      aria-labelledby="mobile-advisory-title"
    >
      <DialogTitle
        id="mobile-advisory-title"
        sx={{ display: "flex", alignItems: "center", gap: 1.5, pr: 6 }}
      >
        <DesktopWindowsOutlinedIcon />
        Best used on a computer
        <IconButton
          onClick={onClose}
          aria-label="Close"
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
          For the best experience, we recommend signing in to the admin panel
          from a desktop or laptop. On a phone, only the most-used options are
          available, and some screens may not fit or respond as smoothly as they
          do on a larger display.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button variant="contained" onClick={onClose} fullWidth>
          I understand
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/** Shown instead of a page that isn't available on phones. */
export function DesktopOnlyNotice({ onBack }: { onBack: () => void }) {
  return (
    <Box
      role="status"
      sx={{
        mt: 4,
        p: 3,
        textAlign: "center",
        bgcolor: "#fff",
        border: "1px solid #E5E7EB",
        borderRadius: "14px",
      }}
    >
      <DesktopWindowsOutlinedIcon sx={{ fontSize: 40, color: "text.secondary" }} />
      <Typography component="h2" sx={{ fontWeight: 700, fontSize: "1.15rem", mt: 1 }}>
        Available on desktop
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1, lineHeight: 1.7 }}>
        This page works best on a larger screen. Please open the admin panel on
        a computer or laptop to use it.
      </Typography>
      <Button variant="contained" onClick={onBack} sx={{ mt: 2.5 }}>
        Back to dashboard
      </Button>
    </Box>
  );
}