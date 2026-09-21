import {
  Button,
  IconButton,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import { useState } from "react";

import { useFaqSettings } from "../hooks/useFaqSettings";
import type {
  FaqItem,
  FaqSettings,
} from "../types/faq";

export default function FaqForm() {
  const {
    faqSettings,
    isLoading,
    isSaving,
    saveFaqSettings,
  } = useFaqSettings();

  const [form, setForm] =
    useState<FaqSettings | null>(faqSettings ?? null);

  if (isLoading || !form) return null;

  const updateFaq = (
    index: number,
    changes: Partial<FaqItem>,
  ) => {
    const updated = [...form.faqs];

    updated[index] = {
      ...updated[index],
      ...changes,
    };

    setForm({
      ...form,
      faqs: updated,
    });
  };

  const addFaq = () => {
    setForm({
      ...form,
      faqs: [
        ...form.faqs,
        {
          id: crypto.randomUUID(),
          question: "",
          answer: "",
          isActive: true,
        },
      ],
    });
  };

  const removeFaq = (index: number) => {
    setForm({
      ...form,
      faqs: form.faqs.filter(
        (_, i) => i !== index,
      ),
    });
  };

  return (
    <Stack spacing={3}>
      <TextField
        label="Hero Title"
        value={form.heroTitle}
        onChange={(e) =>
          setForm({
            ...form,
            heroTitle: e.target.value,
          })
        }
      />

      <TextField
        multiline
        minRows={2}
        label="Hero Subtitle"
        value={form.heroSubtitle}
        onChange={(e) =>
          setForm({
            ...form,
            heroSubtitle: e.target.value,
          })
        }
      />

      {form.faqs.map((faq, index) => (
        <Paper
          key={faq.id}
          sx={{ p: 2 }}
        >
          <Stack spacing={2}>
            <TextField
              label="Question"
              value={faq.question}
              onChange={(e) =>
                updateFaq(index, {
                  question:
                    e.target.value,
                })
              }
            />

            <TextField
              multiline
              minRows={4}
              label="Answer"
              value={faq.answer}
              onChange={(e) =>
                updateFaq(index, {
                  answer:
                    e.target.value,
                })
              }
            />

            <Stack
              direction="row"
              sx={{
                justifyContent:
                  "space-between",
                alignItems: "center",
              }}
            >
              <Stack
                direction="row"
                sx={{
                  alignItems: "center",
                }}
              >
                <Typography>
                  Active
                </Typography>

                <Switch
                  checked={faq.isActive}
                  onChange={(e) =>
                    updateFaq(index, {
                      isActive:
                        e.target.checked,
                    })
                  }
                />
              </Stack>

              <IconButton
                color="error"
                onClick={() =>
                  removeFaq(index)
                }
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Paper>
      ))}

      <Button
        startIcon={<AddIcon />}
        onClick={addFaq}
      >
        Add FAQ
      </Button>

      <Button
        variant="contained"
        disabled={isSaving}
        onClick={() =>
          saveFaqSettings(form)
        }
      >
        Save FAQ
      </Button>
    </Stack>
  );
}