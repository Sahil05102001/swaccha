import * as XLSX from "xlsx-js-style";

import type {
    InventoryReportRow,
    InventoryReportSummary,
} from "./inventoryReportService";

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
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
    },
};

const cellStyle = {
    border: {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
    },
};

const currencyStyle = {
    ...cellStyle,
    numFmt: "₹#,##0.00",
};

export function exportInventoryReportToExcel(
    rows: InventoryReportRow[],
    summary: InventoryReportSummary
) {
    const generatedAt = new Date();

    const worksheetData: (string | number)[][] = [
        ["Swachha"],
        ["Inventory Report"],
        [],
        [
            "Generated On",
            generatedAt.toLocaleString("en-IN"),
        ],
        [],
        ["SUMMARY"],
        ["Total Products", summary.totalProducts],
        [
            "Total Stock Quantity",
            summary.totalStockQuantity,
        ],
        [
            "Inventory Value",
            summary.totalInventoryValue,
        ],
        [
            "Low Stock Products",
            summary.lowStockProducts,
        ],
        [
            "Out Of Stock Products",
            summary.outOfStockProducts,
        ],
        [],
        [
            "Product",
            "SKU",
            "Category",
            "Purchase Price",
            "Selling Price",
            "Stock",
            "Stock Value",
            "Status",
            "Last Updated",
        ],
    ];

    rows.forEach((row) => {
        worksheetData.push([
            row.productName,
            row.sku,
            row.category,
            row.purchasePrice,
            row.sellingPrice,
            row.stock,
            row.stockValue,
            row.stockStatus,
            row.lastUpdated
                ? row.lastUpdated.toLocaleDateString(
                      "en-IN"
                  )
                : "",
        ]);
    });

    const worksheet =
        XLSX.utils.aoa_to_sheet(worksheetData);

    worksheet["!cols"] = [
        { wch: 30 },
        { wch: 18 },
        { wch: 22 },
        { wch: 18 },
        { wch: 18 },
        { wch: 12 },
        { wch: 18 },
        { wch: 18 },
        { wch: 16 },
    ];

    worksheet["!merges"] = [
        {
            s: { r: 0, c: 0 },
            e: { r: 0, c: 8 },
        },
        {
            s: { r: 1, c: 0 },
            e: { r: 1, c: 8 },
        },
    ];

    worksheet["!autofilter"] = {
        ref: "A13:I13",
    };

    worksheet["A1"].s = titleStyle;
    worksheet["A2"].s = subTitleStyle;
    worksheet["A6"].s = summaryHeadingStyle;

    for (let col = 0; col < 9; col++) {
        const cell = XLSX.utils.encode_cell({
            r: 12,
            c: col,
        });

        if (worksheet[cell]) {
            worksheet[cell].s = headerStyle;
        }
    }

    worksheet["B9"].s = currencyStyle;

    const lastRow = worksheetData.length;

    for (let row = 13; row <= lastRow; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = XLSX.utils.encode_cell({
                r: row,
                c: col,
            });

            if (!worksheet[cell]) {
                continue;
            }

            if (col === 3 || col === 4 || col === 6) {
                worksheet[cell].s =
                    currencyStyle;
            } else {
                worksheet[cell].s =
                    cellStyle;
            }
        }
    }

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Inventory Report"
    );

    const today = generatedAt
        .toISOString()
        .split("T")[0];

    XLSX.writeFile(
        workbook,
        `Inventory_Report_${today}.xlsx`
    );
}