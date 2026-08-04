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

import AboutForm from "../../components/AboutForm";
import {
  useAboutSettings,
  useSaveAboutSettings,
} from "../../hooks/useAboutSettings";

export default function AboutAdminPage() {
  const {
    data: settings,
    isLoading,
    isError,
  } = useAboutSettings();

  const saveMutation =
    useSaveAboutSettings();

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
          Failed to load About page content.
        </Alert>
      </Stack>
    );
  }

  return (
    <>
      <PageContainer>
        <PageHeader
          title="About Us"
          subtitle="Manage the content displayed on the About Us page."
        />

        <SectionCard
          title="Company Information"
          subtitle="Update your company story, mission, vision and gallery."
        >
          <AboutForm
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
          About page updated successfully.
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
          Failed to update About page.
        </Alert>
      </Snackbar>
    </>
  );
}