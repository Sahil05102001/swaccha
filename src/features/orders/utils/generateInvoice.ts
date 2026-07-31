import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

export function generateInvoice(invoice: InvoiceData): void {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(22);
  doc.text("Swachha", 14, 18);

  doc.setFontSize(11);
  doc.text("Invoice", 14, 26);

  // Order Details
  doc.setFontSize(10);

  doc.text(`Order ID: ${invoice.orderId}`, 14, 38);
  doc.text(`Order Date: ${invoice.orderDate}`, 14, 44);

  doc.text(
    `Payment Method: ${invoice.paymentMethod}`,
    14,
    50,
  );

  doc.text(
    `Payment Status: ${invoice.paymentStatus}`,
    14,
    56,
  );

  // Customer
  doc.setFontSize(12);
  doc.text("Customer", 14, 70);

  doc.setFontSize(10);

  doc.text(invoice.customerName, 14, 76);
  doc.text(invoice.customerEmail, 14, 82);

  if (invoice.customerPhone) {
    doc.text(invoice.customerPhone, 14, 88);
  }

  // Products
  autoTable(doc, {
    startY: 100,
    head: [["Product", "Qty", "Price", "Total"]],
    body: invoice.items.map((item) => [
      item.name,
      item.quantity,
      `₹${item.price.toFixed(2)}`,
      `₹${(item.price * item.quantity).toFixed(2)}`,
    ]),
  });

  const finalY =
    (doc as jsPDF & {
      lastAutoTable?: {
        finalY: number;
      };
    }).lastAutoTable?.finalY ?? 120;

  doc.setFontSize(11);

  doc.text(
    `Subtotal: ₹${invoice.subtotal.toFixed(2)}`,
    140,
    finalY + 12,
  );

  doc.text(
    `Shipping: ₹${(invoice.shippingCharge ?? 0).toFixed(
      2,
    )}`,
    140,
    finalY + 20,
  );

  doc.text(
    `Discount: ₹${(invoice.discount ?? 0).toFixed(2)}`,
    140,
    finalY + 28,
  );

  doc.setFontSize(13);

  doc.text(
    `Grand Total: ₹${invoice.total.toFixed(2)}`,
    140,
    finalY + 40,
  );

  doc.setFontSize(10);

  doc.text(
    "Thank you for shopping with Swachha!",
    14,
    finalY + 60,
  );

  doc.save(`Invoice-${invoice.orderId}.pdf`);
}