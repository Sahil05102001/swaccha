import type { MouseEvent } from "react";

import {
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

import type { Address } from "../types/address";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";

interface AddressCardProps {
  address: Address;
  /** Removes the card's own border and padding when it sits inside another bordered container. */
  embedded?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (address: Address) => void;
  onSetDefault?: (id: string) => void;
}

const COLORS = {
  white: "#FFFFFF",
  border: "#E0E0E0",
  text: "#212121",
  muted: "#757575",
  blue: "#00D9FF",
  blueText: "#0891B2",
  red: "#DC2626",
  redBorder: "#FECACA",
};

export default function AddressCard({
  address,
  embedded = false,
  onDelete,
  onEdit,
  onSetDefault,
}: AddressCardProps) {
  // Keeps button clicks from bubbling up to a clickable parent row
  const handle =
    (action: () => void) => (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      action();
    };

  const hasActions = Boolean(onSetDefault || onEdit || onDelete);

  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        bgcolor: embedded ? "transparent" : COLORS.white,
        backgroundImage: "none",
        color: COLORS.text,
        border: embedded ? "none" : `1px solid ${COLORS.border}`,
        borderRadius: embedded ? 0 : 2,
        boxShadow: "none",
      }}
    >
      <CardContent
        sx={{
          p: embedded ? 0 : { xs: 2, sm: 2.5 },
          "&:last-child": {
            pb: embedded ? 0 : { xs: 2, sm: 2.5 },
          },
        }}
      >
        <Stack spacing={1.5}>
          {/* Recipient and default label */}
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "1rem",
                color: COLORS.text,
                overflowWrap: "anywhere",
              }}
            >
              {address.fullName}
            </Typography>

            {address.isDefault && (
              <Chip
                label="Default"
                size="small"
                sx={{
                  bgcolor: "rgba(0, 217, 255, 0.12)",
                  color: COLORS.blueText,
                  border: `1px solid ${COLORS.blue}`,
                  borderRadius: "6px",
                  fontWeight: 600,
                }}
              />
            )}
          </Stack>

          {/* Address details */}
          <Stack spacing={0.5}>
            <Typography
              sx={{
                color: COLORS.text,
                fontSize: "0.9rem",
                fontWeight: 500,
              }}
            >
              {address.phoneNumber}
            </Typography>

            <Typography
              sx={{
                color: COLORS.muted,
                fontSize: "0.9rem",
                lineHeight: 1.6,
                overflowWrap: "anywhere",
              }}
            >
              {address.addressLine1}
            </Typography>

            {address.addressLine2 && (
              <Typography
                sx={{
                  color: COLORS.muted,
                  fontSize: "0.9rem",
                  lineHeight: 1.6,
                  overflowWrap: "anywhere",
                }}
              >
                {address.addressLine2}
              </Typography>
            )}

            <Typography
              sx={{
                color: COLORS.muted,
                fontSize: "0.9rem",
                lineHeight: 1.6,
              }}
            >
              {address.city}, {address.state}
            </Typography>

            <Typography
              sx={{
                color: COLORS.muted,
                fontSize: "0.9rem",
                lineHeight: 1.6,
              }}
            >
              {address.postalCode}, {address.country}
            </Typography>
            <Stack
              direction="row"
              spacing={0.5}
              sx={{ alignItems: "center", pt: 0.25 }}
            >
              <PlaceOutlinedIcon
                sx={{
                  fontSize: 16,
                  color:
                    typeof address.latitude === "number"
                      ? COLORS.blueText
                      : COLORS.muted,
                }}
              />
              <Typography
                sx={{
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color:
                    typeof address.latitude === "number"
                      ? COLORS.blueText
                      : COLORS.muted,
                }}
              >
                {typeof address.latitude === "number"
                  ? "Location pinned"
                  : "No map pin"}
              </Typography>
            </Stack>
          </Stack>

          {/* Address actions */}
          {hasActions && (
            <Stack
              direction="row"
              spacing={1}
              useFlexGap
              sx={{
                pt: 1.5,
                borderTop: `1px solid ${COLORS.border}`,
                flexWrap: "wrap",
              }}
            >
              {!address.isDefault && onSetDefault && (
                <Button
                  variant="contained"
                  size="small"
                  onClick={handle(() => onSetDefault(address.id))}
                  sx={{
                    bgcolor: COLORS.blue,
                    color: COLORS.text,
                    border: `1px solid ${COLORS.blue}`,
                    borderRadius: "999px",
                    px: 1.75,
                    textTransform: "none",
                    fontWeight: 600,
                    boxShadow: "none",
                    "&:hover": {
                      bgcolor: COLORS.blue,
                      boxShadow: "none",
                    },
                  }}
                >
                  Set as Default
                </Button>
              )}

              {onEdit && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handle(() => onEdit(address))}
                  sx={{
                    color: COLORS.text,
                    borderColor: COLORS.border,
                    borderRadius: "999px",
                    px: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": {
                      borderColor: COLORS.text,
                      bgcolor: COLORS.white,
                    },
                  }}
                >
                  Edit
                </Button>
              )}

              {onDelete && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handle(() => onDelete(address.id))}
                  sx={{
                    color: COLORS.red,
                    borderColor: COLORS.redBorder,
                    borderRadius: "999px",
                    px: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": {
                      borderColor: COLORS.red,
                      bgcolor: COLORS.white,
                    },
                  }}
                >
                  Delete
                </Button>
              )}
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}