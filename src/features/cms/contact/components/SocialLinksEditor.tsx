import {
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import type { SocialLink } from "../types/contact";

interface SocialLinksEditorProps {
  socialLinks: SocialLink[];
  onChange: (socialLinks: SocialLink[]) => void;
}

export default function SocialLinksEditor({
  socialLinks,
  onChange,
}: SocialLinksEditorProps) {
  function updateLink(
    index: number,
    value: string,
  ) {
    const updatedLinks = socialLinks.map(
      (link, currentIndex) =>
        currentIndex === index
          ? {
              ...link,
              url: value,
            }
          : link,
    );

    onChange(updatedLinks);
  }

  return (
    <>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
        }}
      >
        Social Media
      </Typography>

      <Grid
        container
        spacing={2}
      >
        {socialLinks.map((link, index) => (
          <Grid
            key={link.id}
            size={{ xs: 12, md: 6 }}
          >
            <Paper
              variant="outlined"
              sx={{
                p: 2,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                {link.platform}
              </Typography>

              <TextField
                fullWidth
                label={`${link.platform} URL`}
                placeholder={`https://${link.platform.toLowerCase()}.com/...`}
                value={link.url}
                onChange={(event) =>
                  updateLink(
                    index,
                    event.target.value,
                  )
                }
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </>
  );
}