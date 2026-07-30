import {
    Timestamp,
    collection,
    getDocs,
} from "firebase/firestore";

import { db } from "@/firebase/firestore";

export interface SalesReportFilters {
    startDate?: Date;
    endDate?: Date;
    search?: string;
    orderStatus?: string;
    paymentStatus?: string;
}

export interface SalesReportSummary {
    totalRevenue: number;
    totalOrders: number;
    totalProductsSold: number;
    averageOrderValue: number;
}

export interface SalesReportRow {
    id: string;
    orderId: string;
    customerName: string;
    customerEmail: string;
    orderDate: Date | null;
    orderStatus: string;
    paymentStatus: string;
    totalAmount: number;
    productsSold: number;
}

export interface SalesReport {
    summary: SalesReportSummary;
    rows: SalesReportRow[];
}

export async function getSalesReport(
    filters?: SalesReportFilters
): Promise<SalesReport> {
    const ordersSnapshot = await getDocs(
        collection(db, "orders")
    );

    const rows: SalesReportRow[] = [];

    let totalRevenue = 0;
    let totalOrders = 0;
    let totalProductsSold = 0;

    const search =
        filters?.search?.trim().toLowerCase() ?? "";

    ordersSnapshot.forEach((doc) => {
        const order = doc.data();

        const orderDate =
            order.createdAt instanceof Timestamp
                ? order.createdAt.toDate()
                : null;

        if (
            filters?.startDate &&
            orderDate &&
            orderDate < filters.startDate
        ) {
            return;
        }

        if (
            filters?.endDate &&
            orderDate &&
            orderDate > filters.endDate
        ) {
            return;
        }

        const orderId =
            order.orderNumber ?? doc.id;

        const customerName =
            order.shippingAddress?.fullName ??
            order.userName ??
            "Unknown Customer";

        const customerEmail =
            order.userEmail ?? "";

        const orderStatus =
            order.orderStatus ?? "Unknown";

        const paymentStatus =
            order.paymentStatus ?? "Unknown";

        if (
            filters?.orderStatus &&
            orderStatus.toLowerCase() !==
                filters.orderStatus.toLowerCase()
        ) {
            return;
        }

        if (
            filters?.paymentStatus &&
            paymentStatus.toLowerCase() !==
                filters.paymentStatus.toLowerCase()
        ) {
            return;
        }

        if (search) {
            const searchableText = [
                orderId,
                customerName,
                customerEmail,
            ]
                .join(" ")
                .toLowerCase();

            if (
                !searchableText.includes(search)
            ) {
                return;
            }
        }

        const totalAmount =
            typeof order.totalAmount === "number"
                ? order.totalAmount
                : 0;

        const productsSold = Array.isArray(order.items)
            ? order.items.reduce(
                  (
                      total: number,
                      item: {
                          quantity?: number;
                      }
                  ) =>
                      total +
                      (typeof item.quantity ===
                      "number"
                          ? item.quantity
                          : 0),
                  0
              )
            : 0;

        totalRevenue += totalAmount;
        totalOrders++;
        totalProductsSold += productsSold;

        rows.push({
            id: doc.id,
            orderId,
            customerName,
            customerEmail,
            orderDate,
            orderStatus,
            paymentStatus,
            totalAmount,
            productsSold,
        });
    });

    rows.sort((a, b) => {
        if (!a.orderDate && !b.orderDate) {
            return 0;
        }

        if (!a.orderDate) {
            return 1;
        }

        if (!b.orderDate) {
            return -1;
        }

        return (
            b.orderDate.getTime() -
            a.orderDate.getTime()
        );
    });

    return {
        summary: {
            totalRevenue,
            totalOrders,
            totalProductsSold,
            averageOrderValue:
                totalOrders > 0
                    ? Math.round(
                          totalRevenue /
                              totalOrders
                      )
                    : 0,
        },
        rows,
    };
}