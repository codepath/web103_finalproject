import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

function Login() {
  // creating data schema with yup for data validation
  const schema = yup.object().shape({
    email: yup.string().required("Email is required!"),
    password: yup.string().required("Password is required!"),
  });

  // Declare the useForm state where register has formData and handleSubmit helps in submitting form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  // The submit function called inside handleSubmit state method
  const onSubmit = (data) => {
    console.log(data);
    reset();
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
      <div>
        <p style={{ fontSize: "25px", fontWeight: "700" }}>LOGIN FORM</p>
        <input
          type="text"
          placeholder="Enter your email"
          autoComplete="current-email"
          {...register("email")}
          style={{ fontSize: "20px", padding: "15px", margin: "10px" }}
        />
        <p style={{ color: "red" }}>{errors.email?.message}</p>
      </div>
      <div>
        <input
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          {...register("password")}
          style={{ fontSize: "20px", padding: "15px", margin: "10px" }}
        />
        <p style={{ color: "red" }}>{errors.password?.message}</p>
      </div>
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

export default Login;
