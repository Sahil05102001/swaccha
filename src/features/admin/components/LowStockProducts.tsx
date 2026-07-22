import {
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

const products = [
  {
    id: 1,
    name: "Liquid Cleaner",
    stock: 3,
  },
  {
    id: 2,
    name: "Floor Wiper",
    stock: 5,
  },
  {
    id: 3,
    name: "Glass Cleaner",
    stock: 2,
  },
  {
    id: 4,
    name: "Toilet Brush",
    stock: 4,
  },
];

export default function LowStockProducts() {
  return (
    <Card elevation={2}>
      <CardContent>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 2,
          }}
        >
          Low Stock Products
        </Typography>

        <List disablePadding>
          {products.map((product) => (
            <ListItem
              key={product.id}
              divider
              disableGutters
              secondaryAction={
                <Chip
                  color="error"
                  size="small"
                  label={`${product.stock} Left`}
                />
              }
            >
              <ListItemText
                primary={product.name}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}