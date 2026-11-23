import {
  Box,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
} from "@mui/material";

import type { CategoryFormData } from "../types/category";

interface CategoryFormProps {
  formData: CategoryFormData;
  onChange: (
    field: keyof CategoryFormData,
    value: string | boolean
  ) => void;
}

export default function CategoryForm({
  formData,
  onChange,
}: CategoryFormProps) {
  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
        overflow: "visible",
        // Room for the floating label, which the dialog would otherwise clip.
        pt: 1,
      }}
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            required
            label="Category Name"
            value={formData.name}
            onChange={(event) => onChange("name", event.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={(event) =>
                  onChange("isActive", event.target.checked)
                }
              />
            }
            label="Active Category"
          />
        </Grid>
      </Grid>
    </Box>
  );
}