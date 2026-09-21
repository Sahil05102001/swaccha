import {
  CircularProgress,
  Stack,
} from "@mui/material";


import { useFaqSettings } from "../hooks/useFaqSettings";
import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";

import FaqForm from "../components/FaqForm";

export default function FaqAdminPage() {
  const { isLoading } =
    useFaqSettings();

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

  return (
    <PageContainer>
      <PageHeader
        title="FAQ"
        subtitle="Manage Frequently Asked Questions"
      />

      <FaqForm />
    </PageContainer>
  );
}