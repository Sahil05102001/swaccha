import AppButton from "@/components/ui/AppButton";

interface PlaceOrderButtonProps {
  onClick?: () => void;
  loading?: boolean;
}

export default function PlaceOrderButton({
  onClick,
  loading = false,
}: PlaceOrderButtonProps) {
  return (
    <AppButton
      fullWidth
      onClick={onClick}
      disabled={loading}
    >
      {loading ? "Placing Order..." : "Place Order"}
    </AppButton>
  );
}