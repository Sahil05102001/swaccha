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

import AdminLayout from "@/features/admin/layouts/AdminLayout";
import AdminDashboardPage from "@/features/admin/pages/AdminDashboardPage";
import AdminSettingsPage from "@/features/admin/pages/AdminSettingsPage";
import AdminProductsPage from "@/features/admin/products/pages/AdminProductsPage";
import CategoriesPage from "@/features/admin/categories/pages/CategoriesPage";
import AdminOrdersPage from "@/features/admin/orders/pages/OrdersPage";
import AdminCustomersPage from "@/features/admin/customers/pages/AdminCustomersPage";
import CustomerDetailsPage from "@/features/admin/customers/pages/CustomerDetailsPage";

import AboutAdminPage from "@/features/cms/about/admin/pages/AboutAdminPage";
import AboutPage from "@/features/cms/about/pages/AboutPage";
import ContactPage from "@/features/cms/contact/pages/ContactPage";
import ContactAdminPage from "@/features/cms/contact/admin/pages/ContactAdminPage";

import { SalesReportPage } from "@/features/reports";
import { InventoryReportPage } from "@/features/inventoryReports";

import NotFoundPage from "@/features/customer/pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <CustomerLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "products",
        element: <ProductsPage />,
      },
      {
        path: "products/:id",
        element: <ProductDetailsPage />,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "wishlist",
        element: <WishlistPage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "contact",
        element: <ContactPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
      },

      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "profile",
            element: <ProfilePage />,
          },
          {
            path: "checkout",
            element: <CheckoutPage />,
          },
          {
            path: "orders/success",
            element: <OrderSuccessPage />,
          },
          {
            path: "orders",
            element: <OrdersPage />,
          },
          {
            path: "orders/:id",
            element: <OrderDetailsPage />,
          },
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
          {
            index: true,
            element: <AdminDashboardPage />,
          },
          {
            path: "products",
            element: <AdminProductsPage />,
          },
          {
            path: "categories",
            element: <CategoriesPage />,
          },
          {
            path: "orders",
            element: <AdminOrdersPage />,
          },
          {
            path: "orders/:id",
            element: <OrderDetailsPage />,
          },
          {
            path: "customers",
            element: <AdminCustomersPage />,
          },
          {
            path: "customers/:uid",
            element: <CustomerDetailsPage />,
          },
          {
            path: "settings",
            element: <AdminSettingsPage />,
          },

          // CMS
          {
            path: "cms/about",
            element: <AboutAdminPage />,
          },
          {
            path: "cms/contact",
            element: <ContactAdminPage />,
          },

          // Reports
          {
            path: "reports/sales",
            element: <SalesReportPage />,
          },
          {
            path: "reports/inventory",
            element: <InventoryReportPage />,
          },
        ],
      },
    ],
  },

  {
    path: "*",
    element: <NotFoundPage />,
  },
]);