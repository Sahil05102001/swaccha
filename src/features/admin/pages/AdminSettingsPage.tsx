import {
  Alert,
  CircularProgress,
  Snackbar,
  Stack,
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

  const saveMutation =
    useSaveStoreSettings();

  const [successOpen, setSuccessOpen] =
    useState(false);

  const [errorOpen, setErrorOpen] =
    useState(false);

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
      </PageContainer>

      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={() =>
          setSuccessOpen(false)
        }
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() =>
            setSuccessOpen(false)
          }
        >
          Store settings saved successfully.
        </Alert>
      </Snackbar>

      <Snackbar
        open={errorOpen}
        autoHideDuration={4000}
        onClose={() =>
          setErrorOpen(false)
        }
      >
        <Alert
          severity="error"
          variant="filled"
          onClose={() =>
            setErrorOpen(false)
          }
        >
          Failed to save store settings.
        </Alert>
      </Snackbar>
    </>
  );
}