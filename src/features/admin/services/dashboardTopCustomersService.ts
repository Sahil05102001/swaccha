import {
    Timestamp,
    collection,
    getDocs,
} from "firebase/firestore";

import { db } from "@/firebase/firestore";

export interface TopCustomer {
    userId: string;
    customerName: string;
    customerEmail: string;
    totalOrders: number;
    totalSpent: number;
    lastOrderDate: Date | null;
}

export async function getTopCustomers(): Promise<
    TopCustomer[]
> {
    const ordersSnapshot = await getDocs(
        collection(db, "orders")
    );

    const customerMap = new Map<
        string,
        TopCustomer
    >();

    ordersSnapshot.forEach((doc) => {
        const order = doc.data();

        const userId =
            order.userId ?? "unknown";

        const customerName =
            order.shippingAddress?.fullName ??
            order.userName ??
            "Unknown Customer";

        const customerEmail =
            order.userEmail ?? "";

        const totalAmount =
            typeof order.totalAmount === "number"
                ? order.totalAmount
                : 0;

        const createdAt =
            order.createdAt instanceof Timestamp
                ? order.createdAt.toDate()
                : null;

        if (!customerMap.has(userId)) {
            customerMap.set(userId, {
                userId,
                customerName,
                customerEmail,
                totalOrders: 0,
                totalSpent: 0,
                lastOrderDate: createdAt,
            });
        }

        const customer =
            customerMap.get(userId)!;

        customer.totalOrders += 1;
        customer.totalSpent += totalAmount;

        if (
            createdAt &&
            (!customer.lastOrderDate ||
                createdAt > customer.lastOrderDate)
        ) {
            customer.lastOrderDate = createdAt;
        }
    });

    return [...customerMap.values()]
        .sort(
            (a, b) =>
                b.totalSpent - a.totalSpent
        )
        .slice(0, 5);
}