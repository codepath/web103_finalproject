import React from "react";
import Navbar from "../components/Navbar";
import { Carousel } from "flowbite-react";
import boardsInfo from "../dummydata/boardsData";

function CreateBoard() {
  return (
    <>
      <Navbar />
      <div style={{ fontSize: "100px" }}>Create your board here</div>
      <Carousel>
        {boardsInfo.map((board) => (
          <img key={board.id} src={board.url} alt={board.id} />
        ))}
      </Carousel>
    </>
  );
}

export default CreateBoard;
