import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";

import RichText from "../components/RichText";
import { usePolicy } from "../hooks/usePolicy";

interface Props {
  documentId: string;
}

const accent = "#00BFD6";
const ink = "#17252B";
const border = "#E5ECEE";

export default function PolicyPage({ documentId }: Props) {
  const { policy, isLoading, error } = usePolicy(documentId);

  if (isLoading)
    return (
      <Stack
        sx={{
          minHeight: "60vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress sx={{ color: accent }} />
      </Stack>
    );

  if (error || !policy)
    return (
      <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 }, py: 4 }}>
        <Alert severity="error">Failed to load.</Alert>
      </Container>
    );

  return (
    <Container
      maxWidth="md"
      sx={{ px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4, md: 6 } }}
    >
      <Stack spacing={{ xs: 2.5, md: 3.5 }}>
        <Stack spacing={1.25}>
          <Typography
            component="h1"
            sx={{
              color: ink,
              fontWeight: 750,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              fontSize: { xs: "1.9rem", sm: "2.4rem", md: "2.8rem" },
              overflowWrap: "anywhere",
            }}
          >
            {policy.title}
          </Typography>

          <Box
            sx={{
              width: 48,
              height: 3,
              borderRadius: 2,
              backgroundColor: accent,
            }}
          />
        </Stack>

        <Box
          sx={{
            p: { xs: 2.5, sm: 4 },
            border: `1px solid ${border}`,
            borderRadius: "12px",
            backgroundColor: "#FFFFFF",
            color: "#2B3A40",
            minWidth: 0,
          }}
        >
          {policy.content?.trim() ? (
            <RichText text={policy.content} />
          ) : (
            <Typography sx={{ color: "#64747A" }}>
              This page has no content yet.
            </Typography>
          )}
        </Box>
      </Stack>
    </Container>
  );
}