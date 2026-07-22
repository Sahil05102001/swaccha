import { Button, LinearProgress, Stack } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";

interface ImageUploadFieldProps {
  uploading: boolean;
  progress: number;
  onSelectFile: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

export default function ImageUploadField({
  uploading,
  progress,
  onSelectFile,
}: ImageUploadFieldProps) {
  return (
    <Stack spacing={2}>
      <Button
        component="label"
        variant="outlined"
        startIcon={<UploadIcon />}
        disabled={uploading}
      >
        {uploading
          ? "Uploading..."
          : "Choose Image"}

        <input
          hidden
          type="file"
          accept="image/*"
          onChange={onSelectFile}
        />
      </Button>

      {uploading && (
        <LinearProgress
          variant="determinate"
          value={progress}
        />
      )}
    </Stack>
  );
}