import React from "react";
import ReactDOM from "react-dom/client";

import "jspdf";

import "@/assets/fonts/NotoSans-Regular-normal";

import App from "./App";
import Providers from "./app/providers";

import "./styles/global.css";

ReactDOM.createRoot(
  document.getElementById("root")!,
).render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>,
);