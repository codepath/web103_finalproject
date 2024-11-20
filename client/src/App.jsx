import {useState, useEffect} from "react";
import { useRoutes } from "react-router-dom";
import { Container, Typography, Grid2, Button } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/UserLogin";
import Income from "./pages/Income";
import Expense from "./pages/Expense";

function App() {
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const API_URL = "http://localhost:3000";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/login/success`, {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
        });

        const content = await res.json();
        if (content.user) {
          setUser(content.user);
        }
      } catch (error) {
        console.log(error);
      }
    }

    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/category");
        const categories = await response.json();
        console.log(categories);
        setCategories(categories.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    fetchUser();
    fetchCategories();
  }, []);

  let element = useRoutes([
    {
      path: "/",
      element: <Home user={user}/>,
    },
    {
      path: "/login",
      element: <Login api_url={API_URL}/>,
    },
    {
      path: "/logout",
      element: <h1> You have been successfully Logged Out </h1>,
    },
    {
      path: "/income/:id",
      element: <Income categories={categories} user={user}/>,
    },
    {
      path: "/expenses/:id",
      element: <Expense categories={categories} user={user}/>,
    }
  ]);

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
      });
      setUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
      <Container>
        <header>
          <Typography variant="h2" align="center" gutterBottom color="white">
            Budget Buddy
          </Typography>
          <Typography variant="h5" align="center">
            Take control of your finances with Budget Buddy. Track your expenses,
            set budgets, and achieve your financial goals.
          </Typography>
          <Grid2 container spacing={3} justifyContent="end">
            <Grid2 item>
              <Button variant="contained" color="primary" href="/">
                Home
              </Button>
            </Grid2>
            <Grid2 item>
              {user !== null ? (
                <Button variant="outlined" color="white" onClick={handleLogout} href={`/logout`}>
                  {user.username} <br />
                  Logout
                </Button>
              ) : (
                <Button variant="outlined" color="white" href="/login">
                  Login
                </Button>
              )}
            </Grid2>
          </Grid2>
        </header>
        {element}

        <footer style={{ marginTop: "2rem", textAlign: "center" }}>
          <div>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FacebookIcon />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://www.x.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <XIcon />
            </a>
          </div>
          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
            style={{ marginTop: "1rem" }}
          >
            © {new Date().getFullYear()} Budget Buddy. All rights reserved.
          </Typography>
        </footer>
      </Container>
  );
}

export default App;
