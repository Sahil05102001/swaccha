import {
  Alert,
  CircularProgress,
  Stack,
} from "@mui/material";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";

import { useFaqSettings } from "../hooks/useFaqSettings";

import FaqAccordion from "../components/FaqAccordion";

export default function FaqPage() {
  const {
    faqSettings,
    isLoading,
    error,
  } = useFaqSettings();

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

  if (error || !faqSettings) {
    return (
      <PageContainer>
        <Alert severity="error">
          Failed to load FAQ.
        </Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={faqSettings.heroTitle}
        subtitle={
          faqSettings.heroSubtitle
        }
      />

      <Stack spacing={2}>
        {faqSettings.faqs
          .filter((f) => f.isActive)
          .map((faq) => (
            <FaqAccordion
              key={faq.id}
              faq={faq}
            />
          ))}
      </Stack>
    </PageContainer>
  );
}