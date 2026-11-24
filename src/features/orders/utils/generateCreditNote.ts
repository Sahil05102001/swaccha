import { stateWithCode } from "@/features/tax/utils/stateCodes";

import type { Order, OrderRefund } from "../types/order";
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
  rs,
  tableOptions,
  type AutoTable,
  type PdfDoc,
} from "./pdfLayout";

/** Draws the credit note onto an open document. Separate so it can be tested. */
export function drawCreditNote(
  doc: PdfDoc,
  autoTable: AutoTable,
  order: Order,
  refund: OrderRefund,
  seller: SellerProfile | null,
) {
  const tax = order.tax;
  const note = refund.creditNote;

  if (!tax || tax.applied !== true || !note) {
    throw new Error("This refund has no credit note.");
  }

  let y = drawDocumentTitle(doc, "CREDIT NOTE");

  // Supplier (left) and credit note numbers (right)
  const sellerEnd = drawBlock(doc, y, 90, "Issued by", [
    { text: tax.legalName, bold: true, size: 11 },
    { text: tax.address },
    { text: `GSTIN: ${tax.gstin}`, bold: true },
    { text: `State: ${stateWithCode(tax.sellerState)}` },
    { text: seller?.contact ?? "", muted: true },
  ]);
  const metaEnd = drawMeta(doc, y + 0.5, [
    ["Credit note no.", note.number],
    ["Credit note date", note.issuedAt.toDate().toLocaleDateString("en-IN")],
    ["Original invoice no.", order.invoiceNumber ?? "-"],
    [
      "Original invoice date",
      (order.invoiceDate ?? order.createdAt).toDate().toLocaleDateString("en-IN"),
    ],
    ["Order no.", order.orderNumber],
  ]);

  y = Math.max(sellerEnd, metaEnd) + 1;
  drawRule(doc, y);
  y += 6;

  // Recipient (left) and place of supply and reason (right)
  const a = order.shippingAddress;

  const recipientEnd = drawBlock(doc, y, 90, "Credited to", [
    { text: order.customerName, bold: true, size: 10.5 },
    {
      text: [a.addressLine1, a.addressLine2, a.city, `${a.state} ${a.postalCode}`]
        .filter(Boolean)
        .join(", "),
    },
    { text: `State: ${stateWithCode(a.state)}` },
  ]);
  const detailEnd = drawMeta(doc, y + 0.5, [
    ["Place of supply", stateWithCode(tax.placeOfSupply)],
    ["Reason", refund.reason || "Refund"],
  ]);

  y = Math.max(recipientEnd, detailEnd) + 1;
  drawRule(doc, y);
  y += 5;

  // One row per GST rate
  const intra = tax.intraState;
  const lines = note.lines ?? [];

  const head = intra
    ? ["#", "Description", "GST", "Taxable value", "CGST", "SGST", "Total"]
    : ["#", "Description", "GST", "Taxable value", "IGST", "Total"];

  const body = lines.map((line, index) => {
    const base = [
      String(index + 1),
      `Refund against invoice ${order.invoiceNumber ?? ""}`,
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
        ? { 0: "center", 1: "left", 2: "right", 3: "right", 4: "right", 5: "right", 6: "right" }
        : { 0: "center", 1: "left", 2: "right", 3: "right", 4: "right", 5: "right" },
      intra
        ? { 0: 8, 2: 14, 3: 28, 4: 22, 5: 22, 6: 26 }
        : { 0: 8, 2: 14, 3: 30, 4: 28, 5: 30 },
    ),
    head: [head],
    body,
  });

  y = lastTableY(doc, y) + 6;
  y = ensureSpace(doc, y, 44);

  const sum = (pick: (l: (typeof lines)[number]) => number) =>
    lines.reduce((total, l) => total + pick(l), 0);

  const totalPaise = sum((l) => l.grossPaise);

  const wordsEnd = drawWords(doc, y, amountInWords(totalPaise));
  const totalsEnd = drawTotals(doc, y, [
    { label: "Taxable value", value: rs(sum((l) => l.taxablePaise)) },
    ...(intra
      ? [
          { label: "CGST", value: rs(sum((l) => l.cgstPaise)) },
          { label: "SGST", value: rs(sum((l) => l.sgstPaise)) },
        ]
      : [{ label: "IGST", value: rs(sum((l) => l.igstPaise)) }]),
    { label: "Total credited", value: rs(totalPaise), strong: true },
  ]);

  y = Math.max(wordsEnd, totalsEnd) + 2;
  y = drawNote(
    doc,
    y,
    "This credit note reduces the value and tax of the tax invoice named above.",
  );

  drawSignature(doc, y + 2, tax.legalName, seller);
  drawFooters(doc, "This is a computer-generated credit note.");
}

/** Credit note for one accepted refund on a GST order. */
export async function generateCreditNote(
  order: Order,
  refund: OrderRefund,
): Promise<void> {
  if (!refund.creditNote) throw new Error("This refund has no credit note.");

  const [{ default: jsPDF }, { default: autoTable }, seller] =
    await Promise.all([
      import("jspdf"),
      import("jspdf-autotable"),
      loadSellerProfile(),
    ]);

  if (seller?.signatureUrl) {
    seller.signature = await loadSignatureImage(seller.signatureUrl);
  }

  const doc = new jsPDF({ unit: "mm", format: "a4" });

  drawCreditNote(doc, autoTable as AutoTable, order, refund, seller);

  doc.save(`Credit-note-${refund.creditNote.number.replace(/\//g, "-")}.pdf`);
}