import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import Providers from "./app/providers";

import "./styles/global.css";

if (import.meta.env.DEV) {
  import("eruda").then((eruda) => eruda.default.init());
}

ReactDOM.createRoot(
  document.getElementById("root")!,
).render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>,
);