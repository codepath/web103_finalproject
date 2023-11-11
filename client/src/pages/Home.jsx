import React, { useEffect, useState } from "react";
import validateUser from "../services/validateUser";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import BoardsPopUp from "../components/BoardPopUp";

function Home() {
  const [showBoardsPopUp, setBoardsPopUp] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const navigate = useNavigate();

  const checkUser = async () => {
    const isUserLoggedIn = await validateUser();
    console.log(isUserLoggedIn);
    if (isUserLoggedIn) {
      setUserLoggedIn((prev) => !prev);
    } else {
      navigate("/login", { replace: true });
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <>
      <Navbar displayPopUp={setBoardsPopUp} />
      {showBoardsPopUp && <BoardsPopUp displayPopUp={setBoardsPopUp} />}
      {!showBoardsPopUp && (
        <div style={{ fontSize: "100px" }}>This is the Home Page</div>
      )}
    </>
  );
}

export default Home;
