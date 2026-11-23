import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Skeleton,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import SectionCard from "@/components/common/SectionCard";
import { useSnackbar } from "@/contexts/SnackbarContext";

import MaintenanceView from "@/features/maintenance/components/MaintenanceView";
import {
  useMaintenance,
  useSaveMaintenance,
} from "@/features/maintenance/hooks/useMaintenance";
import type { MaintenanceSettings } from "@/features/maintenance/types/maintenance";
import {
  isoToLocalInput,
  localInputToIso,
} from "@/features/maintenance/utils/time";

const PRESETS = [
  {
    label: "Scheduled update",
    title: "Scheduled maintenance",
    reason:
      "We're updating the store to make it better. We'll be back shortly. Thank you for your patience.",
  },
  {
    label: "New products",
    title: "Adding new products",
    reason:
      "We're adding new products and updating prices. The store will reopen very soon.",
  },
  {
    label: "Stock-taking",
    title: "Stock-taking in progress",
    reason:
      "We're counting our stock so that every order you place is available. We'll be back soon.",
  },
  {
    label: "Urgent fix",
    title: "We're fixing something",
    reason:
      "We found an issue and are fixing it right now. Sorry for the trouble. We'll be back as soon as it's done.",
  },
];

interface FormState {
  title: string;
  reason: string;
  endsAtLocal: string;
  showCountdown: boolean;
  showContact: boolean;
  contactEmail: string;
  contactPhone: string;
  whatsapp: string;
}

const toForm = (s: MaintenanceSettings): FormState => ({
  title: s.title,
  reason: s.reason,
  endsAtLocal: isoToLocalInput(s.endsAt),
  showCountdown: s.showCountdown,
  showContact: s.showContact,
  contactEmail: s.contactEmail,
  contactPhone: s.contactPhone,
  whatsapp: s.whatsapp,
});

function scrollTop() {
  window.scrollTo({ top: 0 });
  document.querySelector("main")?.scrollTo({ top: 0 });
}

function MaintenanceForm({ settings }: { settings: MaintenanceSettings }) {
  const { showSnackbar } = useSnackbar();
  const { mutateAsync: save, isPending } = useSaveMaintenance();

  const saved = toForm(settings);
  const [form, setForm] = useState<FormState>(saved);
  const [confirm, setConfirm] = useState<"on" | "off" | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const dirty = JSON.stringify(form) !== JSON.stringify(saved);
  const on = settings.enabled;

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const build = (enabled: boolean): MaintenanceSettings => ({
    ...settings,
    enabled,
    title: form.title.trim(),
    reason: form.reason.trim(),
    endsAt: localInputToIso(form.endsAtLocal),
    showCountdown: form.showCountdown,
    showContact: form.showContact,
    contactEmail: form.contactEmail.trim(),
    contactPhone: form.contactPhone.trim(),
    whatsapp: form.whatsapp.trim(),
  });

  const problem = (enabled: boolean): string | null => {
    if (!form.title.trim()) return "Enter a title for the maintenance page.";
    if (!form.reason.trim()) return "Enter the reason customers will read.";
    if (form.endsAtLocal && !localInputToIso(form.endsAtLocal)) {
      return "The expected-back time is not valid.";
    }
    if (enabled && form.endsAtLocal) {
      const ends = new Date(form.endsAtLocal).getTime();
      if (ends <= Date.now()) {
        return "The expected-back time has already passed. Choose a later time or clear it.";
      }
    }
    return null;
  };

  const persist = async (enabled: boolean, message: string) => {
    const issue = problem(enabled);
    if (issue) {
      showSnackbar(issue, "warning");
      return;
    }

    try {
      await save(build(enabled));
      showSnackbar(message, "success");
      scrollTop();
    } catch {
      showSnackbar("Could not save. Please try again.", "error");
    }
  };

  const confirmToggle = async () => {
    const turnOn = confirm === "on";
    setConfirm(null);
    await persist(
      turnOn,
      turnOn
        ? "Maintenance mode is ON. Customers now see the maintenance page."
        : "Store is open again. Customers can shop as usual.",
    );
  };

  const preview: MaintenanceSettings = { ...build(true) };

  return (
    <Stack spacing={3}>
      <SectionCard
        title="Store status"
        subtitle="One switch for the whole customer side of the store."
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ justifyContent: "space-between", alignItems: { sm: "center" } }}
        >
          <Box>
            <Chip
              label={on ? "Maintenance mode is ON" : "Store is open"}
              sx={{
                fontWeight: 700,
                bgcolor: on ? "#FEE2E2" : "#DCFCE7",
                color: on ? "#991B1B" : "#166534",
              }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {on
                ? "Customers only see the maintenance page. You still see the store while logged in."
                : "Customers can browse and buy normally."}
            </Typography>
          </Box>

          <Button
            variant="contained"
            color={on ? "primary" : "error"}
            disabled={isPending}
            onClick={() => setConfirm(on ? "off" : "on")}
          >
            {on ? "Reopen the store" : "Turn on maintenance mode"}
          </Button>
        </Stack>
      </SectionCard>

      <SectionCard
        title="What customers will see"
        subtitle="Fill this in before turning maintenance mode on."
      >
        <Stack spacing={3}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Quick fill
            </Typography>
            <Stack direction="row" useFlexGap sx={{ flexWrap: "wrap", gap: 1 }}>
              {PRESETS.map((p) => (
                <Button
                  key={p.label}
                  size="small"
                  variant="outlined"
                  color="inherit"
                  onClick={() => setForm((f) => ({ ...f, title: p.title, reason: p.reason }))}
                  sx={{ borderColor: "#CBD5E1" }}
                >
                  {p.label}
                </Button>
              ))}
            </Stack>
          </Box>

          <TextField
            label="Title"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            fullWidth
            slotProps={{ htmlInput: { maxLength: 80 } }}
          />

          <TextField
            label="Reason (shown to customers)"
            value={form.reason}
            onChange={(e) => set("reason", e.target.value)}
            multiline
            minRows={4}
            fullWidth
            helperText="Plain words are fine. You can also use **bold** and [a link](https://example.com)."
            slotProps={{ htmlInput: { maxLength: 600 } }}
          />

          <TextField
            label="Expected back at (optional)"
            type="datetime-local"
            value={form.endsAtLocal}
            onChange={(e) => set("endsAtLocal", e.target.value)}
            helperText="Shown to customers in Indian time. Leave empty if you're not sure."
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ maxWidth: 320 }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={form.showCountdown}
                disabled={!form.endsAtLocal}
                onChange={(e) => set("showCountdown", e.target.checked)}
              />
            }
            label="Show a live countdown to that time"
          />

          <FormControlLabel
            control={
              <Switch
                checked={form.showContact}
                onChange={(e) => set("showContact", e.target.checked)}
              />
            }
            label="Show contact buttons so customers can reach you"
          />

          {form.showContact && (
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                label="Phone"
                value={form.contactPhone}
                onChange={(e) => set("contactPhone", e.target.value)}
                fullWidth
              />
              <TextField
                label="WhatsApp number"
                value={form.whatsapp}
                onChange={(e) => set("whatsapp", e.target.value)}
                fullWidth
              />
              <TextField
                label="Email"
                type="email"
                value={form.contactEmail}
                onChange={(e) => set("contactEmail", e.target.value)}
                fullWidth
              />
            </Stack>
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, flexWrap: "wrap" }}>
            <Button color="inherit" onClick={() => setPreviewOpen(true)}>
              Preview page
            </Button>
            <Button
              color="inherit"
              disabled={!dirty || isPending}
              onClick={() => setForm(saved)}
            >
              Discard
            </Button>
            <Button
              variant="contained"
              disabled={!dirty || isPending}
              onClick={() => persist(on, "Saved. The maintenance page is updated.")}
            >
              {isPending ? "Saving…" : "Save changes"}
            </Button>
          </Box>
        </Stack>
      </SectionCard>

      <Alert severity="info">
        While maintenance mode is ON, you can still use the whole store and the
        admin panel. Customers who already have the store open are switched to
        the maintenance page within about 2 minutes, or sooner if they reload.
      </Alert>

      {/* Confirm */}
      <Dialog
        open={confirm !== null}
        onClose={() => setConfirm(null)}
        transitionDuration={0}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          {confirm === "on" ? "Turn on maintenance mode?" : "Reopen the store?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirm === "on"
              ? "Customers will no longer see any page of the store, only the maintenance page you set up. Your current text above will be saved and used. Payments a customer has already started may still complete."
              : "Customers will be able to browse and order again straight away. Your maintenance text stays saved for next time."}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button color="inherit" onClick={() => setConfirm(null)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color={confirm === "on" ? "error" : "primary"}
            onClick={confirmToggle}
          >
            {confirm === "on" ? "Yes, turn it on" : "Yes, reopen"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        fullScreen
        transitionDuration={0}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            py: 1,
            borderBottom: "1px solid #E2E8F0",
          }}
        >
          <Typography sx={{ fontWeight: 700 }}>
            Preview. This is what customers will see.
          </Typography>
          <IconButton onClick={() => setPreviewOpen(false)} aria-label="Close preview">
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ flex: 1, overflow: "auto" }}>
          <MaintenanceView settings={preview} preview onRetry={() => undefined} />
        </Box>
      </Dialog>
    </Stack>
  );
}

export default function AdminMaintenancePage() {
  const { data: settings, isLoading, isError, refetch, isFetching } =
    useMaintenance();

  return (
    <PageContainer>
      <PageHeader
        title="Maintenance Mode"
        subtitle="Close the store to customers while you make changes."
        action={
          <Button
            variant="outlined"
            color="inherit"
            disabled={isFetching}
            onClick={() => void refetch()}
          >
            {isFetching ? "Refreshing…" : "Refresh"}
          </Button>
        }
      />

      {isLoading ? (
        <Stack spacing={2} role="status" aria-label="Loading maintenance settings">
          <Skeleton variant="rounded" height={110} />
          <Skeleton variant="rounded" height={420} />
        </Stack>
      ) : isError || !settings ? (
        <Alert severity="error">Failed to load. Please refresh the page.</Alert>
      ) : (
        <MaintenanceForm
          key={settings.updatedAt?.getTime() ?? 0}
          settings={settings}
        />
      )}
    </PageContainer>
  );
}