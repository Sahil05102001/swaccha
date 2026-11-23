import type { ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Link, Typography } from "@mui/material";

import {
  parseRichText,
  type Block,
  type Inline,
} from "../utils/richText";

function renderInline(parts: Inline[]): ReactNode[] {
  return parts.map((part, i) => {
    if (part.type === "bold") {
      return (
        <Box component="strong" key={i} sx={{ fontWeight: 700 }}>
          {part.text}
        </Box>
      );
    }

    if (part.type === "link") {
      const sx = {
        fontWeight: 600,
        overflowWrap: "anywhere",
        color: "#007F89",
        textDecorationColor: "#007F89",
        "&:hover": { color: "#005F68", textDecoration: "underline" },
      } as const;

      return part.external ? (
        <Link
          key={i}
          href={part.href}
          target={part.href.startsWith("http") ? "_blank" : undefined}
          rel="noopener noreferrer"
          underline="none"
          sx={sx}
        >
          {part.text}
        </Link>
      ) : (
        <Link
          key={i}
          component={RouterLink}
          to={part.href}
          underline="none"
          sx={sx}
        >
          {part.text}
        </Link>
      );
    }

    return <span key={i}>{part.text}</span>;
  });
}

function renderBlock(block: Block, index: number) {
  if (block.type === "heading") {
    return (
      <Typography
        key={index}
        component={block.level === 2 ? "h2" : "h3"}
        sx={{
          fontWeight: 700,
          fontSize: block.level === 2 ? "1.25rem" : "1.075rem",
          lineHeight: 1.4,
          mt: index === 0 ? 0 : 3,
          mb: 1,
        }}
      >
        {renderInline(block.children)}
      </Typography>
    );
  }

  if (block.type === "list") {
    return (
      <Box
        key={index}
        component="ul"
        sx={{ pl: 3, my: 1.5, lineHeight: 1.8, overflowWrap: "anywhere" }}
      >
        {block.items.map((item, i) => (
          <li key={i}>{renderInline(item)}</li>
        ))}
      </Box>
    );
  }

  return (
    <Typography
      key={index}
      component="p"
      sx={{
        my: 1.5,
        lineHeight: 1.8,
        fontSize: "1rem",
        overflowWrap: "anywhere",
        textAlign: { xs: "left", sm: "justify" },
      }}
    >
      {block.lines.map((line, i) => (
        <span key={i}>
          {i > 0 && <br />}
          {renderInline(line)}
        </span>
      ))}
    </Typography>
  );
}

interface Props {
  text: string;
}

/** Shows policy text with bold headings, bullets and clickable links. */
export default function RichText({ text }: Props) {
  return <Box>{parseRichText(text).map(renderBlock)}</Box>;
}