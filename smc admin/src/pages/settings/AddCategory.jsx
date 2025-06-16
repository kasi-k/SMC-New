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
    category: yup.string().trim().required("Category Name is required"),
  })
  .required();

const AddCategory = ({ onClose, fetchCategory }) => {
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
      const response = await axios.post(`${API}/api/category`, formData);

      const responseData = response.data.Category;

      if (response.status === 200) {
        toast.success("New Category added");
        if (onClose) {
          onClose();
          fetchCategory();
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
        <p className="my-8">Add Category</p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4 items-center my-4 "
        >
          <label htmlFor="">
            Category Name <span className="text-red-600">*</span>
          </label>
          <input
            {...register("category")}
            type="text"
            placeholder=" Enter Category Name"
            className="rounded-md w-4/5 py-1.5 px-1 text-black"
          />
          <p className="text-red-700">{errors.category?.message}</p>
          <div className="flex justify-center my-4 w-4/5">
            <button
              type="submit"
              className="bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] w-36 py-1.5 "
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
