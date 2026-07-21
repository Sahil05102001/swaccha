import TextField, {
  type TextFieldProps,
} from "@mui/material/TextField";

export default function AppTextField(
  props: TextFieldProps
) {
  return (
    <TextField
      fullWidth
      variant="outlined"
      size="medium"
      {...props}
    />
  );
}