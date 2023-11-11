import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

function Login() {
  const [isNewAttempt, setNewAttempt] = useState(true);
  const [isRegisteredUser, setRegisteredUser] = useState(false);
  const [schema, setSchema] = useState();

  const [emailBtnVisible, setEmailBtnVisible] = useState(false);
  const handleEmailButton = (e) => {
    console.log(e.target.value);
    setEmailBtnVisible(e.target.value.length > 1);
  };

  const checkUserExists = () => {
    setRegisteredUser((prev) => prev);
    if (isRegisteredUser) {
      const registerSchema = yup.object().shape({
        email: yup.string().required("Email is required!"),
        password: yup.string().required("Password is required!"),
        name: yup.string().required("Name is required!"),
        phone: yup.string().required("Name is required!"),
      });
      setSchema(registerSchema);
    } else {
      const loginSchema = yup.object().shape({
        email: yup.string().required("Email is required!"),
        password: yup.string().required("Password is required!"),
      });
      setSchema(loginSchema);
    }
    setNewAttempt((prev) => !prev);
  };

  // Declare the useForm state where register has formData and handleSubmit helps in submitting form
  let {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  // The submit function called inside handleSubmit state method
  const onSubmit = (data) => {
    setNewAttempt((prev) => true);
    setRegisteredUser((prev) => false);
    setEmailBtnVisible(false);
    if ("name" in data) {
      console.log("register");
    } else {
      console.log("login");
    }
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
      <p style={{ fontSize: "25px", fontWeight: "700" }}>LOGIN FORM</p>
      {!isNewAttempt && !isRegisteredUser && (
        <div>
          <input
            type="text"
            placeholder="Enter your name"
            {...register("name")}
            style={{ fontSize: "20px", padding: "15px", margin: "10px" }}
          />
          <p style={{ color: "red" }}>{errors.name?.message}</p>
        </div>
      )}
      <div>
        <input
          type="text"
          placeholder="Enter your email"
          onKeyDown={(e) => handleEmailButton(e)}
          autoComplete="current-email"
          {...register("email")}
          style={{ fontSize: "20px", padding: "15px", margin: "10px" }}
        />
        <p style={{ color: "red" }}>{errors.email?.message}</p>
      </div>
      {isNewAttempt && emailBtnVisible && (
        <button
          style={{
            fontSize: "20px",
            padding: "15px",
            width: "240px",
            margin: "10px",
          }}
          onClick={checkUserExists}
        >
          Submit
        </button>
      )}
      {!isNewAttempt && (
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
      )}
      {!isNewAttempt && !isRegisteredUser && (
        <div>
          <input
            type="text"
            placeholder="Enter your phone number"
            {...register("phone")}
            style={{ fontSize: "20px", padding: "15px", margin: "10px" }}
          />
          <p style={{ color: "red" }}>{errors.phone?.message}</p>
        </div>
      )}
      {!isNewAttempt && (
        <input
          type="submit"
          style={{
            fontSize: "20px",
            padding: "15px",
            width: "240px",
            margin: "10px",
          }}
        />
      )}
    </form>
  );
}

export default Login;
