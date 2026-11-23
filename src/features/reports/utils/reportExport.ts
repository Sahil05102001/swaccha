import type JsPdf from "jspdf";
import * as XLSX from "xlsx-js-style";

const INK = "0F172A";
const LINE = "CBD5E1";
const MONEY_FORMAT = '"₹"#,##0.00';

const pad = (n: number) => String(n).padStart(2, "0");

/** Local date as YYYY-MM-DD (toISOString would shift it for IST). */
export function localDate(d = new Date()) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const border = {
  top: { style: "thin", color: { rgb: LINE } },
  bottom: { style: "thin", color: { rgb: LINE } },
  left: { style: "thin", color: { rgb: LINE } },
  right: { style: "thin", color: { rgb: LINE } },
};

function setStyle(ws: XLSX.WorkSheet, address: string, s: unknown) {
  const cell = ws[address];
  if (cell) cell.s = s as never;
}

type ValueType = "text" | "money" | "int";

export interface ExcelColumn {
  header: string;
  width: number;
  type?: ValueType;
}

export interface ExcelReportOptions {
  fileName: string;
  notice?: string;
  title: string;
  info: [string, string | number][];
  summary: [string, string | number, ValueType][];
  columns: ExcelColumn[];
  rows: (string | number)[][];
}

export function downloadExcelReport(o: ExcelReportOptions) {
  const cols = o.columns.length;
  const aoa: (string | number)[][] = [["Swachha"], [o.title], []];

  let noticeRow = -1;
  if (o.notice) {
    noticeRow = aoa.length;
    aoa.push([o.notice]);
    aoa.push([]);
  }

  const infoStart = aoa.length;
  o.info.forEach(([k, v]) => aoa.push([k, v]));

  let summaryHeading = -1;
  if (o.summary.length > 0) {
    aoa.push([]);
    summaryHeading = aoa.length;
    aoa.push(["SUMMARY"]);
  }

  const summaryFirst = aoa.length;
  o.summary.forEach(([k, v]) => aoa.push([k, v]));
  aoa.push([]);

  const headerRow = aoa.length;
  aoa.push(o.columns.map((c) => c.header));
  o.rows.forEach((r) => aoa.push(r));

  const ws = XLSX.utils.aoa_to_sheet(aoa);

  ws["!cols"] = o.columns.map((c) => ({ wch: c.width }));
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: cols - 1 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: cols - 1 } },
  ];

  if (noticeRow >= 0) {
    ws["!merges"].push({ s: { r: noticeRow, c: 0 }, e: { r: noticeRow, c: cols - 1 } });
    ws["!rows"] = [];
    ws["!rows"][noticeRow] = { hpt: 34 };
    setStyle(ws, XLSX.utils.encode_cell({ r: noticeRow, c: 0 }), {
      font: { bold: true, color: { rgb: "B91C1C" } },
      fill: { fgColor: { rgb: "FEE2E2" } },
      alignment: { wrapText: true, vertical: "center" },
    });
  }
  ws["!autofilter"] = {
    ref: `A${headerRow + 1}:${XLSX.utils.encode_col(cols - 1)}${aoa.length}`,
  };

  const at = (r: number, c: number) => XLSX.utils.encode_cell({ r, c });

  setStyle(ws, "A1", {
    font: { bold: true, sz: 18, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: INK } },
    alignment: { horizontal: "center", vertical: "center" },
  });
  setStyle(ws, "A2", {
    font: { bold: true, sz: 13 },
    alignment: { horizontal: "center" },
  });

  for (let r = infoStart; r < infoStart + o.info.length; r++) {
    setStyle(ws, at(r, 0), { font: { bold: true } });
  }

  if (summaryHeading >= 0) {
    setStyle(ws, at(summaryHeading, 0), {
      font: { bold: true, sz: 12 },
      fill: { fgColor: { rgb: "E2E8F0" } },
    });
  }

  o.summary.forEach(([, , type], i) => {
    const r = summaryFirst + i;
    setStyle(ws, at(r, 0), { font: { bold: true } });
    setStyle(ws, at(r, 1), {
      alignment: { horizontal: "left" },
      ...(type === "money"
        ? { numFmt: MONEY_FORMAT }
        : type === "int"
          ? { numFmt: "#,##0" }
          : {}),
    });
  });

  for (let c = 0; c < cols; c++) {
    setStyle(ws, at(headerRow, c), {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: INK } },
      alignment: { horizontal: "center", vertical: "center", wrapText: true },
      border,
    });
  }

  o.rows.forEach((_, i) => {
    const r = headerRow + 1 + i;
    o.columns.forEach((col, c) => {
      const numeric = col.type === "money" || col.type === "int";
      setStyle(ws, at(r, c), {
        border,
        alignment: {
          vertical: "top",
          horizontal: numeric ? "right" : "left",
          wrapText: !numeric,
        },
        ...(col.type === "money"
          ? { numFmt: MONEY_FORMAT }
          : col.type === "int"
            ? { numFmt: "#,##0" }
            : {}),
      });
    });
  });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, o.title.slice(0, 31));
  XLSX.writeFile(wb, `${o.fileName}_${localDate()}.xlsx`);
}

export interface PdfReportOptions {
  fileName: string;
  notice?: string;
  title: string;
  info: string[];
  summary: [string, string][];
  head: string[];
  body: string[][];
  rightAlign?: number[];
}

export async function downloadPdfReport(o: PdfReportOptions) {
  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text(`Swachha - ${o.title}`, 14, 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(90);

  let y = 22;

  if (o.notice) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(185, 28, 28);
    const noticeLines = doc.splitTextToSize(o.notice, pageW - 28);
    doc.text(noticeLines, 14, y);
    y += noticeLines.length * 4 + 1;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(90);
  }
  o.info.forEach((line) => {
    const lines = doc.splitTextToSize(line, pageW - 28);
    doc.text(lines, 14, y);
    y += lines.length * 4;
  });

  const finalY = () =>
    (doc as JsPdf & { lastAutoTable?: { finalY: number } }).lastAutoTable
      ?.finalY ?? y + 40;

  if (o.summary.length > 0) {
    autoTable(doc, {
      startY: y + 2,
      margin: { left: 14 },
      tableWidth: 110,
      theme: "grid",
      head: [["Summary", ""]],
      body: o.summary,
      styles: { fontSize: 9, cellPadding: 1.8 },
      headStyles: { fillColor: [15, 23, 42], textColor: 255 },
      columnStyles: { 1: { halign: "right" } },
    });
    y = finalY();
  }

  const columnStyles: Record<number, { halign: "right" }> = {};
  for (const i of o.rightAlign ?? []) columnStyles[i] = { halign: "right" };

  autoTable(doc, {
    startY: y + 6,
    margin: { left: 14, right: 14, bottom: 16 },
    head: [o.head],
    body: o.body,
    styles: { fontSize: 8, cellPadding: 2, valign: "top", textColor: [30, 41, 59] },
    headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles,
  });

  // Page numbers after the table is complete, so the total is right.
  const total = doc.getNumberOfPages();
  doc.setFontSize(8);
  doc.setTextColor(120);
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    doc.text(`Page ${i} of ${total}`, pageW - 14, pageH - 8, { align: "right" });
  }

  doc.save(`${o.fileName}_${localDate()}.pdf`);
}