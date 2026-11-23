import { Alert, Button, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import TodayOutlinedIcon from "@mui/icons-material/TodayOutlined";

import { useB2BEnquiryCounts } from "../hooks/useB2BEnquiryCounts";

import StatCard from "./StatCard";

export default function B2BEnquiryStats({ compact = false }: { compact?: boolean }) {
  const { data, isError, error, refetch } = useB2BEnquiryCounts();

  const show = (value?: number) => (isError ? "—" : value);

  return (
    <Stack spacing={2}>
      <Typography
        component="h3"
        sx={{ fontSize: "1.05rem", fontWeight: 700 }}
      >
        B2B enquiries
      </Typography>

      {isError && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => void refetch()}>
              Retry
            </Button>
          }
        >
          {error instanceof Error
            ? error.message
            : "Unable to load B2B enquiry counts."}
        </Alert>
      )}

      <Grid container spacing={compact ? 1.5 : 3}>
        <Grid size={{ xs: 6 }}>
          <StatCard
            title="Total enquiries"
            value={show(data?.totalEnquiries)}
            subtitle="All time"
            icon={<InboxOutlinedIcon />}
            compact={compact}
          />
        </Grid>

        <Grid size={{ xs: 6 }}>
          <StatCard
            title="Received today"
            value={show(data?.enquiriesToday)}
            subtitle="Since midnight"
            icon={<TodayOutlinedIcon />}
            compact={compact}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}