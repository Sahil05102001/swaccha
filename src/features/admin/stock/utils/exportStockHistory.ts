import * as XLSX from "xlsx-js-style";

export interface StockExportRow {
  id: string;
  productName: string;
  sku?: string;
  movementType: string;
  direction: "in" | "out";
  quantity: number;
  previousStock: number;
  newStock: number;
  referenceId?: string;
  note?: string;
  createdAt?: { toDate: () => Date } | null;
}

export interface StockExportMeta {
  /** e.g. ["Product: Cleaning brush", "From: 01/11/2026"]. Empty means no filters. */
  filters: string[];
  summary?: {
    received: number;
    sold: number;
    restored: number;
    manualNet: number;
  };
  typeLabel: (type: string) => string;
}

const INK = "0F172A";
const LINE = "CBD5E1";

const pad = (n: number) => String(n).padStart(2, "0");

/** Local date as YYYY-MM-DD (toISOString would shift it for IST). */
function localDate(d = new Date()) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const when = (row: StockExportRow) =>
  row.createdAt
    ? row.createdAt
        .toDate()
        .toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
    : "";

const signed = (row: StockExportRow) =>
  row.direction === "in" ? row.quantity : -row.quantity;

const filterText = (meta: StockExportMeta) =>
  meta.filters.length > 0
    ? meta.filters.join("   |   ")
    : "None (all stock movements)";

const border = {
  top: { style: "thin", color: { rgb: LINE } },
  bottom: { style: "thin", color: { rgb: LINE } },
  left: { style: "thin", color: { rgb: LINE } },
  right: { style: "thin", color: { rgb: LINE } },
};

function style(ws: XLSX.WorkSheet, address: string, s: unknown) {
  const cell = ws[address];
  if (cell) cell.s = s as never;
}

export function exportStockHistoryExcel(
  rows: StockExportRow[],
  meta: StockExportMeta,
) {
  const COLS = 9;
  const generated = new Date();

  const aoa: (string | number)[][] = [
    ["Swachha"],
    ["Stock History"],
    [],
    ["Generated on", generated.toLocaleString("en-IN")],
    ["Filters", filterText(meta)],
    ["Rows", rows.length],
  ];

  if (meta.summary) {
    aoa.push(
      ["Stock received", meta.summary.received],
      ["Sold", meta.summary.sold],
      ["Returned / restored", meta.summary.restored],
      ["Manual changes (net)", meta.summary.manualNet],
    );
  }

  aoa.push([]);

  const headerRow = aoa.length; // zero-based index of the header
  aoa.push([
    "Date",
    "Product",
    "SKU",
    "Type",
    "Change",
    "Stock before",
    "Stock after",
    "Reference",
    "Note",
  ]);

  rows.forEach((row) => {
    aoa.push([
      when(row),
      row.productName,
      row.sku ?? "",
      meta.typeLabel(row.movementType),
      signed(row),
      row.previousStock,
      row.newStock,
      row.referenceId ?? "",
      row.note ?? "",
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(aoa);

  ws["!cols"] = [
    { wch: 22 },
    { wch: 32 },
    { wch: 16 },
    { wch: 20 },
    { wch: 10 },
    { wch: 14 },
    { wch: 14 },
    { wch: 24 },
    { wch: 44 },
  ];

  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: COLS - 1 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: COLS - 1 } },
  ];

  ws["!autofilter"] = {
    ref: `A${headerRow + 1}:${XLSX.utils.encode_col(COLS - 1)}${aoa.length}`,
  };

  style(ws, "A1", {
    font: { bold: true, sz: 18, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: INK } },
    alignment: { horizontal: "center", vertical: "center" },
  });
  style(ws, "A2", {
    font: { bold: true, sz: 13 },
    alignment: { horizontal: "center" },
  });

  for (let r = 3; r < headerRow - 1; r++) {
    style(ws, XLSX.utils.encode_cell({ r, c: 0 }), { font: { bold: true } });
  }

  for (let c = 0; c < COLS; c++) {
    style(ws, XLSX.utils.encode_cell({ r: headerRow, c }), {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: INK } },
      alignment: { horizontal: "center", vertical: "center" },
      border,
    });
  }

  rows.forEach((row, i) => {
    const r = headerRow + 1 + i;
    for (let c = 0; c < COLS; c++) {
      const base: Record<string, unknown> = {
        border,
        alignment: {
          vertical: "top",
          wrapText: c === 1 || c === 8,
          horizontal: c >= 4 && c <= 6 ? "right" : "left",
        },
      };
      if (c === 4) {
        base.font = {
          bold: true,
          color: { rgb: row.direction === "in" ? "15803D" : "B91C1C" },
        };
        base.numFmt = "+0;-0;0";
      }
      style(ws, XLSX.utils.encode_cell({ r, c }), base);
    }
  });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Stock History");
  XLSX.writeFile(wb, `Stock_History_${localDate(generated)}.xlsx`);
}

export async function exportStockHistoryPdf(
  rows: StockExportRow[],
  meta: StockExportMeta,
) {
  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const generated = new Date();
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text("Swachha - Stock History", 14, 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(90);

  let y = 22;
  doc.text(`Generated on ${generated.toLocaleString("en-IN")}`, 14, y);

  y += 5;
  const filterLines = doc.splitTextToSize(
    `Filters: ${filterText(meta)}`,
    pageW - 28,
  );
  doc.text(filterLines, 14, y);
  y += filterLines.length * 4;

  if (meta.summary) {
    const s = meta.summary;
    doc.text(
      `Received ${s.received}   |   Sold ${s.sold}   |   Returned / restored ${s.restored}   |   Manual changes (net) ${s.manualNet > 0 ? "+" : ""}${s.manualNet}`,
      14,
      y,
    );
    y += 4;
  }

  doc.text(`${rows.length} movement${rows.length === 1 ? "" : "s"}`, 14, y);

  autoTable(doc, {
    startY: y + 4,
    margin: { left: 14, right: 14, bottom: 16 },
    head: [["Date", "Product", "Type", "Change", "Stock", "Reference / note"]],
    body: rows.map((row) => [
      when(row),
      row.sku ? `${row.productName}\n${row.sku}` : row.productName,
      meta.typeLabel(row.movementType),
      `${row.direction === "in" ? "+" : "-"}${row.quantity}`,
      `${row.previousStock} to ${row.newStock}`,
      [row.referenceId, row.note].filter(Boolean).join(" - "),
    ]),
    styles: { fontSize: 8, cellPadding: 2, valign: "top", textColor: [30, 41, 59] },
    headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: "bold" },
    columnStyles: {
      0: { cellWidth: 36 },
      1: { cellWidth: 64 },
      2: { cellWidth: 34 },
      3: { cellWidth: 20, halign: "right" },
      4: { cellWidth: 28, halign: "right" },
    },
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index === 3) {
        const row = rows[data.row.index];
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.textColor =
          row?.direction === "in" ? [21, 128, 61] : [185, 28, 28];
      }
    },
  });

  const total = doc.getNumberOfPages();
  doc.setFontSize(8);
  doc.setTextColor(120);
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    doc.text(`Page ${i} of ${total}`, pageW - 14, pageH - 8, { align: "right" });
  }

  doc.save(`Stock_History_${localDate(generated)}.pdf`);
}