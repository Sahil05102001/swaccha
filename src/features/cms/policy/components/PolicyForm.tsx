import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
} from "@mui/material";

import type { PolicySettings } from "../types/policy";

interface Props {
  initialValues: PolicySettings;
  isSaving: boolean;
  onSubmit: (
    values: PolicySettings,
  ) => Promise<void> | void;
}

export default function PolicyForm({
  initialValues,
  isSaving,
  onSubmit,
}: Props) {
  const [form, setForm] =
    useState(initialValues);

  const [success, setSuccess] =
    useState(false);

  useEffect(() => {
    setForm(initialValues);
  }, [initialValues]);

  return (
    <Paper sx={{ p: 3 }}>
      {success && (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
        >
          Saved Successfully
        </Alert>
      )}

      <Stack spacing={3}>
        <TextField
          fullWidth
          label="Title"
          value={form.title}
          onChange={(e) =>
            setForm({
              ...form,
              title: e.target.value,
            })
          }
        />

        <TextField
          fullWidth
          multiline
          minRows={20}
          label="Content"
          value={form.content}
          onChange={(e) =>
            setForm({
              ...form,
              content: e.target.value,
            })
          }
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="contained"
            disabled={isSaving}
            onClick={async () => {
              await onSubmit(form);
              setSuccess(true);
            }}
          >
            Save
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}