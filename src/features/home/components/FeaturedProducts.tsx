import ProductShelf from "@/components/ui/ProductShelf";

import { useProducts } from "@/features/products/hooks/useProducts";

export default function FeaturedProducts() {
  const { data: products = [], isLoading, isError } = useProducts();

  const featuredProducts = products.filter(
    (product) => product.isFeatured && product.isActive,
  );

  return (
    <ProductShelf
      title="New Arrivals"
      products={featuredProducts}
      badge="new"
      isLoading={isLoading}
      isError={isError}
      background="#FFFFFF"
    />
  );
}