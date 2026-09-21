import {
  Alert,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";

import { usePolicy } from "../hooks/usePolicy";

interface Props {
  documentId: string;
}

export default function PolicyPage({
  documentId,
}: Props) {
  const {
    policy,
    isLoading,
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
        title={policy.title}
      />

      <Paper sx={{ p: 4 }}>
        <Typography
          sx={{
            whiteSpace: "pre-wrap",
          }}
        >
          {policy.content}
        </Typography>
      </Paper>
    </PageContainer>
  );
}