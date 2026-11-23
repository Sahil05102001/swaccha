import { useState } from "react";

import { Alert, Button, Skeleton, Stack } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useQueryClient } from "@tanstack/react-query";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";

import FaqForm from "../../components/FaqForm";
import { useFaqSettings } from "../../hooks/useFaqSettings";

export default function FaqAdminPage() {
  const queryClient = useQueryClient();

  const { faqSettings, isLoading, error, isSaving, saveFaqSettings } = useFaqSettings();

  const [formKey, setFormKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      await queryClient.refetchQueries({ queryKey: ["cms", "faq"] });
      setFormKey((key) => key + 1);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="FAQ"
        subtitle="Manage the questions and answers shown on the FAQ page."
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
          <Skeleton variant="rounded" height={180} />
          <Skeleton variant="rounded" height={320} />
        </Stack>
      ) : error || !faqSettings ? (
        <Alert severity="error">Failed to load the FAQ.</Alert>
      ) : (
        <FaqForm
          key={formKey}
          initial={faqSettings}
          isSaving={isSaving}
          onSave={(values) => saveFaqSettings(values)}
        />
      )}
    </PageContainer>
  );
}