import React, { useState } from "react";
import SMCLogo from "../../assets/SMC Logo.png";
import frame from "../../assets/backframe.png";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { API } from "../../Host";
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import { toast } from "react-toastify";

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
// min 6 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit.
const schema = yup
  .object()
  .shape({
    email: yup
      .string()
      .trim()
      .email("Please enter a valid Email ")
      .required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password is too short - should be 6 chars minimum")
      .matches(passwordRules, {
        message:
          " min 6 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit",
      }),
  })
  .required();

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data) => {
    const formData = {
      ...data,
    };

    try {
      // Step 1: Authenticate the user
      const response = await axios.post(`${API}/api/adminsignin`, formData);
      const responseData = response.data;

      if (response.status === 200) {
        toast.success("Logged in Successfully");

        // Store user information
        localStorage.setItem("email", responseData.adminData.email);
        localStorage.setItem("fname", responseData.adminData.fname);
        localStorage.setItem("lname", responseData.adminData.lname);
        localStorage.setItem("phone", responseData.adminData.phone);
        localStorage.setItem("user", responseData.adminData._id);
        localStorage.setItem("role", responseData.adminData.designation);

        const updateEvent = new Event("storage");
        window.dispatchEvent(updateEvent);

        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
      toast.error("Invalid Email-id Or Password");
    }
  };

  const redirectForgotPassword = () => {
    navigate("/forgotpassword");
  };
  return (
    <>
      <div className=" font-poppins flex justify-center h-screen items-center bg-[#300080] ">
        <div className=" relative w-96 mx-1  bg-[#200098]  shadow-lg border-x-2 border-violet-950  ">
          <img src={frame} alt="Image" className="absolute opacity-15 z-0" />
          <div className="flex justify-center pt-8">
            <img src={SMCLogo} alt="Image" className=" mx-4 my-2 w-60 " />
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
            <p className="text-center text-white">Login</p>
            <div className="grid gap-3 mx-4 my-6 ">
              <label htmlFor="email" className="text-white">
                Email <span className="text-red-600">*</span>
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="Enter Email"
                required
                className="py-1.5 z-10  bg-white outline-none rounded-md text-center text-black"
              />
              <p className="text-red-700">{errors.email?.message}</p>
              <label htmlFor="password" className="text-white">
                Password <span className="text-red-600">*</span>
              </label>
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                className="py-1.5  z-10 rounded-md text-center bg-white outline-none text-black"
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="flex justify-end items-center mx-4"
              >
                <p className="absolute top-60 my-[58px] z-10 ">
                  {showPassword ? <IoIosEye /> : <IoIosEyeOff />}
                </p>
              </div>
              <p className="text-red-700">{errors.password?.message}</p>
              <div className="text-end cursor-pointer -mt-6 ">
                <span
                  onClick={redirectForgotPassword}
                  className="relative  text-white"
                >
                  forgot Password?
                </span>
              </div>
              <div className="flex justify-center py-16">
                <button
                  type="submit"
                  className=" cursor-pointer text-white bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] w-1/2 py-2 rounded-md "
                >
                  Login
                </button>
              </div>
            </div>
          </form>
          <p className="text-sm py-2 text-center text-white font-light">
            Designed with
            <span className="text-red-500 px-1">&#x2764;</span>
            <span>Morpheus Code</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
