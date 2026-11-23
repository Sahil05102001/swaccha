import {
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import SectionCard from "@/components/common/SectionCard";
import { db } from "@/firebase/firestore";
import CardSkeleton from "./CardSkeleton";

const LOW_STOCK_AT = 5;
const MAX_SHOWN = 20;

interface LowStockItem {
  id: string;
  name: string;
  category: string;
  stock: number;
}

export default function LowStockProducts() {
  const { data: items = [], isLoading, isError } = useQuery({
    queryKey: ["low-stock-products"],
    queryFn: async (): Promise<LowStockItem[]> => {
      const snap = await getDocs(
        query(
          collection(db, "products"),
          where("stock", "<=", LOW_STOCK_AT),
          orderBy("stock"),
          limit(MAX_SHOWN),
        ),
      );

      return snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: String(data.name ?? ""),
          category: String(data.category ?? ""),
          stock: Number(data.stock ?? 0),
        };
      });
    },
    staleTime: 2 * 60_000,
    retry: false,
  });

  const outOfStock = items.filter((p) => p.stock === 0).length;
  const low = items.length - outOfStock;

  return (
    <SectionCard title="Inventory Alerts">
      {isLoading ? (
        <CardSkeleton label="Loading inventory alerts" />
      ) : isError ? (
        <Alert severity="error">Failed to load inventory alerts.</Alert>
      ) : items.length === 0 ? (
        <Typography color="success.main">
          All products are sufficiently stocked.
        </Typography>
      ) : (
        <>
          <List disablePadding>
            {items.map((product) => (
              <ListItem
                key={product.id}
                divider
                disableGutters
                secondaryAction={
                  <Chip
                    size="small"
                    color={product.stock === 0 ? "error" : "warning"}
                    label={
                      product.stock === 0
                        ? "Out of Stock"
                        : `${product.stock} Left`
                    }
                  />
                }
              >
                <ListItemText
                  primary={product.name}
                  secondary={product.category}
                  sx={{ pr: 12 }}
                />
              </ListItem>
            ))}
          </List>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Low Stock: <strong>{low}</strong>
            {" • "}
            Out of Stock: <strong>{outOfStock}</strong>
            {items.length === MAX_SHOWN && ` (showing the first ${MAX_SHOWN})`}
          </Typography>
        </>
      )}
    </SectionCard>
  );
}