import { Paper, Typography } from "@mui/material";

interface Props {
  label: string;
  value: string | number;
  hint?: string;
}

export default function ReportStat({ label, value, hint }: Props) {
  return (
    <Paper variant="outlined" sx={{ p: 1.5, flex: "1 1 150px", minWidth: 150 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography sx={{ fontWeight: 700, fontSize: "1.25rem", overflowWrap: "anywhere" }}>
        {value}
      </Typography>
      {hint && (
        <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
          {hint}
        </Typography>
      )}
    </Paper>
  );
}