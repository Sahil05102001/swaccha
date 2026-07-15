import { createBrowserRouter } from "react-router-dom";

import CustomerLayout from "@/layouts/CustomerLayout";

import HomePage from "@/features/home/pages/HomePage";
import ProductsPage from "@/features/products/pages/ProductsPage";
import ProductDetailsPage from "@/features/products/pages/ProductDetailsPage";

import NotFoundPage from "@/features/customer/pages/NotFoundPage";

import CartPage from "@/features/cart/pages/CartPage";

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
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);