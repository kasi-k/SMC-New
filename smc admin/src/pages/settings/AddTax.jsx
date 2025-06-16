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
    taxname: yup.string().trim().required("Tax Name is required"),
    percentage: yup.string().trim().required("Tax percentage is required"),
  })
  .required();

const AddTax = ({ onClose, fetchTax }) => {
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
      const response = await axios.post(`${API}/api/tax`, formData);

      const responseData = response.data.tax;

      if (response.status === 200) {
        toast.success("Tax Added Successfully");
        if (onClose) {
          onClose();
          fetchTax();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="mx-3  ">
      <p className="my-8">Add Tax</p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-4 items-center my-4 "
      >
        <label htmlFor="">
          Tax Name <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          placeholder="select-tax"
          className="rounded-md w-7/12 py-1.5 px-1 text-black "
          {...register("taxname")}
        />
        <p className="text-red-700">{errors.taxname?.message}</p>
        <label className="text-nowrap ">
          Tax Percentage <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          placeholder="select tax"
          className="rounded-md w-7/12 py-1.5 px-1 text-black"
          {...register("percentage")}
        />
        <p className="text-red-700">{errors.percentage?.message}</p>
        <div className="flex justify-center my-4 w-7/12">
          <button
            type="submit"
            className="bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] w-36 py-1.5  "
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTax;
