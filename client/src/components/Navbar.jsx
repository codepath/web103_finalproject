import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar(props) {
  const navigate = useNavigate();
  const display = props.displayPopUp;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        position: "absolute",
        height: "40px",
        top: "0",
        width: "100%",
        left: "0",
        fontSize: "16px",
        marginTop: "10px",
      }}
    >
      <button
        style={{ borderRadius: "0px", borderColor: "black" }}
        onClick={() => navigate("/")}
      >
        Home
      </button>
      <h1 style={{ fontWeight: "700", marginTop: "0px" }}>KUL'BOARD</h1>
      <button
        style={{ borderRadius: "0px", borderColor: "black" }}
        onClick={() => display((prev) => !prev)}
      >
        Create Board
      </button>
    </div>
  );
}

export default Navbar;
