import { Skeleton, Stack } from "@mui/material";

interface Props {
  label: string;
  rows?: number;
  height?: number;
}

export default function CardSkeleton({ label, rows = 4, height = 40 }: Props) {
  return (
    <Stack spacing={1} role="status" aria-label={label}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} variant="rounded" height={height} />
      ))}
    </Stack>
  );
}