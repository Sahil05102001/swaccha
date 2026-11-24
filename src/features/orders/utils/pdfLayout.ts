import type jsPDFType from "jspdf";
import type { UserOptions } from "jspdf-autotable";

export type PdfDoc = jsPDFType;
export type AutoTable = (doc: PdfDoc, options: UserOptions) => void;
export type RGB = [number, number, number];

export interface SignatureImage {
  dataUrl: string;
  width: number;
  height: number;
}

export interface SignerInfo {
  signature?: SignatureImage | null;
  signerName?: string;
}

export const INK: RGB = [24, 24, 27];
export const TEXT: RGB = [55, 65, 81];
export const MUTED: RGB = [107, 114, 128];
export const LINE: RGB = [209, 213, 219];
export const SOFT: RGB = [243, 244, 246];

// A4, in millimetres.
export const MARGIN = 15;
export const PAGE_WIDTH = 210;
export const PAGE_HEIGHT = 297;
export const RIGHT = PAGE_WIDTH - MARGIN;
// Content must end above the footer.
export const BOTTOM = PAGE_HEIGHT - 24;
// Where the right-hand column (invoice numbers, dates...) starts.
export const META_X = 112;

// jsPDF's built-in fonts cannot draw the rupee sign, so "Rs." is used.
export const inr = (paise: number) =>
    (paise / 100).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

export const rs = (paise: number) => `Rs. ${inr(paise)}`;

const PAYMENT_TYPES: Record<string, string> = {
    upi: "UPI",
    card: "Card",
    netbanking: "Net banking",
    wallet: "Wallet",
    emi: "EMI",
    paylater: "Pay later",
    other: "Other",
};

export function paymentLabel(method: string, status: string, type?: string) {
    const m = method.toLowerCase();

    const mode =
        m === "cod"
            ? "Cash on delivery"
            : m === "razorpay" || m === "upi"
                ? "Online payment"
                : method;

    const states: Record<string, string> = {
        paid: "Paid",
        pending: "Pending",
        failed: "Failed",
        refunded: "Refunded",
        partially_refunded: "Partly refunded",
    };

    const key = (type ?? "").toLowerCase();

    return {
        mode,
        type: type ? (PAYMENT_TYPES[key] ?? type) : "",
        status: states[status] ?? status,
    };
}

export function setText(
    doc: PdfDoc,
    size: number,
    style: "normal" | "bold",
    color: RGB,
) {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    doc.setTextColor(...color);
}

/** Centred document title with a rule under it. Returns the next y. */
export function drawDocumentTitle(doc: PdfDoc, title: string): number {
    setText(doc, 16, "bold", INK);
    doc.text(title, PAGE_WIDTH / 2, 19, { align: "center" });

    doc.setDrawColor(...INK);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, 24, RIGHT, 24);

    return 32;
}

export function drawRule(doc: PdfDoc, y: number) {
    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, y, RIGHT, y);
}

export interface TextLine {
    text: string;
    bold?: boolean;
    muted?: boolean;
    size?: number;
}

/** A small caption followed by wrapped lines. Returns the y below it. */
export function drawBlock(
    doc: PdfDoc,
    y: number,
    width: number,
    caption: string,
    lines: TextLine[],
): number {
    setText(doc, 7.5, "bold", MUTED);
    doc.text(caption.toUpperCase(), MARGIN, y);

    let cursor = y + 5;

    for (const line of lines) {
        if (!line.text) continue;

        const size = line.size ?? 9;
        setText(
            doc,
            size,
            line.bold ? "bold" : "normal",
            line.bold ? INK : line.muted ? MUTED : TEXT,
        );

        const wrapped = doc.splitTextToSize(line.text, width) as string[];
        doc.text(wrapped, MARGIN, cursor);
        cursor += wrapped.length * size * 0.41 + 0.9;
    }

    return cursor;
}

/** Label / value pairs in the right-hand column. Returns the y below it. */
export function drawMeta(
    doc: PdfDoc,
    y: number,
    rows: [string, string][],
): number {
    const labelWidth = 32;
    const valueWidth = RIGHT - (META_X + labelWidth) - 1;
    let cursor = y;

    for (const [label, value] of rows) {
        setText(doc, 8.5, "normal", MUTED);
        doc.text(label, META_X, cursor);

        setText(doc, 8.5, "bold", INK);
        const wrapped = doc.splitTextToSize(value || "-", valueWidth) as string[];
        doc.text(wrapped, RIGHT, cursor, { align: "right" });

        cursor += wrapped.length * 3.7 + 1.6;
    }

    return cursor;
}

/** Starts a new page when `needed` mm would not fit. Returns the y to use. */
export function ensureSpace(doc: PdfDoc, y: number, needed: number): number {
    if (y + needed <= BOTTOM) return y;

    doc.addPage();
    return MARGIN + 6;
}

export interface TotalRow {
    label: string;
    value: string;
    strong?: boolean;
}

/** Right-aligned totals. Returns the y below them. */
export function drawTotals(doc: PdfDoc, y: number, rows: TotalRow[]): number {
    const left = RIGHT - 78;
    let cursor = y;

    for (const row of rows) {
        if (row.strong) {
            cursor += 1;
            doc.setDrawColor(...INK);
            doc.setLineWidth(0.4);
            doc.line(left, cursor, RIGHT, cursor);
            cursor += 6;

            setText(doc, 11, "bold", INK);
            doc.text(row.label, left, cursor);
            doc.text(row.value, RIGHT, cursor, { align: "right" });
            cursor += 4;
        } else {
            setText(doc, 9, "normal", MUTED);
            doc.text(row.label, left, cursor);

            setText(doc, 9, "normal", INK);
            doc.text(row.value, RIGHT, cursor, { align: "right" });
            cursor += 6;
        }
    }

    return cursor;
}

/** "Amount in words" on the left, level with the totals. Returns the y below. */
export function drawWords(doc: PdfDoc, y: number, words: string): number {
    setText(doc, 7.5, "bold", MUTED);
    doc.text("AMOUNT IN WORDS", MARGIN, y);

    setText(doc, 8.5, "bold", INK);
    const wrapped = doc.splitTextToSize(words, 90) as string[];
    doc.text(wrapped, MARGIN, y + 5);

    return y + 5 + wrapped.length * 3.7;
}

/** Supplier's signature block. Returns the y below it. */
export function drawSignature(
    doc: PdfDoc,
    y: number,
    name: string,
    signer?: SignerInfo | null,
): number {
    const signerName = signer?.signerName?.trim() ?? "";
    const top = ensureSpace(doc, y, signerName ? 34 : 30);

    setText(doc, 9, "bold", INK);
    doc.text(`For ${name}`, RIGHT, top, { align: "right" });

    const lineY = top + 16;
    const image = signer?.signature;

    // The signature sits just above the line, right-aligned.
    if (image) {
        const scale = Math.min(44 / image.width, 12 / image.height);
        const width = image.width * scale;
        const height = image.height * scale;

        try {
            doc.addImage(image.dataUrl, "PNG", RIGHT - width, lineY - 1 - height, width, height);
        } catch {
            // An unreadable image must never stop the invoice.
        }
    }

    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.3);
    doc.line(RIGHT - 58, lineY, RIGHT, lineY);

    setText(doc, 8, "normal", MUTED);
    doc.text("Authorised signatory", RIGHT, top + 20.5, { align: "right" });

    if (signerName) {
        setText(doc, 8, "bold", INK);
        doc.text(signerName, RIGHT, top + 25, { align: "right" });
        return top + 28;
    }

    return top + 24;
}

/** A short note in small grey text. Returns the y below it. */
export function drawNote(doc: PdfDoc, y: number, text: string): number {
    setText(doc, 8, "normal", MUTED);
    const wrapped = doc.splitTextToSize(text, RIGHT - MARGIN) as string[];
    doc.text(wrapped, MARGIN, y);

    return y + wrapped.length * 3.4 + 1;
}

/** Footer on every page. Call once, after everything else is drawn. */
export function drawFooters(doc: PdfDoc, text: string) {
    const pages = doc.getNumberOfPages();

    for (let page = 1; page <= pages; page += 1) {
        doc.setPage(page);

        doc.setDrawColor(...LINE);
        doc.setLineWidth(0.2);
        doc.line(MARGIN, PAGE_HEIGHT - 16, RIGHT, PAGE_HEIGHT - 16);

        setText(doc, 8, "normal", MUTED);
        doc.text(text, MARGIN, PAGE_HEIGHT - 10);

        if (pages > 1) {
            doc.text(`Page ${page} of ${pages}`, RIGHT, PAGE_HEIGHT - 10, {
                align: "right",
            });
        }
    }
}

export function lastTableY(doc: PdfDoc, fallback: number): number {
    return (
        (doc as PdfDoc & { lastAutoTable?: { finalY: number } }).lastAutoTable
            ?.finalY ?? fallback
    );
}

type Align = "left" | "center" | "right";

/** Shared table look. `align` maps a column index to its alignment. */
export function tableOptions(
    startY: number,
    align: Record<number, Align>,
    widths: Record<number, number>,
): Partial<UserOptions> {
    const columnStyles: Record<number, { halign: Align; cellWidth?: number }> =
        {};

    for (const key of Object.keys(align)) {
        const index = Number(key);
        columnStyles[index] = {
            halign: align[index],
            ...(widths[index] !== undefined ? { cellWidth: widths[index] } : {}),
        };
    }

    return {
        startY,
        margin: { left: MARGIN, right: MARGIN, top: MARGIN + 6, bottom: 26 },
        theme: "grid",
        styles: {
            font: "helvetica",
            fontSize: 8.5,
            textColor: TEXT,
            cellPadding: { top: 2.4, bottom: 2.4, left: 2, right: 2 },
            lineColor: LINE,
            lineWidth: 0.15,
            overflow: "linebreak",
            valign: "middle",
        },
        headStyles: {
            fillColor: SOFT,
            textColor: INK,
            fontStyle: "bold",
            fontSize: 8,
        },
        columnStyles,
        didParseCell: (data) => {
            const column = align[data.column.index];
            if (column) data.cell.styles.halign = column;
        },
    };
}