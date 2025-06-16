import React, { useState, useEffect } from "react";
import Modal from "../../components/Modal";
import { API } from "../../Host";
import axios from "axios";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";

const emailSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
});

const UpdateEmail = ({ CloseEmailModal }) => {
  const oldEmail = localStorage.getItem("useremail");
  const phone = localStorage.getItem("userphone");
  const [stepModal, setStepModal] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(emailSchema),
  });

  useEffect(() => {
    if (oldEmail) {
      setValue("email", oldEmail);
    }
  }, [oldEmail, setValue]);

  const handle2Modal = () => {
    setStepModal(false);
    CloseEmailModal();
  };

  const onsubmit = async (data) => {
    setStepModal(true);
    const formData = {
      ...data,
    };

    try {
      const response = await axios.post(
        `${API}/api/emailupdate?phone=${phone}`,
        formData
      );
      if (response.status === 200) {
        toast.success("Email updated successfully");
        localStorage.setItem("useremail", data.email);
        // CloseEmailModal()
        setValue("useremail", data.email);
      } else {
        toast.error("Failed to update email");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while updating email");
    }
  };

  return (
    <>
      <Modal>
        <div className="w-[550px] min-h-[330px] my-4 mx-8 font-extralight font-poppins">
          <p
            className="text-end text-2xl font-medium"
            onClick={() => CloseEmailModal()}
          >
            x
          </p>
          <p className="text-center text-lg my-4">Update Email</p>
          <p className="text-center text-sm lg:mx-12 md:mx-12 mx-4 my-8">
            Enter your new email id (please note we will be sending a
            verification link to your new email id)
          </p>
          <form onSubmit={handleSubmit(onsubmit)}>
            <div className="lg:mx-6 md:mx-6 mx-1">
              <label htmlFor="email" className="text-lg">
                Email
              </label>
              <input
                type="text"
                className={`py-3 pe-0 ps-2 block w-full bg-transparent border-t-transparent border-b border-x-transparent border-b-gray-400 outline-none disabled:pointer-events-none my-3 ${
                  errors.email ? "border-red-500" : ""
                }`}
                placeholder="johndoe@gmail.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div className="flex justify-center my-8">
              <button
                className={`font-normal bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] text-center w-36 py-2.5 my-2`}
                type="submit"
              >
                Verify
              </button>
            </div>
          </form>
        </div>
      </Modal>
      {stepModal && (
        <Modal>
          <div className="w-[550px] min-h-[330px] my-4 mx-8 font-extralight font-poppins">
            <p
              className="text-end text-2xl font-medium"
              onClick={() => handle2Modal()}
            >
              x
            </p>
            <p className="text-center text-lg my-4">Update Email</p>
            <p className="text-center text-normal lg:mx-12 md:mx-12 mx-4 my-16">
              We have sent you a verification link to your email. Please verify
              your email to continue.
            </p>
          </div>
        </Modal>
      )}
    </>
  );
};

export default UpdateEmail;
