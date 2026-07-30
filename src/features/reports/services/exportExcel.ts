import * as XLSX from "xlsx-js-style";

import type {
    SalesReportRow,
    SalesReportSummary,
} from "./salesReportService";

const titleStyle = {
    font: {
        bold: true,
        sz: 20,
        color: {
            rgb: "FFFFFF",
        },
    },
    fill: {
        fgColor: {
            rgb: "1976D2",
        },
    },
    alignment: {
        horizontal: "center",
        vertical: "center",
    },
};

const subTitleStyle = {
    font: {
        bold: true,
        sz: 15,
    },
    alignment: {
        horizontal: "center",
    },
};

const summaryHeadingStyle = {
    font: {
        bold: true,
        sz: 13,
    },
    fill: {
        fgColor: {
            rgb: "E3F2FD",
        },
    },
};

const headerStyle = {
    font: {
        bold: true,
        color: {
            rgb: "FFFFFF",
        },
    },
    fill: {
        fgColor: {
            rgb: "1565C0",
        },
    },
    alignment: {
        horizontal: "center",
        vertical: "center",
    },
    border: {
        top: {
            style: "thin",
        },
        bottom: {
            style: "thin",
        },
        left: {
            style: "thin",
        },
        right: {
            style: "thin",
        },
    },
};

const cellStyle = {
    border: {
        top: {
            style: "thin",
        },
        bottom: {
            style: "thin",
        },
        left: {
            style: "thin",
        },
        right: {
            style: "thin",
        },
    },
};

const currencyStyle = {
    ...cellStyle,
    numFmt: '₹#,##0.00',
};

export function exportSalesReportToExcel(
    rows: SalesReportRow[],
    summary: SalesReportSummary
) {
    const generatedAt = new Date();

    const worksheetData: (string | number)[][] = [
        ["Swachha"],
        ["Sales Report"],
        [],
        [
            "Generated On",
            generatedAt.toLocaleString("en-IN"),
        ],
        [],
        ["SUMMARY"],
        ["Total Revenue", summary.totalRevenue],
        ["Total Orders", summary.totalOrders],
        [
            "Products Sold",
            summary.totalProductsSold,
        ],
        [
            "Average Order Value",
            summary.averageOrderValue,
        ],
        [],
        [
            "Order ID",
            "Customer",
            "Email",
            "Order Date",
            "Order Status",
            "Payment Status",
            "Products Sold",
            "Total Amount (₹)",
        ],
    ];

    rows.forEach((row) => {
        worksheetData.push([
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
            row.totalAmount,
        ]);
    });

    const worksheet =
        XLSX.utils.aoa_to_sheet(worksheetData);

    worksheet["!cols"] = [
        { wch: 18 },
        { wch: 28 },
        { wch: 34 },
        { wch: 16 },
        { wch: 18 },
        { wch: 18 },
        { wch: 15 },
        { wch: 18 },
    ];

    worksheet["!merges"] = [
        {
            s: { r: 0, c: 0 },
            e: { r: 0, c: 7 },
        },
        {
            s: { r: 1, c: 0 },
            e: { r: 1, c: 7 },
        },
    ];

    worksheet["!autofilter"] = {
        ref: "A12:H12",
    };

    worksheet["A1"].s = titleStyle;
    worksheet["A2"].s = subTitleStyle;
    worksheet["A6"].s = summaryHeadingStyle;

    for (let col = 0; col < 8; col++) {
        const cell = XLSX.utils.encode_cell({
            r: 11,
            c: col,
        });

        if (worksheet[cell]) {
            worksheet[cell].s = headerStyle;
        }
    }

    worksheet["B7"].s = currencyStyle;
    worksheet["B10"].s = currencyStyle;

    const lastRow = worksheetData.length;

    for (let row = 12; row <= lastRow; row++) {
        for (let col = 0; col < 8; col++) {
            const cell = XLSX.utils.encode_cell({
                r: row,
                c: col,
            });

            if (!worksheet[cell]) {
                continue;
            }

            if (col === 7) {
                worksheet[cell].s = currencyStyle;
            } else {
                worksheet[cell].s = cellStyle;
            }
        }
    }

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Sales Report"
    );

    const today = generatedAt
        .toISOString()
        .split("T")[0];

    XLSX.writeFile(
        workbook,
        `Sales_Report_${today}.xlsx`
    );
}