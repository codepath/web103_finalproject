import React from "react";
import { useRoutes } from "react-router-dom";

import ListingsPage from "./pages/ListingsPage/ListingsPage";
import Listing from "./pages/SingleListing/SingleListing";
import TeneesPage from "./pages/TeneesPage/TeneesPage";
import Tenee from "./pages/Tenee/Tenee";
import UserProfile from "./pages/UserProfile/UserProfile";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import FavoritesPage from "./pages/FavoritesPage/FavoritesPage";
import Onboarding from "./pages/Onboarding/Onboarding";
import CreateListing from "./pages/CreateListing/CreateListing";
import CreateTeneePost from "./pages/CreateTeneePost/CreateTeneePost";

import Header from "./components/Header";
import Footer from "./components/Footer";

import "./App.css";

function App() {
    let element = useRoutes([
        {
            path: "/",
            element: <ListingsPage />,
        },
        {
            path: "/listing/:id",
            element: <Listing />,
        },
        {
            path: "/listing/create",
            element: <CreateListing />,
        },
        {
            path: "/tenees",
            element: <TeneesPage />,
        },
        {
            path: "/tenee/:id",
            element: <Tenee />,
        },
        {
            path: "/tenee/create",
            element: <CreateTeneePost />,
        },
        {
            path: "/user/:id",
            element: <UserProfile />,
        },
        {
            path: "/login",
            element: <Login />,
        },
        {
            path: "/register",
            element: <Register />,
        },
        {
            path: "/favorites",
            element: <FavoritesPage />,
        },
        {
            path: "/onboarding",
            element: <Onboarding />,
        },
    ]);

    return (
        <div className="App">
            <Header />
            {element}
        </div>
    );
}

export default App;
