import React, { useState } from "react";
import SMCLogo from "../../assets/SMC Logo.png";
import frame from "../../assets/backframe.png";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { API } from "../../Host";
import { toast } from "react-toastify";
import { AiOutlineLoading } from "react-icons/ai";

const schema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .email("Please enter a valid Email ")
    .required("Email is required"),
});

const ForgotPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data) => {
    setIsSubmitting(true);

    const formData = {
      ...data,
      company: "SMC",
    };
    try {
      const response = await axios.post(`${API}/api/forgot`, formData);
      if (response.status === 200) {
        toast.success("Link Sent to ur mailid Successfully ");
        setIsSubmitting(false);
        navigate("/reset-password");
      }
    } catch (error) {
      toast.error("Invalid Email");
      setIsSubmitting(false);
      console.log(error);
    }
  };

  return (
    <>
      <div className=" font-poppins flex justify-center h-screen items-center bg-[#300080]   ">
        <div className="relative w-96 mx-1 bg-[#200098]  shadow-lg border-x-2 border-violet-950">
          <img src={frame} alt="Image" className="absolute opacity-15 z-0" />
                 <div className="flex justify-center pt-8">
          <img src={SMCLogo} alt="Image" className="mx-4 my-2 w-60 " />
          </div>
         
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
             <p className="text-white text-center my-2">Forgot Password</p>
            <p className="text-center text-white ">
              Please enter your email id
            </p>
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

              <div className="flex justify-center text-center my-24">
                <p
                  // onClick={redirectResetPassword}
                  type="submit"
                  className={` text-white bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] w-1/2 py-2 rounded-md ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  } `}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex justify-center items-center  text-xl ">
                      <AiOutlineLoading className="h-6 w-6 animate-spin" />
                    </div>
                  ) : (
                    "Continue"
                  )}
                </p>
              </div>
            </div>
          </form>
         <p className=" text-center px-2 py-2  text-xs text-white   ">
            Designed with
            <span className="text-red-500 px-1">&#x2764;</span>
            <span>Morpheus Code</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
