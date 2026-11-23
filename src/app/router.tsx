import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import CustomerLayout from "@/layouts/CustomerLayout";
import HomePage from "@/features/home/pages/HomePage";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import AdminProtectedRoute from "@/features/auth/components/AdminProtectedRoute";
import MaintenanceGate from "@/features/maintenance/components/MaintenanceGate";
import NotFoundPage from "@/features/customer/pages/NotFoundPage";


// Admin: the layout stays in the main bundle (it is the shell); every page
// below is downloaded only when the admin opens it.
import AdminLayout from "@/features/admin/layouts/AdminLayout";


// Customer pages download only when visited. Home stays in the main bundle.
const ProductsPage = lazy(() => import("@/features/products/pages/ProductsPage"));
const ProductDetailsPage = lazy(() => import("@/features/products/pages/ProductDetailsPage"));
const CartPage = lazy(() => import("@/features/cart/pages/CartPage"));
const WishlistPage = lazy(() => import("@/features/wishlist/pages/WishlistPage"));
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/features/auth/pages/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("@/features/auth/pages/ForgotPasswordPage"));
const ProfilePage = lazy(() => import("@/features/profile/pages/ProfilePage"));
const CheckoutPage = lazy(() => import("@/features/orders/pages/CheckoutPage"));
const OrderSuccessPage = lazy(() => import("@/features/orders/pages/OrderSuccessPage"));
const OrdersPage = lazy(() => import("@/features/orders/pages/OrdersPage"));
const OrderDetailsPage = lazy(() => import("@/features/orders/pages/OrderDetailsPage"));
const CustomerOfferZonePage = lazy(() => import("@/features/offerzone/pages/CustomerOfferZonePage"));
const AboutPage = lazy(() => import("@/features/cms/about/pages/AboutPage"));
const ContactPage = lazy(() => import("@/features/cms/contact/pages/ContactPage"));
const PhysicalShopPage = lazy(() => import("@/features/store/pages/PhysicalShopPage"));
const BulkOrderPage = lazy(() => import("@/features/bulkOrder/pages/BulkOrderPage"));
const FaqPage = lazy(() => import("@/features/cms/faq/pages/FaqPage"));
const PolicyPage = lazy(() => import("@/features/cms/policy/pages/PolicyPage"));


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
const AdminLightningDealsPage = lazy(
  () =>
    import("@/features/admin/lightningDeals/pages/AdminLightningDealsPage"),
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
const AdminExclusiveOffersPage = lazy(
  () =>
    import(
      "@/features/admin/exclusiveOffers/pages/AdminExclusiveOffersPage"
    ),
);
const AdminShippingPage = lazy(
  () => import("@/features/admin/shipping/pages/AdminShippingPage"),
);
const AdminTaxPage = lazy(
  () => import("@/features/admin/tax/pages/AdminTaxPage"),
);
const AdminStockHistoryPage = lazy(
  () => import("@/features/admin/stock/pages/AdminStockHistoryPage"),
);
const AdminMaintenancePage = lazy(
  () => import("@/features/admin/maintenance/pages/AdminMaintenancePage"),
);
const AdminHelpPage = lazy(
  () => import("@/features/admin/help/pages/AdminHelpPage"),
);


export const router = createBrowserRouter([
  {
    element: <MaintenanceGate />,
    children: [
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
      { path: "*", element: <NotFoundPage /> },
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
          { path: "lightning-deals", element: <AdminLightningDealsPage /> },
          { path: "exclusive-offers", element: <AdminExclusiveOffersPage /> },
          { path: "ad-banner", element: <AdminAdBannerPage /> },
          { path: "videos", element: <AdminVideosPage /> },
          { path: "category-circles", element: <AdminCategoryCirclesPage /> },
          { path: "featured-products", element: <AdminFeaturedProductsPage /> },
          { path: "offer-zone", element: <OfferZonePage /> },
          { path: "orders", element: <AdminOrdersPage /> },
          { path: "customers", element: <AdminCustomersPage /> },
          { path: "customers/:uid", element: <CustomerDetailsPage /> },
          { path: "reviews", element: <AdminReviewsPage /> },
          { path: "coupons", element: <AdminCouponsPage /> },
          { path: "shipping", element: <AdminShippingPage /> },
          { path: "tax", element: <AdminTaxPage /> },
          { path: "stock-history", element: <AdminStockHistoryPage /> },
          { path: "maintenance", element: <AdminMaintenancePage /> },
          { path: "help", element: <AdminHelpPage /> },
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
]);