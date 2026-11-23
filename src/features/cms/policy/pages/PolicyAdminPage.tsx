import { Alert, Skeleton, Stack } from "@mui/material";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";

import PolicyForm from "../components/PolicyForm";
import { usePolicy } from "../hooks/usePolicy";

interface Props {
  documentId: string;
  title: string;
}

export default function PolicyAdminPage({ documentId, title }: Props) {
  const { policy, isLoading, isSaving, savePolicy, error } = usePolicy(documentId);

  return (
    <PageContainer>
      <PageHeader title={title} subtitle={`Manage ${title}`} />

      {isLoading ? (
        <Stack spacing={2} role="status" aria-label="Loading policy">
          <Skeleton variant="rounded" height={56} />
          <Skeleton variant="rounded" height={48} />
          <Skeleton variant="rounded" height={420} />
        </Stack>
      ) : error || !policy ? (
        <Alert severity="error">Failed to load. Please refresh the page.</Alert>
      ) : (
        <PolicyForm initialValues={policy} isSaving={isSaving} onSubmit={savePolicy} />
      )}
    </PageContainer>
  );
}