import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { API } from "../../Host";
import { toast } from "react-toastify";

const schema = yup
  .object()
  .shape({
    priority: yup.string().trim().required("Priority Name is required"),
  })
  .required();

const AddPriority = ({ onClose, fetchPriority }) => {
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
      const response = await axios.post(`${API}/api/priority`, formData);

      const responseData = response.data.Priority;

      if (response.status === 200) {
        toast.success("New Priority Added");
        if (onClose) {
          onClose();
          fetchPriority();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div className="font-extralight mx-3">
        {" "}
        <p className="my-8">Add Priority</p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4 items-center my-4 "
        >
          <label htmlFor="">
            Priority Name <span className="text-red-600">*</span>
          </label>
          <input
            {...register("priority")}
            type="text"
            placeholder=" Enter Priority Name"
            className="text-black rounded-md w-4/5 py-1.5 px-1 "
          />
          <div className="flex justify-center my-4 w-4/5">
            <button
              type="submit"
              className="bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] w-36 py-1.5  "
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPriority;
