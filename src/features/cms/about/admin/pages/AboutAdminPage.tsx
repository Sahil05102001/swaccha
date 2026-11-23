import { useState } from "react";

import { Alert, Button, Skeleton, Stack } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";

import AboutForm from "../../components/AboutForm";
import {
  useAboutSettings,
  useSaveAboutSettings,
} from "../../hooks/useAboutSettings";

export default function AboutAdminPage() {
  const { data: settings, isLoading, isError, refetch, isRefetching } =
    useAboutSettings();

  const saveMutation = useSaveAboutSettings();

  // Bumping this key rebuilds the form from the saved content.
  const [formKey, setFormKey] = useState(0);

  const handleRefresh = async () => {
    await refetch();
    setFormKey((key) => key + 1);
  };

  return (
    <PageContainer>
      <PageHeader
        title="About Us"
        subtitle="Manage the content shown on the About Us page."
        action={
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => void handleRefresh()}
            disabled={isRefetching}
          >
            {isRefetching ? "Refreshing..." : "Refresh"}
          </Button>
        }
      />

      {isLoading ? (
        <Stack spacing={3}>
          <Skeleton variant="rounded" height={320} />
          <Skeleton variant="rounded" height={220} />
          <Skeleton variant="rounded" height={220} />
        </Stack>
      ) : isError || !settings ? (
        <Alert severity="error">Failed to load the About page content.</Alert>
      ) : (
        <AboutForm
          key={formKey}
          initialValues={settings}
          isSaving={saveMutation.isPending}
          onSubmit={(values) => saveMutation.mutateAsync(values)}
        />
      )}
    </PageContainer>
  );
}