import {
  Alert,
  FormControlLabel,
  Skeleton,
  Stack,
  Switch,
  Typography,
} from "@mui/material";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import SectionCard from "@/components/common/SectionCard";
import { useSnackbar } from "@/contexts/SnackbarContext";

import StoreSettingsForm from "../components/StoreSettingsForm";
import {
  useSaveStoreSettings,
  useStoreSettings,
} from "../hooks/useStoreSettings";
import { scrollToTop } from "../utils/scrollToTop";

export default function AdminSettingsPage() {
  const { showSnackbar } = useSnackbar();

  const { data: settings, isLoading, isError } = useStoreSettings();
  const saveMutation = useSaveStoreSettings();

  const handlers = {
    onSuccess: () => {
      showSnackbar("Store settings saved.", "success");
      scrollToTop();
    },
    onError: () => showSnackbar("Failed to save store settings.", "error"),
  };

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader title="Store Settings" />
        <Skeleton variant="rounded" height={220} />
        <Skeleton variant="rounded" height={220} />
        <Skeleton variant="rounded" height={220} />
      </PageContainer>
    );
  }

  if (isError || !settings) {
    return (
      <PageContainer>
        <PageHeader title="Store Settings" />
        <Alert severity="error">Failed to load store settings.</Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Store Settings"
        subtitle="Manage your business information used across the website, invoices and reports."
      />

      <StoreSettingsForm
        initialValues={settings}
        isSaving={saveMutation.isPending}
        onSubmit={(values) => saveMutation.mutate(values, handlers)}
      />

      <SectionCard
        title="Homepage sections"
        subtitle="Control which sections appear on your storefront. Changes apply immediately."
      >
        <Stack spacing={1}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.whoWeSupplyActive ?? true}
                onChange={(event) =>
                  saveMutation.mutate(
                    { ...settings, whoWeSupplyActive: event.target.checked },
                    handlers,
                  )
                }
                disabled={saveMutation.isPending}
              />
            }
            label={<Typography sx={{ fontWeight: 600 }}>Who We Supply</Typography>}
          />

          <Typography variant="body2" color="text.secondary">
            {settings.whoWeSupplyActive ?? true
              ? "This section is visible on the homepage."
              : "This section is hidden from the homepage."}
          </Typography>
        </Stack>
      </SectionCard>
    </PageContainer>
  );
}