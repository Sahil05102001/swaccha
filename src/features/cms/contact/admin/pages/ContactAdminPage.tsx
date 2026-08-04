import {
  Container,
  Typography,
} from "@mui/material";

import ContactForm from "../../components/ContactForm";

export default function ContactAdminPage() {
  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 4,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          fontWeight: 700,
        }}
      >
        Contact Page Management
      </Typography>

      <ContactForm />
    </Container>
  );
}