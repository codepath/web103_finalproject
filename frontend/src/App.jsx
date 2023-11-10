import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { Home, StudentInfo, TutorInfo, UserHome } from "./pages";
import { useState } from "react";

function App() {
  const [logIn, setLogIn] = useState(false);
  return (
    <Routes>
      {!logIn ? (
        <Route path="/" element={<Home setLogIn={setLogIn} />}></Route>
      ) : (
        <Route path="/" element={<Layout setLogIn={setLogIn} />}>
          <Route index element={<UserHome />} />
          <Route path="studentInfo" element={<StudentInfo />} />
          <Route path="tutorInfo" element={<TutorInfo />} />
        </Route>
      )}
    </Routes>
  );
}

export default App;
