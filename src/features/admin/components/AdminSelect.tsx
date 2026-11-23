import type { ReactNode } from "react";
import { TextField, type TextFieldProps } from "@mui/material";

import { useDropdown } from "../hooks/useDropdown";

type Props = Omit<TextFieldProps, "select" | "children"> & {
  children: ReactNode;
  /** Height (px) of the open list before it starts scrolling. */
  menuMaxHeight?: number;
};

/**
 * The dropdown to use everywhere in the admin panel:
 * opens under its field, scrolls inside, closes when the page scrolls.
 */
export default function AdminSelect({
  children,
  menuMaxHeight = 240,
  slotProps,
  ...rest
}: Props) {
  const dropdown = useDropdown();

  return (
    <TextField
      {...rest}
      select
      slotProps={{
        ...slotProps,
        select: {
          open: dropdown.open,
          onOpen: dropdown.onOpen,
          onClose: dropdown.onClose,
          MenuProps: {
            anchorOrigin: { vertical: "bottom", horizontal: "left" },
            transformOrigin: { vertical: "top", horizontal: "left" },
            slotProps: { paper: { sx: { maxHeight: menuMaxHeight } } },
          },
        },
      }}
    >
      {children}
    </TextField>
  );
}