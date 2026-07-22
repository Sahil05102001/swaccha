import {
  Button,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";

interface ProductToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;

  category: string;
  onCategoryChange: (value: string) => void;

  status: string;
  onStatusChange: (value: string) => void;

  onAddProduct: () => void;
}

export default function ProductToolbar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
  onAddProduct,
}: ProductToolbarProps) {
  return (
    <Stack
      direction={{
        xs: "column",
        md: "row",
      }}
      spacing={2}
    >
      <TextField
        fullWidth
        label="Search Products"
        value={search}
        onChange={(e) =>
          onSearchChange(e.target.value)
        }
      />

      <TextField
        select
        label="Category"
        value={category}
        onChange={(e) =>
          onCategoryChange(e.target.value)
        }
        sx={{
          minWidth: 180,
        }}
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="Cleaner">Cleaner</MenuItem>
        <MenuItem value="Tools">Tools</MenuItem>
      </TextField>

      <TextField
        select
        label="Status"
        value={status}
        onChange={(e) =>
          onStatusChange(e.target.value)
        }
        sx={{
          minWidth: 180,
        }}
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="active">Active</MenuItem>
        <MenuItem value="inactive">Inactive</MenuItem>
      </TextField>

      <Button
        variant="contained"
        onClick={onAddProduct}
      >
        Add Product
      </Button>
    </Stack>
  );
}