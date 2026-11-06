import {
  Alert,
  CircularProgress,
  FormControlLabel,
  Snackbar,
  Stack,
  Switch,
  Typography,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import SectionCard from "@/components/common/SectionCard";

import StoreSettingsForm from "../components/StoreSettingsForm";
import {
  useSaveStoreSettings,
  useStoreSettings,
} from "../hooks/useStoreSettings";

export default function AdminSettingsPage() {
  const {
    data: settings,
    isLoading,
    isError,
  } = useStoreSettings();

  const saveMutation = useSaveStoreSettings();

  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

  useEffect(() => {
    if (saveMutation.isSuccess) {
      setSuccessOpen(true);
    }
  }, [saveMutation.isSuccess]);

  useEffect(() => {
    if (saveMutation.isError) {
      setErrorOpen(true);
    }
  }, [saveMutation.isError]);

  if (isLoading) {
    return (
      <Stack
        sx={{
          minHeight: "60vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Stack>
    );
  }

  if (isError || !settings) {
    return (
      <Stack sx={{ p: 4 }}>
        <Alert severity="error">
          Failed to load store settings.
        </Alert>
      </Stack>
    );
  }

  const handleWhoWeSupplyToggle = (
    active: boolean,
  ) => {
    saveMutation.mutate({
      ...settings,
      whoWeSupplyActive: active,
    });
  };

  return (
    <>
      <PageContainer>
        <PageHeader
          title="Store Settings"
          subtitle="Manage your business information used across the website, invoices and reports."
        />

        <SectionCard
          title="Business Information"
          subtitle="These settings are shared across invoices, contact information and future reports."
        >
          <StoreSettingsForm
            initialValues={settings}
            isSaving={saveMutation.isPending}
            onSubmit={(values) =>
              saveMutation.mutate(values)
            }
          />
        </SectionCard>

        <Box sx={{ mt: 3 }}>
          <SectionCard
            title="Homepage Sections"
            subtitle="Control which sections appear on your storefront."
          >
            <Stack spacing={1}>
              <FormControlLabel
                control={
                  <Switch
                    checked={
                      settings.whoWeSupplyActive ?? true
                    }
                    onChange={(event) =>
                      handleWhoWeSupplyToggle(
                        event.target.checked,
                      )
                    }
                    disabled={saveMutation.isPending}
                    color="primary"
                  />
                }
                label={
                  <Typography
                    sx={{ fontWeight: 600 }}
                  >
                    Who We Supply
                  </Typography>
                }
              />

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {settings.whoWeSupplyActive
                  ? "This section is visible on the homepage."
                  : "This section is hidden from the homepage."}
              </Typography>

              {saveMutation.isPending && (
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: "center" }}
                >
                  <CircularProgress size={16} />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Saving changes...
                  </Typography>
                </Stack>
              )}
            </Stack>
          </SectionCard>
        </Box>
      </PageContainer>

      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessOpen(false)}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setSuccessOpen(false)}
        >
          Store settings saved successfully.
        </Alert>
      </Snackbar>

      <Snackbar
        open={errorOpen}
        autoHideDuration={4000}
        onClose={() => setErrorOpen(false)}
      >
        <Alert
          severity="error"
          variant="filled"
          onClose={() => setErrorOpen(false)}
        >
          Failed to save store settings.
        </Alert>
      </Snackbar>
    </>
  );
}