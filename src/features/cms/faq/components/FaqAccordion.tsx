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

const ink = "#17252B";
const muted = "#52656B";
const border = "#E5ECEE";

export default function FaqAccordion({ faq }: Props) {
  return (
    <Accordion
      disableGutters
      elevation={0}
      square
      slotProps={{ transition: { timeout: 0 } }}
      sx={{
        border: `1px solid ${border}`,
        borderRadius: "12px !important",
        backgroundColor: "#FFFFFF",
        backgroundImage: "none",
        boxShadow: "none",
        overflow: "hidden",
        "&::before": { display: "none" },
        "&.Mui-expanded": { borderColor: "#00BFD6" },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: ink }} />}
        sx={{
          px: { xs: 2, sm: 2.5 },
          py: 0.5,
          "& .MuiAccordionSummary-content": { my: 1.5 },
        }}
      >
        <Typography
          sx={{
            color: ink,
            fontWeight: 600,
            fontSize: { xs: "0.98rem", sm: "1.05rem" },
            lineHeight: 1.5,
            overflowWrap: "anywhere",
          }}
        >
          {faq.question}
        </Typography>
      </AccordionSummary>

      <AccordionDetails sx={{ px: { xs: 2, sm: 2.5 }, pt: 0, pb: 2.5 }}>
        <Typography
          sx={{
            color: muted,
            lineHeight: 1.8,
            whiteSpace: "pre-line",
            overflowWrap: "anywhere",
            fontSize: { xs: "0.95rem", sm: "1rem" },
          }}
        >
          {faq.answer}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
}
