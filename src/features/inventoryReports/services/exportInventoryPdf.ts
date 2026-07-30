import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import type {
    InventoryReportRow,
    InventoryReportSummary,
} from "./inventoryReportService";

export function exportInventoryReportToPdf(
    rows: InventoryReportRow[],
    summary: InventoryReportSummary
) {
    const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
    });

    const generatedAt = new Date();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);

    doc.text("SWACHHA", 148, 18, {
        align: "center",
    });

    doc.setFontSize(16);

    doc.text("Inventory Report", 148, 28, {
        align: "center",
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    doc.text(
        `Generated On: ${generatedAt.toLocaleString(
            "en-IN"
        )}`,
        14,
        40
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);

    doc.text("Summary", 14, 52);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    autoTable(doc, {
        startY: 58,

        theme: "grid",

        head: [["Metric", "Value"]],

        body: [
            [
                "Total Products",
                summary.totalProducts.toString(),
            ],
            [
                "Total Stock Quantity",
                summary.totalStockQuantity.toString(),
            ],
            [
                "Inventory Value",
                `Rs. ${summary.totalInventoryValue.toLocaleString(
                    "en-IN"
                )}`,
            ],
            [
                "Low Stock Products",
                summary.lowStockProducts.toString(),
            ],
            [
                "Out of Stock Products",
                summary.outOfStockProducts.toString(),
            ],
        ],

        styles: {
            fontSize: 10,
        },

        headStyles: {
            fillColor: [25, 118, 210],
        },
    });

    const previousTableY =
        (
            doc as jsPDF & {
                lastAutoTable?: {
                    finalY: number;
                };
            }
        ).lastAutoTable?.finalY ?? 85;

    autoTable(doc, {
        startY: previousTableY + 10,

        theme: "grid",

        head: [
            [
                "Product",
                "SKU",
                "Category",
                "Purchase",
                "Selling",
                "Stock",
                "Stock Value",
                "Status",
                "Last Updated",
            ],
        ],

        body: rows.map((row) => [
            row.productName,
            row.sku,
            row.category,
            `Rs. ${row.purchasePrice.toLocaleString(
                "en-IN"
            )}`,
            `Rs. ${row.sellingPrice.toLocaleString(
                "en-IN"
            )}`,
            row.stock.toString(),
            `Rs. ${row.stockValue.toLocaleString(
                "en-IN"
            )}`,
            row.stockStatus,
            row.lastUpdated
                ? row.lastUpdated.toLocaleDateString(
                      "en-IN"
                  )
                : "-",
        ]),

        styles: {
            fontSize: 8,
            cellPadding: 2,
        },

        headStyles: {
            fillColor: [25, 118, 210],
            textColor: [255, 255, 255],
        },

        alternateRowStyles: {
            fillColor: [245, 245, 245],
        },

        didDrawPage: (data) => {
            const pageCount =
                doc.getNumberOfPages();

            doc.setFontSize(9);

            doc.text(
                `Page ${data.pageNumber} of ${pageCount}`,
                doc.internal.pageSize.width - 20,
                doc.internal.pageSize.height - 8,
                {
                    align: "right",
                }
            );
        },
    });

    const today = generatedAt
        .toISOString()
        .split("T")[0];

    doc.save(
        `Inventory_Report_${today}.pdf`
    );
}