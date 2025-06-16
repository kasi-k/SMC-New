import React, { useState } from "react";
import SMCLogo from "../../assets/SMC Logo.png";
import frame from "../../assets/backframe.png";
import { useLocation, useNavigate } from "react-router-dom";
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { API } from "../../Host";

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
// min 6 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit.
const schema = yup
  .object()
  .shape({
    newPassword: yup
      .string()
      .required("Password is required")
      .min(6, "Password is too short - should be 6 chars minimum")
      .matches(passwordRules, {
        message:
          " min 6 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit",
      }),
    confirmPassword: yup
      .string()
      .required("Password is required")
      .min(6, "Password is too short - should be 6 chars minimum")
      .oneOf(
        [yup.ref("newPassword"), null],
        "NewPassword and confirmPassword must match"
      ),
  })
  .required();

const ChangePassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const adminemail = location.state?.adminemail;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data) => {
    const formData = {
      confirmpassword: data.confirmPassword,
    };
    try {
      const response = await axios.post(
        `${API}/api/changepassword?email=${adminemail}`,
        formData
      );

      if (response.status === 200) {
        navigate("/team");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className=" font-poppins flex justify-center h-screen items-center bg-[#300080]   ">
        <div className="relative w-96 mx-1 bg-[#200098]  shadow-lg border-x-2 border-violet-950">
          <img src={frame} alt="Image" className="absolute opacity-20 z-0" />
          <img src={SMCLogo} alt="Image" className="mx-2 my-2" />
          <p className="text-center text-white my-10">Change Password</p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-3 mx-10 my-6 ">
              <label htmlFor="" className="text-white">
                New Password <span className="text-red-600">*</span>
              </label>
              <input
                {...register("newPassword")}
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                required
                className="py-1.5 z-10  rounded-md text-center text-black "
              />
              <p className="text-red-700">{errors.newPassword?.message}</p>
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="flex justify-end items-center mx-4"
              >
                <p className="text-blackabsolute top-60 my-3 z-10 ">
                  {showPassword ? <IoIosEye /> : <IoIosEyeOff />}
                </p>
              </div>
              <label htmlFor="" className="text-white">
                Confirm Password <span className="text-red-600">*</span>
              </label>
              <input
                {...register("confirmPassword")}
                type={showPassword ? "text" : "password"}
                placeholder="Enter confirm password"
                required
                className="py-1.5 z-10  rounded-md text-center text-black"
              />
              <p className="text-red-700">{errors.confirmPassword?.message}</p>
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="flex justify-end items-center mx-4"
              >
                <p className="text-black absolute bottom-80 my-4 z-10  ">
                  {showPassword ? <IoIosEye /> : <IoIosEyeOff />}
                </p>
              </div>

              <div className="flex justify-center  my-24">
                <button
                  type="submit"
                  className=" text-white bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] w-1/2 py-2 "
                >
                  Save
                </button>
              </div>
            </div>
          </form>
          <p className="text-sm mt-10 text-center text-white font-extralight">
            &#169; PickMyCourse Developed with{" "}
            <span className="text-red-500">&#x2764;</span> by SeenIT Pty Ltd
          </p>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
