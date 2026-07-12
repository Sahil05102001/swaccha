import { createBrowserRouter } from "react-router-dom";

import CustomerLayout from "@/layouts/CustomerLayout";

import HomePage from "@/features/home/pages/HomePage";
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
    ],
  },

  {
    path: "*",
    element: <NotFoundPage />,
  },
]);