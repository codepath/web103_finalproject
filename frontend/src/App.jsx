
import { useEffect, useState } from "react";

import {
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import { api } from "./api.js";

import Layout from "./components/Layout.jsx";

import AuthPage from "./pages/AuthPage.jsx";
import Pantry from "./pages/Pantry.jsx";
import PantryNew from "./pages/PantryNew.jsx";
import Recipes from "./pages/Recipes.jsx";
import Shopping from "./pages/Shopping.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import MealPlanner from "./pages/MealPlanner.jsx";
import SavedRecipes from "./pages/SavedRecipes.jsx";
import KitchenStudio from "./pages/KitchenStudio.jsx";

import "./styles/kitchen3.css";

export default function App() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [checking, setChecking] =
    useState(true);

  const [error, setError] =
    useState("");

  // Restore the logged-in account on refresh.

  useEffect(() => {
    let active = true;

    api.get("/auth/me")
      .then((result) => {
        if (active) {
          setUser(result.user);
        }
      })
      .catch(() => {
        if (active) {
          setUser(null);
        }
      })
      .finally(() => {
        if (active) {
          setChecking(false);
        }
      });

    function sessionExpired() {
      setUser(null);
    }

    window.addEventListener(
      "prepwise:session-expired",
      sessionExpired
    );

    return () => {
      active = false;

      window.removeEventListener(
        "prepwise:session-expired",
        sessionExpired
      );
    };
  }, []);

  // Open Cook & Consume from the chef's cooking guide.

  useEffect(() => {
    function openCook(event) {
      const recipeId = event.detail?.recipeId;

      if (user && recipeId) {
        navigate(
          `/kitchen?tab=cook&recipe=${encodeURIComponent(recipeId)}`
        );
      }
    }

    window.addEventListener(
      "prepwise:open-cook",
      openCook
    );

    return () => {
      window.removeEventListener(
        "prepwise:open-cook",
        openCook
      );
    };
  }, [user, navigate]);

  // Sign in successfully.

  function login(account) {
    setUser(account);

    navigate("/", {
      replace: true,
    });
  }

  // End the current session.

  async function logout() {
    try {
      await api.post("/auth/logout", {});

      setUser(null);

      navigate("/", {
        replace: true,
      });
    } catch (err) {
      setError(err.message);
    }
  }

  // Loading screen.

  if (checking) {
    return (
      <main className="pw-auth">
        <h2>
          👨‍🍳 Preparing your kitchen…
        </h2>
      </main>
    );
  }

  // Require login before entering the application.

  if (!user) {
    return (
      <AuthPage onLogin={login} />
    );
  }

  // Main PrepWise application.

  return (
    <>
      {error && (
        <p role="alert">
          {error}
        </p>
      )}

      <Routes>
        <Route
          element={
            <Layout
              key={user.id}
              user={user}
              onLogout={logout}
            />
          }
        >

          <Route
            index
            element={<Dashboard />}
          />

          <Route
            path="pantry"
            element={<Pantry />}
          />

          <Route
            path="pantry/new"
            element={<PantryNew />}
          />

          <Route
            path="recipes"
            element={<Recipes />}
          />

          <Route
            path="planner"
            element={<MealPlanner />}
          />

          <Route
            path="shopping"
            element={<Shopping />}
          />

          <Route
            path="saved"
            element={<SavedRecipes />}
          />

          <Route
            path="kitchen"
            element={<KitchenStudio />}
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

        </Route>
      </Routes>
    </>
  );
}
