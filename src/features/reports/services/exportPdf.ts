import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import type {
    SalesReportRow,
    SalesReportSummary,
} from "./salesReportService";

export function exportSalesReportToPdf(
    rows: SalesReportRow[],
    summary: SalesReportSummary
) {
    const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
    });

    const generatedAt = new Date();

    // Company Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("SWACHHA", 148, 18, {
        align: "center",
    });

    // Report Title
    doc.setFontSize(16);
    doc.text("Sales Report", 148, 28, {
        align: "center",
    });

    // Generated Date
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    doc.text(
        `Generated On: ${generatedAt.toLocaleString("en-IN")}`,
        14,
        40
    );

    // Summary
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);

    doc.text("Summary", 14, 52);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    const summaryRows = [
        [
            "Total Revenue",
            `Rs. ${summary.totalRevenue.toLocaleString("en-IN")}`,
        ],
        [
            "Total Orders",
            summary.totalOrders.toString(),
        ],
        [
            "Products Sold",
            summary.totalProductsSold.toString(),
        ],
        [
            "Average Order Value",
            `Rs. ${summary.averageOrderValue.toLocaleString("en-IN")}`,
        ], [
            "Average Order Value",
            `Rs. ${summary.averageOrderValue.toLocaleString(
                "en-IN"
            )}`,
        ],
    ];

    autoTable(doc, {
        startY: 58,
        theme: "grid",
        head: [["Metric", "Value"]],
        body: summaryRows,
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
                "Order ID",
                "Customer",
                "Email",
                "Order Date",
                "Order Status",
                "Payment Status",
                "Products",
                "Amount",
            ],
        ],

        body: rows.map((row) => [
            row.orderId,
            row.customerName,
            row.customerEmail,
            row.orderDate
                ? row.orderDate.toLocaleDateString(
                    "en-IN"
                )
                : "",
            row.orderStatus,
            row.paymentStatus,
            row.productsSold,
            `Rs. ${row.totalAmount.toLocaleString("en-IN")}`,
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
        `Sales_Report_${today}.pdf`
    );
}