// D:\Projects\swaccha\src\features\cms\contact\admin\pages\ContactAdminPage.tsx

import { Container, Stack, Typography } from "@mui/material";

import ContactForm from "../../components/ContactForm";

export default function ContactAdminPage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={0.5} sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#17252B" }}>
          Contact Page
        </Typography>

        <Typography sx={{ color: "#64747A" }}>
          Manage the details shown on your public Contact Us page.
        </Typography>
      </Stack>

      <ContactForm />
    </Container>
  );
}