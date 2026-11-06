export function getRating(product: {
  ratingSum?: number;
  ratingCount?: number;
}) {
  const count = product.ratingCount ?? 0;
  const sum = product.ratingSum ?? 0;

  return {
    count,
    average: count > 0 ? sum / count : 0,
  };
}