import { Route, Routes, BrowserRouter } from "react-router-dom";
import { Login, UserHome, StudentInfo, TutorInfo } from "./pages";
import { UserContext } from "./provider/UserProvider";
import { useContext } from "react";
import { Layout } from "./components";
import ClipLoader from "react-spinners/ClipLoader";

const App = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return (
      <div>
        {" "}
        <ClipLoader
          color="#ffffff"
          loading={loading}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }
  return (
    <BrowserRouter>
      <Routes>
        {!user ? (
          <Route path="/" element={<Login />}></Route>
        ) : (
          <Route path="/" element={<Layout />}>
            <Route index element={<UserHome />} />
            <Route path="studentInfo" element={<StudentInfo />} />
            <Route path="tutorInfo" element={<TutorInfo />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
