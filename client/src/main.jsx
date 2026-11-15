import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout.jsx";
import { ExplorerPage } from "./pages/ExplorerPage.jsx";
import { TreeDetailPage } from "./pages/TreeDetailPage.jsx";
import { NotFoundPage } from "./pages/PlaceholderPages.jsx";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { ToastProvider } from "./components/Toast.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<ExplorerPage />} />
            <Route path="trees/:id" element={<TreeDetailPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
);
