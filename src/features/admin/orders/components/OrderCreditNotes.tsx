import { Button, Stack, Typography } from "@mui/material";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";

import type { Order } from "@/features/orders/types/order";
import { generateCreditNote } from "@/features/orders/utils/generateCreditNote";

interface OrderCreditNotesProps {
  order: Order;
}

// Lists every refund with its credit note, so none can be missed.
export default function OrderCreditNotes({ order }: OrderCreditNotesProps) {
  if (order.tax?.applied !== true || !order.invoiceNumber) return null;

  const refunds = (order.refunds ?? []).filter((r) => r.status !== "failed");

  if (refunds.length === 0) return null;

  return (
    <Stack spacing={1.5}>
      <Typography component="h3" sx={{ fontWeight: 700, fontSize: "1rem" }}>
        Credit notes
      </Typography>

      {refunds.map((refund) => (
        <Stack
          key={refund.id}
          direction="row"
          spacing={2}
          sx={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <Stack sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 600 }}>
              Refund of ₹{refund.amount.toLocaleString("en-IN")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {refund.creditNote
                ? refund.creditNote.number
                : "No credit note yet. It is issued once the refund is accepted."}
            </Typography>
          </Stack>

          {refund.creditNote && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<DownloadOutlinedIcon />}
              onClick={() => void generateCreditNote(order, refund)}
            >
              Download
            </Button>
          )}
        </Stack>
      ))}
    </Stack>
  );
}