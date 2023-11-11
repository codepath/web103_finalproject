import { Route, Routes, BrowserRouter } from "react-router-dom";
import { Login } from "./pages";
import { UserProvider } from "./provider";

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;
