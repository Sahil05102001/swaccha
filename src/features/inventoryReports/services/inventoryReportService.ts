import {
    Timestamp,
    collection,
    getDocs,
} from "firebase/firestore";

import { db } from "@/firebase/firestore";

export interface InventoryReportFilters {
    search?: string;
    category?: string;
    stockStatus?: string;
}

export interface InventoryReportRow {
    id: string;
    productName: string;
    sku: string;
    category: string;
    purchasePrice: number;
    sellingPrice: number;
    stock: number;
    stockValue: number;
    stockStatus:
        | "In Stock"
        | "Low Stock"
        | "Out of Stock";
    lastUpdated: Date | null;
}

export interface InventoryReportSummary {
    totalProducts: number;
    totalStockQuantity: number;
    totalInventoryValue: number;
    lowStockProducts: number;
    outOfStockProducts: number;
}

export interface InventoryReport {
    summary: InventoryReportSummary;
    rows: InventoryReportRow[];
}

const LOW_STOCK_THRESHOLD = 10;

export async function getInventoryReport(
    filters?: InventoryReportFilters
): Promise<InventoryReport> {
    const snapshot = await getDocs(
        collection(db, "products")
    );

    const rows: InventoryReportRow[] = [];

    let totalProducts = 0;
    let totalStockQuantity = 0;
    let totalInventoryValue = 0;
    let lowStockProducts = 0;
    let outOfStockProducts = 0;

    const search =
        filters?.search?.trim().toLowerCase() ?? "";

    snapshot.forEach((doc) => {
        const product = doc.data();

        const productName =
            product.title ??
            product.name ??
            "Unnamed Product";

        const sku = product.sku ?? "";

        const category =
            product.category ?? "Uncategorized";

        const purchasePrice =
            typeof product.purchasePrice ===
            "number"
                ? product.purchasePrice
                : 0;

        const sellingPrice =
            typeof product.price === "number"
                ? product.price
                : typeof product.sellingPrice ===
                    "number"
                  ? product.sellingPrice
                  : 0;

        const stock =
            typeof product.quantity === "number"
                ? product.quantity
                : typeof product.stock === "number"
                  ? product.stock
                  : 0;

        let stockStatus:
            | "In Stock"
            | "Low Stock"
            | "Out of Stock";

        if (stock <= 0) {
            stockStatus = "Out of Stock";
        } else if (
            stock <= LOW_STOCK_THRESHOLD
        ) {
            stockStatus = "Low Stock";
        } else {
            stockStatus = "In Stock";
        }

        if (
            filters?.category &&
            category.toLowerCase() !==
                filters.category.toLowerCase()
        ) {
            return;
        }

        if (
            filters?.stockStatus &&
            stockStatus.toLowerCase() !==
                filters.stockStatus.toLowerCase()
        ) {
            return;
        }

        if (search) {
            const searchableText = [
                productName,
                sku,
                category,
            ]
                .join(" ")
                .toLowerCase();

            if (
                !searchableText.includes(search)
            ) {
                return;
            }
        }

        const stockValue =
            sellingPrice * stock;

        const updatedAt =
            product.updatedAt instanceof
            Timestamp
                ? product.updatedAt.toDate()
                : null;

        totalProducts++;
        totalStockQuantity += stock;
        totalInventoryValue += stockValue;

        if (stockStatus === "Low Stock") {
            lowStockProducts++;
        }

        if (stockStatus === "Out of Stock") {
            outOfStockProducts++;
        }

        rows.push({
            id: doc.id,
            productName,
            sku,
            category,
            purchasePrice,
            sellingPrice,
            stock,
            stockValue,
            stockStatus,
            lastUpdated: updatedAt,
        });
    });

    rows.sort((a, b) => {
        if (a.stock !== b.stock) {
            return a.stock - b.stock;
        }

        return a.productName.localeCompare(
            b.productName
        );
    });

    return {
        summary: {
            totalProducts,
            totalStockQuantity,
            totalInventoryValue,
            lowStockProducts,
            outOfStockProducts,
        },
        rows,
    };
}