import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

import SectionCard from "@/components/common/SectionCard";
import { useSnackbar } from "@/contexts/SnackbarContext";
import SaveBar from "@/features/admin/components/SaveBar";
import { scrollToTop } from "@/features/admin/utils/scrollToTop";

import type { FaqItem, FaqSettings } from "../types/faq";

type Editable = Pick<FaqSettings, "heroTitle" | "heroSubtitle" | "faqs">;

const newId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

/** The values as they are saved: trimmed, with completely empty rows removed. */
function clean(form: Editable): Editable {
  return {
    heroTitle: form.heroTitle.trim(),
    heroSubtitle: form.heroSubtitle.trim(),
    faqs: form.faqs
      .map((faq) => ({
        id: faq.id,
        question: faq.question.trim(),
        answer: faq.answer.trim(),
        isActive: faq.isActive,
      }))
      .filter((faq) => faq.question || faq.answer),
  };
}

const toForm = (settings: FaqSettings): Editable => ({
  heroTitle: settings.heroTitle ?? "",
  heroSubtitle: settings.heroSubtitle ?? "",
  faqs: settings.faqs ?? [],
});

interface FaqFormProps {
  initial: FaqSettings;
  isSaving: boolean;
  onSave: (settings: FaqSettings) => Promise<unknown>;
}

export default function FaqForm({ initial, isSaving, onSave }: FaqFormProps) {
  const { showSnackbar } = useSnackbar();

  const [base, setBase] = useState(initial);
  const [saved, setSaved] = useState<Editable>(() => toForm(initial));
  const [form, setForm] = useState<Editable>(() => toForm(initial));
  const [problem, setProblem] = useState<string | null>(null);

  const dirty = JSON.stringify(clean(form)) !== JSON.stringify(clean(saved));

  const updateFaq = (index: number, changes: Partial<FaqItem>) => {
    setProblem(null);
    setForm((previous) => ({
      ...previous,
      faqs: previous.faqs.map((faq, i) => (i === index ? { ...faq, ...changes } : faq)),
    }));
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;

    setForm((previous) => {
      if (target < 0 || target >= previous.faqs.length) return previous;

      const faqs = [...previous.faqs];
      [faqs[index], faqs[target]] = [faqs[target], faqs[index]];

      return { ...previous, faqs };
    });
  };

  const submit = async () => {
    const values = clean(form);

    const incomplete = values.faqs.findIndex((faq) => !faq.question || !faq.answer);

    if (incomplete !== -1) {
      setProblem(
        `Question ${incomplete + 1} needs both a question and an answer, or remove it.`,
      );
      return;
    }

    if (!values.heroTitle) {
      setProblem("Enter the page title.");
      return;
    }

    const payload = { ...base, ...values } as FaqSettings;

    try {
      await onSave(payload);

      setBase(payload);
      setSaved(values);
      setForm(values);
      setProblem(null);

      showSnackbar("FAQ saved.", "success");
      scrollToTop();
    } catch {
      showSnackbar("Failed to save the FAQ.", "error");
    }
  };

  return (
    <Stack spacing={3}>
      <SectionCard title="Page heading" subtitle="Shown at the top of the FAQ page.">
        <Stack spacing={2}>
          <TextField
            label="Title"
            value={form.heroTitle}
            onChange={(e) => {
              setProblem(null);
              setForm({ ...form, heroTitle: e.target.value });
            }}
          />

          <TextField
            multiline
            minRows={2}
            label="Subtitle"
            value={form.heroSubtitle}
            onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
          />
        </Stack>
      </SectionCard>

      <SectionCard
        title={`Questions (${form.faqs.length})`}
        subtitle="They appear on the page in this order. Inactive questions are hidden."
        action={
          <Button
            size="small"
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() =>
              setForm({
                ...form,
                faqs: [
                  ...form.faqs,
                  { id: newId(), question: "", answer: "", isActive: true },
                ],
              })
            }
          >
            Add question
          </Button>
        }
      >
        <Stack spacing={1.5}>
          {form.faqs.length === 0 && (
            <Typography color="text.secondary" sx={{ py: 3, textAlign: "center" }}>
              No questions yet.
            </Typography>
          )}

          {form.faqs.map((faq, index) => (
            <Card key={faq.id} variant="outlined" sx={{ p: 2 }}>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <Typography sx={{ fontWeight: 700 }}>Question {index + 1}</Typography>

                  {!faq.isActive && (
                    <Chip size="small" variant="outlined" label="Hidden" />
                  )}

                  <Box sx={{ flex: 1 }} />

                  <IconButton
                    size="small"
                    aria-label="Move up"
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                  >
                    <ArrowUpwardIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    size="small"
                    aria-label="Move down"
                    disabled={index === form.faqs.length - 1}
                    onClick={() => move(index, 1)}
                  >
                    <ArrowDownwardIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    size="small"
                    color="error"
                    aria-label="Remove question"
                    onClick={() =>
                      setForm({
                        ...form,
                        faqs: form.faqs.filter((_, i) => i !== index),
                      })
                    }
                  >
                    <DeleteOutlinedIcon fontSize="small" />
                  </IconButton>
                </Stack>

                <TextField
                  label="Question"
                  value={faq.question}
                  onChange={(e) => updateFaq(index, { question: e.target.value })}
                />

                <TextField
                  multiline
                  minRows={3}
                  label="Answer"
                  value={faq.answer}
                  onChange={(e) => updateFaq(index, { answer: e.target.value })}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={faq.isActive}
                      onChange={(e) => updateFaq(index, { isActive: e.target.checked })}
                    />
                  }
                  label="Show on the FAQ page"
                />
              </Stack>
            </Card>
          ))}
        </Stack>
      </SectionCard>

      {problem && <Alert severity="warning">{problem}</Alert>}

      <SaveBar
        dirty={dirty}
        saving={isSaving}
        saveLabel="Save FAQ"
        onSave={() => void submit()}
        onDiscard={() => {
          setForm(saved);
          setProblem(null);
        }}
      />
    </Stack>
  );
}