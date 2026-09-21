import {
  Alert,
  CircularProgress,
  Stack,
} from "@mui/material";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";

import PolicyForm from "../components/PolicyForm";

import { usePolicy } from "../hooks/usePolicy";

interface Props {
  documentId: string;
  title: string;
}

export default function PolicyAdminPage({
  documentId,
  title,
}: Props) {
  const {
    policy,
    isLoading,
    isSaving,
    savePolicy,
    error,
  } = usePolicy(documentId);

  if (isLoading)
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

  if (error || !policy)
    return (
      <Alert severity="error">
        Failed to load.
      </Alert>
    );

  return (
    <PageContainer>
      <PageHeader
        title={title}
        subtitle={`Manage ${title}`}
      />

      <PolicyForm
        initialValues={policy}
        isSaving={isSaving}
        onSubmit={savePolicy}
      />
    </PageContainer>
  );
}