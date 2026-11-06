import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import CustomerLayout from "@/layouts/CustomerLayout";

import HomePage from "@/features/home/pages/HomePage";
import ProductsPage from "@/features/products/pages/ProductsPage";
import ProductDetailsPage from "@/features/products/pages/ProductDetailsPage";
import CartPage from "@/features/cart/pages/CartPage";
import WishlistPage from "@/features/wishlist/pages/WishlistPage";

import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import AdminProtectedRoute from "@/features/auth/components/AdminProtectedRoute";

import ProfilePage from "@/features/profile/pages/ProfilePage";

import CheckoutPage from "@/features/orders/pages/CheckoutPage";
import OrderSuccessPage from "@/features/orders/pages/OrderSuccessPage";
import OrdersPage from "@/features/orders/pages/OrdersPage";
import OrderDetailsPage from "@/features/orders/pages/OrderDetailsPage";
import CustomerOfferZonePage from "@/features/offerzone/pages/CustomerOfferZonePage";

import AboutPage from "@/features/cms/about/pages/AboutPage";
import ContactPage from "@/features/cms/contact/pages/ContactPage";
import PhysicalShopPage from "@/features/store/pages/PhysicalShopPage";
import BulkOrderPage from "@/features/bulkOrder/pages/BulkOrderPage";
import FaqPage from "@/features/cms/faq/pages/FaqPage";
import PolicyPage from "@/features/cms/policy/pages/PolicyPage";

import NotFoundPage from "@/features/customer/pages/NotFoundPage";

// Admin: the layout stays in the main bundle (it is the shell); every page
// below is downloaded only when the admin opens it.
import AdminLayout from "@/features/admin/layouts/AdminLayout";

const AdminDashboardPage = lazy(
  () => import("@/features/admin/pages/AdminDashboardPage"),
);
const AdminSettingsPage = lazy(
  () => import("@/features/admin/pages/AdminSettingsPage"),
);
const AdminProductsPage = lazy(
  () => import("@/features/admin/products/pages/AdminProductsPage"),
);
const CategoriesPage = lazy(
  () => import("@/features/admin/categories/pages/CategoriesPage"),
);
const AdminOrdersPage = lazy(
  () => import("@/features/admin/orders/pages/OrdersPage"),
);
const AdminCustomersPage = lazy(
  () => import("@/features/admin/customers/pages/AdminCustomersPage"),
);
const CustomerDetailsPage = lazy(
  () => import("@/features/admin/customers/pages/CustomerDetailsPage"),
);
const AboutAdminPage = lazy(
  () => import("@/features/cms/about/admin/pages/AboutAdminPage"),
);
const ContactAdminPage = lazy(
  () => import("@/features/cms/contact/admin/pages/ContactAdminPage"),
);
const FaqAdminPage = lazy(
  () => import("@/features/cms/faq/admin/pages/FaqAdminPage"),
);
const PolicyAdminPage = lazy(
  () => import("@/features/cms/policy/pages/PolicyAdminPage"),
);
const SalesReportPage = lazy(() =>
  import("@/features/reports").then((m) => ({ default: m.SalesReportPage })),
);
const InventoryReportPage = lazy(() =>
  import("@/features/inventoryReports").then((m) => ({
    default: m.InventoryReportPage,
  })),
);
const AdminCategoryCirclesPage = lazy(
  () =>
    import("@/features/admin/categoryCircles/pages/AdminCategoryCirclesPage"),
);
const AdminBestSellersPage = lazy(
  () => import("@/features/admin/bestsellers/pages/AdminBestSellersPage"),
);
const AdminAdBannerPage = lazy(
  () => import("@/features/admin/adBanner/pages/AdminAdBannerPage"),
);
const AdminVideosPage = lazy(
  () => import("@/features/admin/videos/pages/AdminVideosPage"),
);
const AdminBrandStatementPage = lazy(
  () => import("@/features/admin/brandStatement/pages/AdminBrandStatementPage"),
);
const AdminFeaturedProductsPage = lazy(
  () =>
    import("@/features/admin/featuredProducts/pages/AdminFeaturedProductsPage"),
);
const OfferZonePage = lazy(
  () => import("@/features/admin/offerzone/components/OfferZonePage"),
);
const HeroBannersPage = lazy(
  () => import("@/features/admin/hero/pages/HeroBannersPage"),
);
const AdminB2BEnquiriesPage = lazy(
  () => import("@/features/admin/pages/AdminB2BEnquiriesPage"),
);
const AdminReviewsPage = lazy(
  () => import("@/features/admin/reviews/pages/AdminReviewsPage"),
);
const AdminCouponsPage = lazy(
  () => import("@/features/admin/coupons/pages/AdminCouponsPage"),
);
const AdminShippingPage = lazy(
  () => import("@/features/admin/shipping/pages/AdminShippingPage"),
);
const AdminStockHistoryPage = lazy(
  () => import("@/features/admin/stock/pages/AdminStockHistoryPage"),
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <CustomerLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "products", element: <ProductsPage /> },
      { path: "products/:id", element: <ProductDetailsPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "wishlist", element: <WishlistPage /> },
      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "our-store", element: <PhysicalShopPage /> },
      { path: "bulk-order", element: <BulkOrderPage /> },
      { path: "offer-zone", element: <CustomerOfferZonePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
      { path: "faq", element: <FaqPage /> },
      {
        path: "privacy-policy",
        element: <PolicyPage documentId="privacy" />,
      },
      {
        path: "terms-and-conditions",
        element: <PolicyPage documentId="terms" />,
      },
      {
        path: "shipping-policy",
        element: <PolicyPage documentId="shipping" />,
      },
      {
        path: "cancellation-refund-policy",
        element: <PolicyPage documentId="cancellation" />,
      },
      {
        path: "offer-terms-and-conditions",
        element: <PolicyPage documentId="offer-terms" />,
      },
      {
        path: "replacement-policy",
        element: <PolicyPage documentId="replacement" />,
      },

      {
        element: <ProtectedRoute />,
        children: [
          { path: "profile", element: <ProfilePage /> },
          { path: "checkout", element: <CheckoutPage /> },
          { path: "orders/success", element: <OrderSuccessPage /> },
          { path: "orders", element: <OrdersPage /> },
          { path: "orders/:id", element: <OrderDetailsPage /> },
        ],
      },
    ],
  },

  {
    element: <AdminProtectedRoute />,
    children: [
      {
        path: "admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: "products", element: <AdminProductsPage /> },
          { path: "categories", element: <CategoriesPage /> },
          { path: "hero-banners", element: <HeroBannersPage /> },
          { path: "best-sellers", element: <AdminBestSellersPage /> },
          { path: "ad-banner", element: <AdminAdBannerPage /> },
          { path: "videos", element: <AdminVideosPage /> },
          { path: "category-circles", element: <AdminCategoryCirclesPage /> },
          { path: "featured-products", element: <AdminFeaturedProductsPage /> },
          { path: "offer-zone", element: <OfferZonePage /> },
          { path: "orders", element: <AdminOrdersPage /> },
          { path: "orders/:id", element: <OrderDetailsPage /> },
          { path: "customers", element: <AdminCustomersPage /> },
          { path: "customers/:uid", element: <CustomerDetailsPage /> },
          { path: "reviews", element: <AdminReviewsPage /> },
          { path: "coupons", element: <AdminCouponsPage /> },
          { path: "shipping", element: <AdminShippingPage /> },
          { path: "stock-history", element: <AdminStockHistoryPage /> },
          { path: "settings", element: <AdminSettingsPage /> },

          // CMS
          { path: "cms/about", element: <AboutAdminPage /> },
          { path: "cms/contact", element: <ContactAdminPage /> },
          { path: "cms/faq", element: <FaqAdminPage /> },

          // Reports
          { path: "reports/sales", element: <SalesReportPage /> },
          { path: "reports/inventory", element: <InventoryReportPage /> },
          {
            path: "cms/privacy",
            element: (
              <PolicyAdminPage documentId="privacy" title="Privacy Policy" />
            ),
          },
          {
            path: "cms/terms",
            element: (
              <PolicyAdminPage
                documentId="terms"
                title="Terms & Conditions"
              />
            ),
          },
          {
            path: "cms/shipping",
            element: (
              <PolicyAdminPage documentId="shipping" title="Shipping Policy" />
            ),
          },
          {
            path: "cms/cancellation",
            element: (
              <PolicyAdminPage
                documentId="cancellation"
                title="Cancellation & Refund Policy"
              />
            ),
          },
          {
            path: "cms/offer-terms",
            element: (
              <PolicyAdminPage
                documentId="offer-terms"
                title="Offer Terms & Conditions"
              />
            ),
          },
          {
            path: "cms/replacement",
            element: (
              <PolicyAdminPage
                documentId="replacement"
                title="Replacement Policy"
              />
            ),
          },
          { path: "cms/brand-statement", element: <AdminBrandStatementPage /> },
          { path: "b2b-enquiries", element: <AdminB2BEnquiriesPage /> },
        ],
      },
    ],
  },

  { path: "*", element: <NotFoundPage /> },
]);