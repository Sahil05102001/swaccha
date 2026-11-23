import { useRef, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

import RichText from "./RichText";
import { safeLink } from "../utils/richText";

const BORDER = "1px solid #E2E8F0";

interface Props {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function RichTextEditor({ value, onChange, disabled }: Props) {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const [mode, setMode] = useState<"write" | "preview">("write");

  const [linkOpen, setLinkOpen] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkError, setLinkError] = useState("");
  const [linkRange, setLinkRange] = useState<[number, number]>([0, 0]);

  const selection = (): [number, number] => {
    const el = inputRef.current;
    return el ? [el.selectionStart, el.selectionEnd] : [value.length, value.length];
  };

  const apply = (next: string, from: number, to: number) => {
    onChange(next);
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(from, to);
    });
  };

  /** Start and end of every line touched by the selection. */
  const lineRange = (start: number, end: number): [number, number] => {
    const from = value.lastIndexOf("\n", start - 1) + 1;
    const nl = value.indexOf("\n", end);
    return [from, nl === -1 ? value.length : nl];
  };

  const prefixLines = (prefix: string) => {
    const [start, end] = selection();
    const [from, to] = lineRange(start, end);

    const lines = value.slice(from, to).split("\n");
    const allHave = lines.every((l) => l.startsWith(prefix));

    const changed = lines
      .map((l) => {
        // remove any heading/bullet mark first, so marks never stack
        const clean = l.replace(/^(#{2,3}\s+|[-*]\s+)/, "");
        return allHave ? clean : `${prefix}${clean}`;
      })
      .join("\n");

    apply(value.slice(0, from) + changed + value.slice(to), from, from + changed.length);
  };

  const makeBold = () => {
    const [start, end] = selection();
    const picked = value.slice(start, end);

    if (picked.startsWith("**") && picked.endsWith("**") && picked.length > 4) {
      const plain = picked.slice(2, -2);
      apply(value.slice(0, start) + plain + value.slice(end), start, start + plain.length);
      return;
    }

    const text = picked || "bold text";
    const wrapped = `**${text}**`;
    apply(
      value.slice(0, start) + wrapped + value.slice(end),
      start + 2,
      start + 2 + text.length,
    );
  };

  const openLink = () => {
    const [start, end] = selection();
    setLinkRange([start, end]);
    setLinkText(value.slice(start, end));
    setLinkUrl("");
    setLinkError("");
    setLinkOpen(true);
  };

  const insertLink = () => {
    const text = linkText.trim();

    if (!text) return setLinkError("Enter the words customers will click.");
    if (/[\]\[]/.test(text)) return setLinkError("Square brackets are not allowed in the link text.");

    const link = safeLink(linkUrl);
    if (!link) {
      return setLinkError(
        "Use a full web address (https://…), an email (mailto:…), a phone (tel:…) or a page on this site starting with / (like /contact).",
      );
    }

    const markup = `[${text}](${link.href})`;
    const [from, to] = linkRange;

    onChange(value.slice(0, from) + markup + value.slice(to));
    setLinkOpen(false);

    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(from + markup.length, from + markup.length);
    });
  };

  const tools = [
    { label: "Heading", run: () => prefixLines("## ") },
    { label: "Sub-heading", run: () => prefixLines("### ") },
    { label: "Bold", run: makeBold, bold: true },
    { label: "Bullet list", run: () => prefixLines("- ") },
    { label: "Link", run: openLink },
  ];

  return (
    <Box sx={{ border: BORDER, borderRadius: 1 }}>
      <Stack
        direction="row"
        spacing={1}
        useFlexGap
        sx={{
          p: 1,
          flexWrap: "wrap",
          alignItems: "center",
          borderBottom: BORDER,
        }}
      >
        {tools.map((tool) => (
          <Button
            key={tool.label}
            size="small"
            variant="outlined"
            color="inherit"
            disabled={disabled || mode === "preview"}
            // keeps the text selection while the button is pressed
            onMouseDown={(e) => e.preventDefault()}
            onClick={tool.run}
            sx={{ fontWeight: tool.bold ? 800 : 500, borderColor: "#CBD5E1" }}
          >
            {tool.label}
          </Button>
        ))}

        <Box sx={{ flex: 1 }} />

        <ToggleButtonGroup
          size="small"
          exclusive
          value={mode}
          onChange={(_, next) => next && setMode(next)}
        >
          <ToggleButton value="write">Write</ToggleButton>
          <ToggleButton value="preview">Preview</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {mode === "write" ? (
        <TextField
          fullWidth
          multiline
          minRows={20}
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          inputRef={inputRef}
          placeholder="Type your policy here. Select some words, then use the buttons above to make a heading, bold text or a link."
          sx={{
            "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            "& textarea": { lineHeight: 1.7 },
          }}
        />
      ) : (
        <Box sx={{ p: 3, minHeight: 360 }}>
          {value.trim() ? (
            <RichText text={value} />
          ) : (
            <Typography color="text.secondary">Nothing to preview yet.</Typography>
          )}
        </Box>
      )}

      <Dialog
        open={linkOpen}
        onClose={() => setLinkOpen(false)}
        fullWidth
        maxWidth="xs"
        transitionDuration={0}
      >
        <DialogTitle>Add a link</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Words customers will click"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              autoFocus
              fullWidth
            />
            <TextField
              label="Address"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://… or /contact"
              error={Boolean(linkError)}
              helperText={
                linkError ||
                "A website (https://…), email (mailto:you@shop.com), phone (tel:+91…) or a page on this site (/contact)."
              }
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button color="inherit" onClick={() => setLinkOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={insertLink}>
            Add link
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}