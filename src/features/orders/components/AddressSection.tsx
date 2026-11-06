import { Box, Typography } from "@mui/material";

import CheckoutAddressList from "@/features/profile/components/CheckoutAddressList";

interface AddressSectionProps {
  selectedAddressId: string | null;
  onSelectAddress: (addressId: string) => void;
}

const COLORS = {
  blue: "#00D9FF",
  white: "#FFFFFF",
  text: "#212121",
  muted: "#757575",
  border: "#E0E0E0",
};

export default function AddressSection({
  selectedAddressId,
  onSelectAddress,
}: AddressSectionProps) {
  return (
    <Box
      component="section"
      sx={{
        p: { xs: 2, sm: 3 },
        border: `1px solid ${COLORS.border}`,
        borderRadius: 3,
        bgcolor: COLORS.white,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          mb: { xs: 2, sm: 2.5 },
          pb: { xs: 1.5, sm: 2 },
          borderBottom: `1px solid ${COLORS.border}`,
        }}
      >
        <Typography
          component="h2"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "1.05rem", sm: "1.2rem" },
            letterSpacing: "-0.01em",
            color: COLORS.text,
          }}
        >
          Delivery address
        </Typography>
      </Box>

      <CheckoutAddressList
        selectedAddressId={selectedAddressId}
        onSelect={onSelectAddress}
      />
    </Box>
  );
}