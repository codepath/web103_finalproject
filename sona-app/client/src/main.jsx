import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Directory from "./pages/Directory.jsx";
import ArtistDetail from "./pages/ArtistDetail.jsx";
import Profile from "./pages/Profile.jsx";
import PostEditForm from "./pages/PostEditForm.jsx";
import PostCreateForm from "./pages/PostCreateForm.jsx";
import MerchShop from "./pages/MerchShop.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route path="/" element={<Directory />} />
          <Route path="/artists/:id" element={<ArtistDetail />} />
          <Route path="/posts/edit/:id" element={<PostEditForm />} />
          <Route path="/posts/create" element={<PostCreateForm />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/merch" element={<MerchShop />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
