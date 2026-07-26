import {
    collection,
    getDocs,
} from "firebase/firestore";

import { db } from "@/firebase/firestore";

export interface TopSellingProduct {
    productId: string;
    productName: string;
    totalSold: number;
    revenue: number;
}

export async function getTopSellingProducts(): Promise<
    TopSellingProduct[]
> {
    const ordersSnapshot = await getDocs(
        collection(db, "orders")
    );

    const productMap = new Map<
        string,
        TopSellingProduct
    >();

    ordersSnapshot.forEach((doc) => {
        const order = doc.data();

        if (!Array.isArray(order.items)) {
            return;
        }

        order.items.forEach((item: any) => {
            const productId =
                item.productId ?? "";

            const productName =
                item.productName ??
                item.name ??
                "Unknown Product";

            const quantity =
                typeof item.quantity === "number"
                    ? item.quantity
                    : 0;

            const price =
                typeof item.price === "number"
                    ? item.price
                    : 0;

            if (!productMap.has(productId)) {
                productMap.set(productId, {
                    productId,
                    productName,
                    totalSold: 0,
                    revenue: 0,
                });
            }

            const product =
                productMap.get(productId)!;

            product.totalSold += quantity;
            product.revenue += quantity * price;
        });
    });

    return [...productMap.values()]
        .sort(
            (a, b) =>
                b.totalSold - a.totalSold
        )
        .slice(0, 5);
}