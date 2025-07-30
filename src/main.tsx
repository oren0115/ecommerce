import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
// import { Provider } from "./provider.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import "@/styles/globals.css";
// import "@/styles/cart.css";
// import "@/styles/wishlist.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </AuthProvider>
);
