import { useState } from "react";

import { Alert, Button, Skeleton, Stack } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useQueryClient } from "@tanstack/react-query";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";

import ContactForm from "../../components/ContactForm";
import { useContactSettings } from "../../hooks/useContactSettings";

export default function ContactAdminPage() {
  const queryClient = useQueryClient();

  const { contactSettings, isLoading, error, isSaving, saveContactSettings } =
    useContactSettings();

  const [formKey, setFormKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      await queryClient.refetchQueries({ queryKey: ["cms", "contact"] });
      setFormKey((key) => key + 1);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Contact Page"
        subtitle="Manage the details shown on the public Contact Us page."
        action={
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => void handleRefresh()}
            disabled={refreshing}
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        }
      />

      {isLoading ? (
        <Stack spacing={3}>
          <Skeleton variant="rounded" height={140} />
          <Skeleton variant="rounded" height={340} />
          <Skeleton variant="rounded" height={160} />
        </Stack>
      ) : error || !contactSettings ? (
        <Alert severity="error">Failed to load contact settings.</Alert>
      ) : (
        <ContactForm
          key={formKey}
          initial={contactSettings}
          isSaving={isSaving}
          onSave={(values) => saveContactSettings(values)}
        />
      )}
    </PageContainer>
  );
}