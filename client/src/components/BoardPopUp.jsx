import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import boardsInfo from "../dummydata/boardsData";

function BoardsPopUp(props) {
  console.log("board mounted");
  const display = props.displayPopUp;
  const [memberCount, setMemberCount] = useState([]);
  const schema = yup.object().shape({
    boardname: yup.string().required("Board name is required!"),
  });

  // Declare the useForm state where register has formData and handleSubmit helps in submitting form
  let {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  // The submit function called inside handleSubmit state method
  const onSubmit = (data) => {
    console.log(data);
    boardsInfo.push(data);
    display(false);
    reset();
    console.log(boardsInfo);
    console.log("board un-mounted");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        borderStyle: "double",
        borderRadius: "10px",
        padding: "50px",
      }}
    >
      <p style={{ fontSize: "25px", fontWeight: "700" }}>CREATE NEW BOARD</p>
      <div>
        <input
          type="text"
          placeholder="Enter board name"
          {...register("boardname")}
          style={{ fontSize: "20px", padding: "15px", margin: "10px" }}
        />
        <p style={{ color: "red" }}>{errors.boardname?.message}</p>
      </div>
      {memberCount.map((count) => (
        <div key={"boardmember" + count}>
          <input
            type="text"
            placeholder={`Enter member ${count} email`}
            {...register("boardmember" + count)}
            style={{ fontSize: "20px", padding: "15px", margin: "15px" }}
          />
        </div>
      ))}

      <input
        type="button"
        value="Add Board Members"
        onClick={() => setMemberCount((prev) => [...prev, prev.length + 1])}
        style={{
          display: "inherit",
          fontSize: "20px",
          padding: "15px",
          width: "242px",
          margin: "12px",
          marginLeft: "15px",
        }}
      ></input>

      <input
        type="submit"
        style={{
          fontSize: "20px",
          padding: "15px",
          width: "240px",
          margin: "10px",
        }}
      />
    </form>
  );
}

export default BoardsPopUp;
