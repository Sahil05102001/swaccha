import { useEffect, useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";

import SectionCard from "@/components/common/SectionCard";
import { useSnackbar } from "@/contexts/SnackbarContext";

import RichTextEditor from "./RichTextEditor";
import type { PolicySettings } from "../types/policy";

interface Props {
  initialValues: PolicySettings;
  isSaving: boolean;
  onSubmit: (values: PolicySettings) => Promise<void> | void;
}

function scrollTop() {
  window.scrollTo({ top: 0 });
  document.querySelector("main")?.scrollTo({ top: 0 });
}

export default function PolicyForm({ initialValues, isSaving, onSubmit }: Props) {
  const { showSnackbar } = useSnackbar();
  const [form, setForm] = useState(initialValues);

  useEffect(() => {
    setForm(initialValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues.title, initialValues.content, initialValues.updatedAt?.getTime()]);

  const dirty =
    form.title !== initialValues.title || form.content !== initialValues.content;

  const save = async () => {
    try {
      await onSubmit(form);
      showSnackbar("Saved. The page now shows your changes.", "success");
      scrollTop();
    } catch {
      showSnackbar("Could not save. Please try again.", "error");
    }
  };

  return (
    <SectionCard
      title="Page content"
      subtitle="Customers see this exactly as shown in Preview."
    >
      <Stack spacing={3}>
        <TextField
          fullWidth
          label="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <RichTextEditor
          value={form.content}
          disabled={isSaving}
          onChange={(content) => setForm({ ...form, content })}
        />

        <Typography variant="caption" color="text.secondary">
          Tip: type "## " at the start of a line for a heading, **words** for bold, [words](https://address) for a link.
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button
            color="inherit"
            disabled={!dirty || isSaving}
            onClick={() => setForm(initialValues)}
          >
            Discard
          </Button>
          <Button variant="contained" disabled={!dirty || isSaving} onClick={save}>
            {isSaving ? "Saving…" : "Save changes"}
          </Button>
        </Box>
      </Stack>
    </SectionCard>
  );
}