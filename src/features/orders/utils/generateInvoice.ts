import type { OrderTax } from "@/features/tax/types/tax";
import { stateWithCode } from "@/features/tax/utils/stateCodes";

import { amountInWords } from "./amountInWords";
import { loadSellerProfile, type SellerProfile } from "./loadSellerProfile";
import { loadSignatureImage } from "./loadSignatureImage";
import {
  drawBlock,
  drawDocumentTitle,
  drawFooters,
  drawMeta,
  drawNote,
  drawRule,
  drawSignature,
  drawTotals,
  drawWords,
  ensureSpace,
  inr,
  lastTableY,
  paymentLabel,
  rs,
  tableOptions,
  type AutoTable,
  type PdfDoc,
} from "./pdfLayout";

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
  customerAddress?: string;
  paymentMethod: string;
  paymentStatus: string;
  paymentMethodType?: string;
  orderDate: string;
  items: InvoiceItem[];
  subtotal: number;
  shippingCharge?: number;
  discount?: number;
  total: number;

  // Present only for GST orders that have been dispatched.
  invoiceNumber?: string;
  invoiceDate?: string;
  tax?: OrderTax;
}

const toPaise = (rupees: number) => Math.round(rupees * 100);

function drawBuyer(
  doc: PdfDoc,
  y: number,
  invoice: InvoiceData,
  caption: string,
  meta: [string, string][],
): number {
  const left = drawBlock(doc, y, 90, caption, [
    { text: invoice.customerName, bold: true, size: 10.5 },
    { text: invoice.customerAddress ?? "" },
    {
      text: invoice.customerPhone ? `Phone: ${invoice.customerPhone}` : "",
    },
  ]);
  const right = drawMeta(doc, y + 0.5, meta);

  return Math.max(left, right);
}

/** A GST tax invoice. */
function drawTaxInvoice(
  doc: PdfDoc,
  autoTable: AutoTable,
  invoice: InvoiceData,
  tax: Extract<OrderTax, { applied: true }>,
  seller: SellerProfile | null,
) {
  let y = drawDocumentTitle(doc, "TAX INVOICE");

  // Supplier (left) and invoice numbers (right)
  const sellerEnd = drawBlock(doc, y, 90, "Sold by", [
    { text: tax.legalName, bold: true, size: 11 },
    { text: tax.address },
    { text: `GSTIN: ${tax.gstin}`, bold: true },
    { text: `State: ${stateWithCode(tax.sellerState)}` },
    { text: seller?.contact ?? "", muted: true },
  ]);
  const metaEnd = drawMeta(doc, y + 0.5, [
    ["Invoice no.", invoice.invoiceNumber ?? ""],
    ["Invoice date", invoice.invoiceDate ?? ""],
    ["Order no.", invoice.orderId],
    ["Order date", invoice.orderDate],
  ]);

  y = Math.max(sellerEnd, metaEnd) + 1;
  drawRule(doc, y);
  y += 6;

  // Recipient (left) and place of supply (right)
  const payment = paymentLabel(
    invoice.paymentMethod,
    invoice.paymentStatus,
    invoice.paymentMethodType,
  );

  y =
    drawBuyer(doc, y, invoice, "Billed to / delivered to", [
      ["Place of supply", stateWithCode(tax.placeOfSupply)],
      ["Reverse charge", "No"],
      ["Payment method", payment.mode],
      ...(payment.type ? [["Payment type", payment.type] as [string, string]] : []),
      ["Payment status", payment.status],
    ]) + 1;

  drawRule(doc, y);
  y += 5;

  // Items
  const intra = tax.intraState;
  const rows = tax.shipping ? [...tax.lines, tax.shipping] : tax.lines;

  const head = intra
    ? ["#", "Description", "HSN", "Qty", "GST", "Taxable value", "CGST", "SGST", "Total"]
    : ["#", "Description", "HSN", "Qty", "GST", "Taxable value", "IGST", "Total"];

  const body = rows.map((line, index) => {
    const base = [
      String(index + 1),
      line.name,
      line.hsnCode || "-",
      String(line.quantity),
      `${line.ratePercent}%`,
      inr(line.taxablePaise),
    ];

    return intra
      ? [...base, inr(line.cgstPaise), inr(line.sgstPaise), inr(line.grossPaise)]
      : [...base, inr(line.igstPaise), inr(line.grossPaise)];
  });

  autoTable(doc, {
    ...tableOptions(
      y,
      intra
        ? { 0: "center", 1: "left", 2: "left", 3: "center", 4: "right", 5: "right", 6: "right", 7: "right", 8: "right" }
        : { 0: "center", 1: "left", 2: "left", 3: "center", 4: "right", 5: "right", 6: "right", 7: "right" },
      intra
        ? { 0: 8, 2: 17, 3: 10, 4: 12, 5: 22, 6: 20, 7: 20, 8: 24 }
        : { 0: 8, 2: 17, 3: 10, 4: 12, 5: 24, 6: 24, 7: 26 },
    ),
    head: [head],
    body,
  });

  y = lastTableY(doc, y) + 6;
  y = ensureSpace(doc, y, 44);

  // Amount in words (left) level with the totals (right)
  const totalPaise = toPaise(invoice.total);

  const wordsEnd = drawWords(doc, y, amountInWords(totalPaise));
  const totalsEnd = drawTotals(doc, y, [
    { label: "Taxable value", value: rs(tax.taxablePaise) },
    ...(intra
      ? [
        { label: "CGST", value: rs(tax.cgstPaise) },
        { label: "SGST", value: rs(tax.sgstPaise) },
      ]
      : [{ label: "IGST", value: rs(tax.igstPaise) }]),
    { label: "Invoice total", value: rs(totalPaise), strong: true },
  ]);

  y = Math.max(wordsEnd, totalsEnd) + 2;

  const discount = toPaise(invoice.discount ?? 0);
  y = drawNote(
    doc,
    y,
    discount > 0
      ? `Prices are inclusive of GST. A discount of ${rs(discount)} is already taken off the amounts above.`
      : "Prices are inclusive of GST.",
  );

  drawSignature(doc, y + 2, tax.legalName, seller);
  drawFooters(doc, "This is a computer-generated tax invoice.");
}

/** A plain invoice, used while GST is off. */
function drawPlainInvoice(
  doc: PdfDoc,
  autoTable: AutoTable,
  invoice: InvoiceData,
  seller: SellerProfile | null,
) {
  let y = drawDocumentTitle(doc, "INVOICE");

  const sellerEnd = drawBlock(doc, y, 90, "From", [
    { text: seller?.name ?? "Swachha", bold: true, size: 11 },
    ...(seller?.addressLines ?? []).map((text) => ({ text })),
    { text: seller?.contact ?? "", muted: true },
  ]);
  const metaEnd = drawMeta(doc, y + 0.5, [
    ["Bill no.", invoice.orderId],
    ["Date", invoice.orderDate],
  ]);

  y = Math.max(sellerEnd, metaEnd) + 1;
  drawRule(doc, y);
  y += 6;

  const payment = paymentLabel(
    invoice.paymentMethod,
    invoice.paymentStatus,
    invoice.paymentMethodType,
  );

  y =
    drawBuyer(doc, y, invoice, "Billed to / delivered to", [
      ["Payment method", payment.mode],
      ...(payment.type ? [["Payment type", payment.type] as [string, string]] : []),
      ["Payment status", payment.status],
    ]) + 1;

  drawRule(doc, y);
  y += 5;

  autoTable(doc, {
    ...tableOptions(
      y,
      { 0: "center", 1: "left", 2: "center", 3: "right", 4: "right" },
      { 0: 10, 2: 16, 3: 30, 4: 32 },
    ),
    head: [["#", "Item", "Qty", "Unit price", "Amount"]],
    body: invoice.items.map((item, index) => [
      String(index + 1),
      item.name,
      String(item.quantity),
      inr(toPaise(item.price)),
      inr(toPaise(item.price) * item.quantity),
    ]),
  });

  y = lastTableY(doc, y) + 6;
  y = ensureSpace(doc, y, 44);

  const shipping = toPaise(invoice.shippingCharge ?? 0);
  const discount = toPaise(invoice.discount ?? 0);
  const totalPaise = toPaise(invoice.total);

  const wordsEnd = drawWords(doc, y, amountInWords(totalPaise));
  const totalsEnd = drawTotals(doc, y, [
    { label: "Items total", value: rs(toPaise(invoice.subtotal)) },
    { label: "Delivery", value: shipping > 0 ? rs(shipping) : "Free" },
    ...(discount > 0
      ? [{ label: "Discount", value: `- ${rs(discount)}` }]
      : []),
    { label: "Total payable", value: rs(totalPaise), strong: true },
  ]);

  y = Math.max(wordsEnd, totalsEnd) + 2;
  drawNote(
    doc,
    y,
    "This is a computer-generated invoice and is not a tax invoice. No signature is required.",
  );

  drawFooters(doc, seller?.footer || "Thank you for shopping with Swachha!");
}

/** Draws the invoice onto an open document. Separate so it can be tested. */
export function drawInvoice(
  doc: PdfDoc,
  autoTable: AutoTable,
  invoice: InvoiceData,
  seller: SellerProfile | null,
) {
  const tax =
    invoice.tax?.applied === true && invoice.invoiceNumber
      ? invoice.tax
      : null;

  if (tax) drawTaxInvoice(doc, autoTable, invoice, tax, seller);
  else drawPlainInvoice(doc, autoTable, invoice, seller);
}

export async function generateInvoice(invoice: InvoiceData): Promise<void> {
  // Loaded only when someone downloads an invoice.
  const [{ default: jsPDF }, { default: autoTable }, seller] =
    await Promise.all([
      import("jspdf"),
      import("jspdf-autotable"),
      loadSellerProfile(),
    ]);

  // Only tax invoices carry a signature.
  if (seller?.signatureUrl && invoice.tax?.applied === true && invoice.invoiceNumber) {
    seller.signature = await loadSignatureImage(seller.signatureUrl);
  }

  const doc = new jsPDF({ unit: "mm", format: "a4" });

  drawInvoice(doc, autoTable as AutoTable, invoice, seller);

  const isTax = invoice.tax?.applied === true && invoice.invoiceNumber;

  doc.save(
    isTax
      ? `Invoice-${String(invoice.invoiceNumber).replace(/\//g, "-")}.pdf`
      : `Invoice-${invoice.orderId}.pdf`,
  );
}