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

import NotFoundPage from "@/features/customer/pages/NotFoundPage";
import ProfilePage from "@/features/profile/pages/ProfilePage";

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
        path: "products/:slug",
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

      // ===========================
      // Protected Routes
      // ===========================
      {
        element: <ProtectedRoute />,
        children: [
          // Add protected pages here as you build them.
          // Example:
          //
          {
            path: "profile",
            element: <ProfilePage />,
          },
          //
          // {
          //   path: "orders",
          //   element: <OrdersPage />,
          // },
          //
          // {
          //   path: "checkout",
          //   element: <CheckoutPage />,
          // },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);