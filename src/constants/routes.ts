export const ROUTES = {
  HOME: "/",

  PRODUCTS: "/products",
  PRODUCT_DETAILS: "/products/:productId",

  CART: "/cart",
  WISHLIST: "/wishlist",

  CHECKOUT: "/checkout",
  PAYMENT: "/payment",

  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",

  PROFILE: "/profile",

  ABOUT: "/about",
  CONTACT: "/contact",
  FAQ: "/faq",

  ADMIN: "/admin",
  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_ORDERS: "/admin/orders",
  ADMIN_CUSTOMERS: "/admin/customers",
  ADMIN_INVENTORY: "/admin/inventory",
  ADMIN_SETTINGS: "/admin/settings",
} as const;