import { useRoutes } from "react-router-dom";
import { Container, Typography, Grid2, Button } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/UserLogin";
import Register from "./pages/UserRegister";

function App() {
  let element = useRoutes([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]);

  return (
    <>
      <Container>
        <Typography variant="h2" align="center" gutterBottom>
          Budget Buddy
        </Typography>
        <Typography variant="h5" align="center" paragraph>
          Take control of your finances with Budget Buddy. Track your expenses,
          set budgets, and achieve your financial goals.
        </Typography>
        <Grid2 container spacing={3} justify="center">
          <Grid2 item>
            <Button variant="contained" color="primary" href="/register">
              Get Started
            </Button>
          </Grid2>
          <Grid2 item>
            <Button variant="outlined" color="primary" href="/login">
              Login
            </Button>
          </Grid2>
        </Grid2>
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
    </>
  );
}

export default App;
