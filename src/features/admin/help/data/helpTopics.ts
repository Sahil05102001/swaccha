export interface HelpTopic {
  id: string;
  title: string;
  category: string;
  /** One or two sentences. */
  summary: string;
  /** Optional numbered steps. */
  steps?: string[];
  /** Unlisted YouTube link. Leave empty until the video is ready. */
  videoUrl?: string;
  /** Optional admin page this topic is about, e.g. "/admin/orders". */
  adminPath?: string;
}

/**
 * To add a topic, copy one block, change the id and text, and paste the
 * unlisted YouTube link into videoUrl. Newest topics can go at the top.
 */
export const HELP_TOPICS: HelpTopic[] = [
  {
    id: "add-product",
    title: "How to add a new product",
    category: "Products",
    summary:
      "Create a product with its name, price, stock and pictures so customers can buy it.",
    steps: [
      "Open Products and click Add product.",
      "Fill in the name, category, price and starting stock.",
      "Upload clear pictures, then save.",
    ],
    videoUrl: "",
    adminPath: "/admin/products",
  },
  {
    id: "update-stock",
    title: "How to update stock",
    category: "Inventory",
    summary:
      "Add or remove stock and keep a record of why, so the numbers always match the shelf.",
    steps: [
      "Open Stock History and click Update stock.",
      "Pick the product, choose add or deduct, and enter the quantity.",
      "Write a short reason and save.",
    ],
    videoUrl: "",
    adminPath: "/admin/stock-history",
  },
  {
    id: "process-order",
    title: "How to process an order",
    category: "Orders",
    summary:
      "Move an order from new to delivered and add the delivery details customers need.",
    steps: [
      "Open Orders and click View on the order.",
      "Change the status step by step: confirmed, packed, shipped, delivered.",
      "When shipping, enter the tracking or delivery person details and save.",
    ],
    videoUrl: "",
    adminPath: "/admin/orders",
  },
  {
    id: "cancel-refund",
    title: "How to cancel an order or give a refund",
    category: "Orders",
    summary:
      "Cancel an order or refund a customer from inside the order, so stock and invoices stay correct.",
    steps: [
      "Open the order from Orders.",
      "Use the cancel or refund section in the order details.",
      "Wait for the status to update before trying again. Never refund twice.",
    ],
    videoUrl: "",
    adminPath: "/admin/orders",
  },
  {
    id: "locked-orders",
    title: "Why can't I edit a delivered order?",
    category: "Orders",
    summary:
      "Delivery details are locked once an order is delivered, cancelled or refunded, to protect the record. Notes can still be edited.",
    videoUrl: "",
    adminPath: "/admin/orders",
  },
  {
    id: "coupons",
    title: "How to create a coupon",
    category: "Marketing",
    summary:
      "Make a discount code, set how much it gives and when it stops working.",
    videoUrl: "",
    adminPath: "/admin/coupons",
  },
  {
    id: "banners",
    title: "How to change homepage banners and pictures",
    category: "Storefront",
    summary:
      "Replace hero banners and other homepage images. Use the recommended size shown on each page and keep files small.",
    videoUrl: "",
    adminPath: "/admin/hero-banners",
  },
  {
    id: "sales-report",
    title: "How to download the sales report",
    category: "Reports",
    summary:
      "Choose a date range and download the sales as Excel or PDF. If a range has more than 2,000 orders, pick a shorter range.",
    videoUrl: "",
    adminPath: "/admin/reports/sales",
  },
  {
    id: "inventory-report",
    title: "How to check low stock",
    category: "Reports",
    summary:
      "The inventory report shows what is in stock, low and out of stock, with the value of your stock.",
    videoUrl: "",
    adminPath: "/admin/reports/inventory",
  },
  {
    id: "policies",
    title: "How to edit policies with headings and links",
    category: "Content",
    summary:
      "Edit Privacy, Terms, Shipping, Cancellation, Offer and Replacement policies. Use the toolbar to add bold headings, bullet points and links, then check Preview.",
    videoUrl: "",
    adminPath: "/admin/cms/privacy",
  },
  {
    id: "maintenance",
    title: "How to turn on maintenance mode",
    category: "Store",
    summary:
      "Close the store while you make changes. Customers see a page with the reason and when you'll be back.",
    steps: [
      "Open Maintenance Mode and fill in the title, reason and expected time.",
      "Check Preview, then click Turn on maintenance mode.",
      "When you're done, click Reopen the store.",
    ],
    videoUrl: "",
    adminPath: "/admin/maintenance",
  },
  {
    id: "gst",
    title: "How GST is handled",
    category: "Tax",
    summary:
      "GST rates are set in Tax (GST). Please confirm any change with your accountant before saving.",
    videoUrl: "",
    adminPath: "/admin/tax",
  },
];