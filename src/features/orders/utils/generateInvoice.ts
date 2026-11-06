import type jsPDFType from "jspdf";

export interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
}

export interface InvoiceData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  paymentMethod: string;
  paymentStatus: string;
  orderDate: string;
  items: InvoiceItem[];
  subtotal: number;
  shippingCharge?: number;
  discount?: number;
  total: number;
}

type RGB = [number, number, number];

// Swachha palette
const BLUE: RGB = [0, 217, 255];
const BLACK: RGB = [0, 0, 0];
const DARK: RGB = [33, 33, 33];
const MUTED: RGB = [117, 117, 117];
const BORDER: RGB = [224, 224, 224];

const MARGIN = 16;

// jsPDF's default fonts can't render the ₹ glyph, so "Rs." is used
const money = (value: number) =>
  `Rs.${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export async function generateInvoice(invoice: InvoiceData): Promise<void> {
  // Loaded only when someone downloads an invoice.
  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const rightX = pageWidth - MARGIN;

  /* ---------- Header ---------- */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(...BLACK);
  doc.text("Swachha", MARGIN, 22);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...MUTED);
  doc.text("INVOICE", rightX, 22, { align: "right" });

  // Hairline divider with a short electric-blue accent
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, 29, rightX, 29);
  doc.setFillColor(...BLUE);
  doc.rect(MARGIN, 28.5, 24, 1, "F");

  /* ---------- Billed to (left) ---------- */
  let leftY = 42;

  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text("BILLED TO", MARGIN, leftY);

  leftY += 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...DARK);
  const nameLines = doc.splitTextToSize(invoice.customerName, 85) as string[];
  doc.text(nameLines, MARGIN, leftY);
  leftY += nameLines.length * 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...MUTED);

  const emailLines = doc.splitTextToSize(invoice.customerEmail, 85) as string[];
  doc.text(emailLines, MARGIN, leftY);
  leftY += emailLines.length * 5;

  if (invoice.customerPhone) {
    doc.text(invoice.customerPhone, MARGIN, leftY);
    leftY += 5;
  }

  /* ---------- Order details (right) ---------- */
  const labelX = 118;
  const details: [string, string][] = [
    ["Order ID", invoice.orderId],
    ["Order date", invoice.orderDate],
    ["Payment method", invoice.paymentMethod],
    ["Payment status", invoice.paymentStatus],
  ];

  let rightY = 42;
  doc.setFontSize(10);
  details.forEach(([label, value]) => {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MUTED);
    doc.text(label, labelX, rightY);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...DARK);
    doc.text(value, rightX, rightY, { align: "right" });

    rightY += 6.5;
  });

  /* ---------- Items table ---------- */
  const tableStartY = Math.max(leftY, rightY) + 10;

  autoTable(doc, {
    startY: tableStartY,
    margin: { left: MARGIN, right: MARGIN, bottom: 24 },
    theme: "plain",
    head: [["Product", "Qty", "Price", "Total"]],
    body: invoice.items.map((item) => [
      item.name,
      String(item.quantity),
      money(item.price),
      money(item.price * item.quantity),
    ]),
    styles: {
      font: "helvetica",
      fontSize: 10,
      textColor: DARK,
      cellPadding: { top: 3.5, bottom: 3.5, left: 3, right: 3 },
      lineColor: BORDER,
      lineWidth: 0.1,
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: BLACK,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
      lineColor: BLACK,
    },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { cellWidth: 16, halign: "center" },
      2: { cellWidth: 32, halign: "right" },
      3: { cellWidth: 32, halign: "right" },
    },
    didParseCell: (data) => {
      // Align header labels with their columns
      if (data.section === "head") {
        if (data.column.index === 1) data.cell.styles.halign = "center";
        if (data.column.index >= 2) data.cell.styles.halign = "right";
      }
    },
  });

  const finalY =
    (doc as jsPDFType & { lastAutoTable?: { finalY: number } }).lastAutoTable
      ?.finalY ?? tableStartY;

  /* ---------- Totals ---------- */
  const totalsHeight = 48;
  let y = finalY + 12;

  if (y + totalsHeight > pageHeight - 24) {
    doc.addPage();
    y = 24;
  }

  const totalsLabelX = rightX - 70;
  const discount = invoice.discount ?? 0;

  const rows: [string, string][] = [
    ["Subtotal", money(invoice.subtotal)],
    ["Shipping", money(invoice.shippingCharge ?? 0)],
    ["Discount", discount > 0 ? `- ${money(discount)}` : money(0)],
  ];

  doc.setFontSize(10);
  rows.forEach(([label, value]) => {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MUTED);
    doc.text(label, totalsLabelX, y);

    doc.setTextColor(...DARK);
    doc.text(value, rightX, y, { align: "right" });

    y += 7;
  });

  y += 1;
  doc.setDrawColor(...BLACK);
  doc.setLineWidth(0.4);
  doc.line(totalsLabelX, y, rightX, y);

  y += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...BLACK);
  doc.text("Grand total", totalsLabelX, y);
  doc.text(money(invoice.total), rightX, y, { align: "right" });

  // Small blue accent under the grand total
  doc.setFillColor(...BLUE);
  doc.rect(rightX - 24, y + 3, 24, 1, "F");

  /* ---------- Footer (every page) ---------- */
  const pageCount = doc.getNumberOfPages();
  for (let page = 1; page <= pageCount; page++) {
    doc.setPage(page);

    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, pageHeight - 18, rightX, pageHeight - 18);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...MUTED);
    doc.text("Thank you for shopping with Swachha!", MARGIN, pageHeight - 11);

    if (pageCount > 1) {
      doc.text(`Page ${page} of ${pageCount}`, rightX, pageHeight - 11, {
        align: "right",
      });
    }
  }

  doc.save(`Invoice-${invoice.orderId}.pdf`);
}
