import { useEffect, useState } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

interface Props {
  onExcel: () => void;
  onPdf: () => void;
  busy?: boolean;
  disabled?: boolean;
}

export default function ReportDownloadMenu({ onExcel, onPdf, busy, disabled }: Props) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  // Close when the page scrolls (also catches scrolling inside the admin layout).
  useEffect(() => {
    if (!anchor) return;
    const close = () => setAnchor(null);
    window.addEventListener("scroll", close, true);
    return () => window.removeEventListener("scroll", close, true);
  }, [anchor]);

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<FileDownloadOutlinedIcon />}
        onClick={(event) => setAnchor(event.currentTarget)}
        disabled={disabled || busy}
      >
        {busy ? "Preparing..." : "Download"}
      </Button>

      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        transitionDuration={0}
        slotProps={{
          paper: { elevation: 0, sx: { border: "1px solid", borderColor: "divider" } },
        }}
      >
        <MenuItem
          onClick={() => {
            setAnchor(null);
            onExcel();
          }}
        >
          Excel (.xlsx)
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchor(null);
            onPdf();
          }}
        >
          PDF (.pdf)
        </MenuItem>
      </Menu>
    </>
  );
}