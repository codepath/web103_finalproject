import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Placeholder from "./pages/Placeholder.jsx";
import Pantry from "./pages/Pantry.jsx";
import PantryNew from "./pages/PantryNew.jsx";
import Recipes from "./pages/Recipes.jsx";
import Shopping from "./pages/Shopping.jsx";
import Planner from "./pages/Planner.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import SavedRecipes from "./pages/SavedRecipes.jsx";


export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="pantry" element={<Pantry />} />
        <Route path="pantry/new" element={<PantryNew />} />
        <Route path="recipes" element={<Recipes />} />
        <Route path="planner" element={<Planner />} />
        <Route path="shopping" element={<Shopping />} />
        <Route path="saved" element={<SavedRecipes />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
