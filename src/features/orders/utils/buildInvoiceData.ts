import type { Order } from "../types/order";
import type { InvoiceData } from "./generateInvoice";

/** One place that turns an order into invoice data (used by every download button). */
export function buildInvoiceData(order: Order): InvoiceData {
  const a = order.shippingAddress;

  const hasTaxInvoice =
    order.tax?.applied === true &&
    typeof order.invoiceNumber === "string" &&
    order.invoiceNumber !== "";

  return {
    orderId: order.orderNumber,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: a.phoneNumber,
    customerAddress: [
      a.addressLine1,
      a.addressLine2,
      a.city,
      `${a.state} ${a.postalCode}`,
    ]
      .filter(Boolean)
      .join(", "),
    paymentMethod: order.paymentMethod.toUpperCase(),
    paymentStatus: order.paymentStatus,
    paymentMethodType: (order as { paymentMethodType?: string }).paymentMethodType,
    orderDate: order.createdAt.toDate().toLocaleString(),
    items: order.items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    })),
    subtotal: order.subtotal,
    shippingCharge: order.shippingCharge,
    discount: order.discount ?? 0,
    total: order.totalAmount,
    ...(hasTaxInvoice && order.tax?.applied
      ? {
        invoiceNumber: order.invoiceNumber,
        invoiceDate: (order.invoiceDate ?? order.createdAt)
          .toDate()
          .toLocaleDateString("en-IN"),
        tax: order.tax,
      }
      : {}),
  };
}