import { useMemo, useState } from "react";
import { Box, Button, Radio, Stack, Typography } from "@mui/material";

import AddressCard from "./AddressCard";
import { useAddresses } from "../hooks/useAddresses";

interface CheckoutAddressListProps {
  selectedAddressId: string | null;
  onSelect: (addressId: string) => void;
}

const COLORS = {
  blue: "#00D9FF",
  white: "#FFFFFF",
  text: "#212121",
  muted: "#757575",
  border: "#E0E0E0",
  radio: "#B0B0B0",
};

const pillButtonSx = {
  flexShrink: 0,
  px: 2,
  py: 0.6,
  borderRadius: 999,
  fontWeight: 600,
  fontSize: "0.85rem",
  textTransform: "none",
  color: COLORS.text,
  borderColor: COLORS.border,
  bgcolor: COLORS.white,
  transition: "none",
  "&:hover": { borderColor: COLORS.text, bgcolor: COLORS.white },
  "&:focus-visible": {
    outline: `2px solid ${COLORS.blue}`,
    outlineOffset: 2,
  },
};

export default function CheckoutAddressList({
  selectedAddressId,
  onSelect,
}: CheckoutAddressListProps) {
  const { data: addresses = [] } = useAddresses();
  const [choosing, setChoosing] = useState(false);

  // Default address first, the rest keep their order (newest first).
  const sortedAddresses = useMemo(
    () =>
      [...addresses].sort((a, b) => Number(b.isDefault) - Number(a.isDefault)),
    [addresses]
  );

  if (addresses.length === 0) {
    return (
      <Box
        sx={{
          py: 4,
          px: 2,
          textAlign: "center",
          border: `1px dashed ${COLORS.border}`,
          borderRadius: 2,
        }}
      >
        <Typography
          sx={{ fontWeight: 600, fontSize: "0.95rem", color: COLORS.text }}
        >
          No saved addresses yet
        </Typography>
        <Typography sx={{ mt: 0.5, fontSize: "0.85rem", color: COLORS.muted }}>
          Add a delivery address from your profile to continue.
        </Typography>
      </Box>
    );
  }

  const selectedAddress = sortedAddresses.find(
    (address) => address.id === selectedAddressId
  );

  // Collapsed view: only the chosen address, with a Change button.
  if (selectedAddress && !choosing) {
    return (
      <Stack spacing={1.5}>
        <Box
          sx={{
            p: { xs: 1.5, sm: 2 },
            bgcolor: COLORS.white,
            border: `1px solid ${COLORS.blue}`,
            borderRadius: 2,
          }}
        >
          <AddressCard address={selectedAddress} embedded />
        </Box>

        {addresses.length > 1 && (
          <Button
            variant="outlined"
            disableRipple
            onClick={() => setChoosing(true)}
            sx={{ ...pillButtonSx, alignSelf: "flex-start" }}
          >
            Change address ({addresses.length} saved)
          </Button>
        )}
      </Stack>
    );
  }

  // Expanded view: pick from all saved addresses.
  return (
    <Stack spacing={1.5}>
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Typography sx={{ fontSize: "0.85rem", color: COLORS.muted }}>
          Select a delivery address
        </Typography>

        {selectedAddress && (
          <Button
            variant="outlined"
            disableRipple
            onClick={() => setChoosing(false)}
            sx={pillButtonSx}
          >
            Cancel
          </Button>
        )}
      </Stack>

      <Stack
        spacing={{ xs: 1.5, sm: 2 }}
        role="radiogroup"
        aria-label="Delivery address"
        sx={{
          // Long lists scroll inside the box instead of pushing payment down.
          maxHeight: { xs: 420, sm: 480 },
          overflowY: "auto",
          pr: 0.5,
        }}
      >
        {sortedAddresses.map((address) => {
          const selected = selectedAddressId === address.id;

          const choose = () => {
            onSelect(address.id);
            setChoosing(false);
          };

          return (
            <Stack
              key={address.id}
              direction="row"
              spacing={{ xs: 0.5, sm: 1 }}
              onClick={choose}
              sx={{
                alignItems: "flex-start",
                p: { xs: 1, sm: 1.5 },
                pr: { xs: 1.5, sm: 2 },
                cursor: "pointer",
                bgcolor: COLORS.white,
                border: `1px solid ${selected ? COLORS.blue : COLORS.border}`,
                borderRadius: 2,
              }}
            >
              <Radio
                checked={selected}
                onChange={choose}
                onClick={(e) => e.stopPropagation()}
                value={address.id}
                disableRipple
                slotProps={{
                  input: { "aria-label": "Select this address" },
                }}
                sx={{
                  p: 1,
                  color: COLORS.radio,
                  "&.Mui-checked": { color: COLORS.blue },
                  "& .MuiSvgIcon-root": { fontSize: 22 },
                }}
              />

              <Box sx={{ flex: 1, minWidth: 0, pt: 0.5 }}>
                <AddressCard address={address} embedded />
              </Box>
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
}