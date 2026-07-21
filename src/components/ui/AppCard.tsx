import Card, { type CardProps } from "@mui/material/Card";

export default function AppCard(props: CardProps) {
  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        transition: "0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
        ...props.sx,
      }}
      {...props}
    />
  );
}