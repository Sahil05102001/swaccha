import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";

import { auth } from "@/firebase/auth";

import { CUSTOMERS_QUERY_KEY } from "../hooks/useCustomers";
import type { Customer } from "../services/customerService";
import {
  deleteCustomerAccount,
  sendCustomerPasswordReset,
  setCustomerActive,
} from "../services/customerAccountService";

type DialogName = "reset" | "toggle" | "delete" | null;

interface Notice {
  severity: "success" | "error";
  message: string;
}

export default function CustomerAccountActions({
  customer,
}: {
  customer: Customer;
}) {
  const queryClient = useQueryClient();

  const [dialog, setDialog] = useState<DialogName>(null);
  const [busy, setBusy] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [notice, setNotice] = useState<Notice | null>(null);

  const isSelf = auth.currentUser?.uid === customer.uid;
  const protectedAccount = customer.role === "admin" || isSelf;
  const active = customer.isActive;

  const closeDialog = () => {
    if (busy) return;
    setDialog(null);
    setConfirmText("");
  };

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["customer", customer.uid] });
    await queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
  };

  const run = async (task: () => Promise<unknown>, success: string) => {
    setBusy(true);

    try {
      await task();
      setNotice({ severity: "success", message: success });
      await refresh();
      setDialog(null);
      setConfirmText("");
    } catch (error) {
      setNotice({
        severity: "error",
        message:
          error instanceof Error ? error.message : "Something went wrong.",
      });
    } finally {
      setBusy(false);
    }
  };

  if (customer.deleted) {
    return (
      <Alert severity="info">
        This account was deleted. Personal details were removed; orders and
        invoices are kept for tax records.
      </Alert>
    );
  }

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Account actions
          </Typography>

          <Divider sx={{ mb: 2 }} />

          {protectedAccount && (
            <Alert severity="info" sx={{ mb: 2 }}>
              {isSelf
                ? "You can't disable or delete your own account here."
                : "Admin accounts can't be disabled or deleted here."}
            </Alert>
          )}

          <Stack spacing={1.5}>
            <Button
              variant="outlined"
              disabled={!customer.email || busy}
              onClick={() => setDialog("reset")}
            >
              Send password reset email
            </Button>

            <Button
              variant="outlined"
              color={active ? "warning" : "success"}
              disabled={protectedAccount || busy}
              onClick={() => setDialog("toggle")}
            >
              {active ? "Disable account" : "Enable account"}
            </Button>

            <Button
              variant="outlined"
              color="error"
              disabled={protectedAccount || busy}
              onClick={() => setDialog("delete")}
            >
              Delete account
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Password reset */}
      <Dialog open={dialog === "reset"} onClose={closeDialog} fullWidth maxWidth="xs">
        <DialogTitle>Send password reset email?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            A link to choose a new password will be emailed to{" "}
            <strong>{customer.email}</strong>. Customers who signed up with
            Google manage their password with Google, so this email will not
            help them.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} disabled={busy}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={busy}
            onClick={() =>
              run(
                () => sendCustomerPasswordReset(customer.email),
                "If an account exists for that email, a reset link is on its way.",
              )
            }
          >
            {busy ? "Sending..." : "Send email"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Disable / enable */}
      <Dialog open={dialog === "toggle"} onClose={closeDialog} fullWidth maxWidth="xs">
        <DialogTitle>{active ? "Disable this account?" : "Enable this account?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {active
              ? "The customer is signed out everywhere and can't log in or place orders until you enable the account again. Their orders and data are kept."
              : "The customer will be able to log in and place orders again."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} disabled={busy}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color={active ? "warning" : "success"}
            disabled={busy}
            onClick={() =>
              run(
                () => setCustomerActive(customer.uid, !active),
                active ? "Account disabled." : "Account enabled.",
              )
            }
          >
            {busy ? "Saving..." : active ? "Disable" : "Enable"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete */}
      <Dialog open={dialog === "delete"} onClose={closeDialog} fullWidth maxWidth="xs">
        <DialogTitle>Delete this account?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            This removes the customer's login, name, email, phone, saved
            addresses, cart and wishlist. Orders, invoices and credit notes are
            kept for tax records. This cannot be undone.
          </DialogContentText>

          <DialogContentText sx={{ mb: 2 }}>
            Accounts with an order or refund in progress can't be deleted yet.
          </DialogContentText>

          <TextField
            fullWidth
            size="small"
            label='Type "DELETE" to confirm'
            value={confirmText}
            onChange={(event) => setConfirmText(event.target.value)}
            autoComplete="off"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} disabled={busy}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={busy || confirmText.trim() !== "DELETE"}
            onClick={() =>
              run(() => deleteCustomerAccount(customer.uid), "Account deleted.")
            }
          >
            {busy ? "Deleting..." : "Delete account"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(notice)}
        autoHideDuration={6000}
        onClose={() => setNotice(null)}
      >
        <Alert
          severity={notice?.severity ?? "success"}
          onClose={() => setNotice(null)}
        >
          {notice?.message}
        </Alert>
      </Snackbar>
    </>
  );
}