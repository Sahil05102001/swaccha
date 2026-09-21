import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import type { FaqItem } from "../types/faq";

interface Props {
  faq: FaqItem;
}

export default function FaqAccordion({
  faq,
}: Props) {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
      >
        <Typography
          sx={{
            fontWeight: 600,
          }}
        >
          {faq.question}
        </Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Typography color="text.secondary">
          {faq.answer}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
}