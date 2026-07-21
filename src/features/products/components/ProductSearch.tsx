import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment } from "@mui/material";
import AppTextField from "@/components/ui/AppTextField";

interface ProductSearchProps {
    value: string;
    onChange: (value: string) => void;
}

export default function ProductSearch({
    value,
    onChange,
}: ProductSearchProps) {
    return (
        <AppTextField
            fullWidth
            placeholder="Search products..."
            value={value}
            onChange={(event) => onChange(event.target.value)}
            slotProps={{
                input: {
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                },
            }}
        />
    );
}