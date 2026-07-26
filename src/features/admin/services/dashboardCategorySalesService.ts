import {
    collection,
    getDocs,
} from "firebase/firestore";

import { db } from "@/firebase/firestore";

export interface CategorySales {
    category: string;
    totalRevenue: number;
    totalSold: number;
}

export async function getCategorySales(): Promise<
    CategorySales[]
> {
    const ordersSnapshot = await getDocs(
        collection(db, "orders")
    );

    const categoryMap = new Map<
        string,
        CategorySales
    >();

    ordersSnapshot.forEach((doc) => {
        const order = doc.data();

        if (!Array.isArray(order.items)) {
            return;
        }

        order.items.forEach((item: any) => {
            const category =
                item.category ??
                item.categoryName ??
                "Uncategorized";

            const quantity =
                typeof item.quantity === "number"
                    ? item.quantity
                    : 0;

            const price =
                typeof item.price === "number"
                    ? item.price
                    : 0;

            if (!categoryMap.has(category)) {
                categoryMap.set(category, {
                    category,
                    totalRevenue: 0,
                    totalSold: 0,
                });
            }

            const sales = categoryMap.get(category)!;

            sales.totalRevenue += quantity * price;
            sales.totalSold += quantity;
        });
    });

    return [...categoryMap.values()].sort(
        (a, b) => b.totalRevenue - a.totalRevenue
    );
}