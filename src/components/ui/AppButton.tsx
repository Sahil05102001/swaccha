import Button, { type ButtonProps } from "@mui/material/Button";

export default function AppButton(props: ButtonProps) {
  return (
    <Button
      variant="contained"
      size="medium"
      disableElevation
      {...props}
    />
  );
}