import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

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
      }}
    >
      <button onClick={() => navigate("/")}>Home</button>
      <p style={{ fontWeight: "700" }}>Kul'Board - Your Family Board</p>
      <button onClick={() => navigate("/createboard")}>Create Board</button>
    </div>
  );
}

export default Navbar;
