import { Box, Button, Typography } from "@mui/material";

interface SaveBarProps {
  dirty: boolean;
  saving: boolean;
  onSave: () => void;
  onDiscard: () => void;
  saveLabel?: string;
}

/** Sticky Save / Discard bar for long admin forms. */
export default function SaveBar({
  dirty,
  saving,
  onSave,
  onDiscard,
  saveLabel = "Save changes",
}: SaveBarProps) {
  return (
    <Box
      sx={{
        position: "sticky",
        bottom: 0,
        zIndex: 5,
        mt: 3,
        py: 1.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 1.5,
        bgcolor: "background.default",
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      {dirty && !saving && (
        <Typography variant="body2" color="text.secondary" sx={{ mr: "auto" }}>
          You have unsaved changes.
        </Typography>
      )}

      <Button variant="outlined" onClick={onDiscard} disabled={!dirty || saving}>
        Discard
      </Button>

      <Button variant="contained" onClick={onSave} disabled={!dirty || saving}>
        {saving ? "Saving..." : saveLabel}
      </Button>
    </Box>
  );
}