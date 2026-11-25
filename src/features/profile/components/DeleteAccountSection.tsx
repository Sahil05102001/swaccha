import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  browserPopupRedirectResolver,
  EmailAuthProvider,
  GoogleAuthProvider,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  signOut,
} from "firebase/auth";

import { auth } from "@/firebase/auth";
import { useAuth } from "@/features/auth/AuthContext";
import { describeAuthError } from "@/features/auth/utils/authErrors";
import { useSnackbar } from "@/contexts/SnackbarContext";

import { useProfile } from "../hooks/useProfile";
import { deleteMyAccount } from "../services/accountDeletionService";

export default function DeleteAccountSection() {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Admin accounts are never deleted from the storefront.
  if (!user || profile?.role === "admin") return null;

  const usesPassword = user.providerData.some(
    (provider) => provider.providerId === "password",
  );

  const canSubmit =
    !busy &&
    confirmText.trim() === "DELETE" &&
    (!usesPassword || password.length > 0);

  const close = () => {
    if (busy) return;
    setOpen(false);
    setPassword("");
    setConfirmText("");
    setError("");
  };

  const handleDelete = async () => {
    const current = auth.currentUser;

    if (!current) return;

    setBusy(true);
    setError("");

    try {
      // Proves it is really the owner of the account.
      if (usesPassword) {
        await reauthenticateWithCredential(
          current,
          EmailAuthProvider.credential(current.email ?? "", password),
        );
      } else {
        await reauthenticateWithPopup(
          current,
          new GoogleAuthProvider(),
          browserPopupRedirectResolver,
        );
      }

      await deleteMyAccount();

      try {
        await signOut(auth);
      } catch {
        // Already signed out because the login no longer exists.
      }

      showSnackbar("Your account has been deleted.", "success");
      navigate("/", { replace: true });
    } catch (caught) {
      const code = (caught as { code?: string })?.code ?? "";

      if (code === "auth/invalid-credential" || code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else if (code.startsWith("auth/")) {
        setError(describeAuthError(caught).message);
      } else {
        setError(
          caught instanceof Error
            ? caught.message
            : "Your account could not be deleted. Please try again.",
        );
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          border: "1px solid #E0E0E0",
          borderRadius: "12px",
          bgcolor: "#FFFFFF",
        }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: "#212121" }}>
          Delete account
        </Typography>

        <Typography sx={{ mt: 0.5, fontSize: "0.85rem", color: "#757575" }}>
          Permanently delete your account and personal details. This cannot be
          undone.
        </Typography>

        <Button
          variant="outlined"
          color="error"
          disableRipple
          onClick={() => setOpen(true)}
          sx={{
            mt: 2,
            borderRadius: 999,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Delete my account
        </Button>
      </Box>

      <Dialog open={open} onClose={close} fullWidth maxWidth="xs">
        <DialogTitle>Delete your account?</DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            We will remove your login, name, email, phone, saved addresses,
            cart and wishlist. Your past orders and invoices are kept by us as
            required for tax records, but are no longer linked to a login. You
            can't delete your account while an order or refund is in progress.
          </DialogContentText>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {usesPassword ? (
            <TextField
              fullWidth
              size="small"
              type="password"
              label="Your password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              sx={{ mb: 2 }}
            />
          ) : (
            <DialogContentText sx={{ mb: 2, fontSize: "0.85rem" }}>
              You will be asked to sign in with Google to confirm.
            </DialogContentText>
          )}

          <TextField
            fullWidth
            size="small"
            label='Type "DELETE" to confirm'
            autoComplete="off"
            value={confirmText}
            onChange={(event) => setConfirmText(event.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={close} disabled={busy}>
            Cancel
          </Button>

          <Button
            variant="contained"
            color="error"
            disabled={!canSubmit}
            onClick={handleDelete}
          >
            {busy ? "Deleting..." : "Delete permanently"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}