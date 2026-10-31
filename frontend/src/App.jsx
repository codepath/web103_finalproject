import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Placeholder from "./pages/Placeholder.jsx";
import Pantry from "./pages/Pantry.jsx";
import PantryNew from "./pages/PantryNew.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Placeholder title="Dashboard" />} />
        <Route path="pantry" element={<Pantry />} />
        <Route path="pantry/new" element={<PantryNew />} />
        <Route path="recipes" element={<Placeholder title="Discover Recipes" />} />
        <Route path="planner" element={<Placeholder title="Weekly Meal Planner" />} />
        <Route path="shopping" element={<Placeholder title="Shopping List" />} />
        <Route path="saved" element={<Placeholder title="Saved Recipes" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
