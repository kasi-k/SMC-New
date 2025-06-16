import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCaretDown } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { API } from "../../Host";
import { FiPlus } from "react-icons/fi";
import { AiOutlineLoading } from "react-icons/ai";

const schema = yup.object().shape({
  categoryname: yup
    .string()
    .trim()
    .required("Category name is required")
    .transform((value) => value.toLowerCase()),
  subcategoryname1: yup
    .string()
    .trim()
    .required("Sub Category name 1 is required")
    .transform((value) => value.toLowerCase()),
  subcategoryname2: yup
    .string()
    .trim()
    .required("Sub Category name 2 is required")
    .transform((value) => value.toLowerCase()),

});
const CategoryManagement = () => {
    const [isSaving, setIsSaving] = useState(false);



  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) =>{
    console.log(data);
    
  }


  return (
    <>
      <div className="mx-6 my-4 font-poppins h-full">
        <div className="flex justify-between items-center">
        <p className="mb-2 mx-2 mt-4">Add Category</p>
        <p className=" cursor-pointer flex  items-center gap-2 bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] px-4 py-1 rounded-md"><FiPlus />Bulk Upload Users</p>
       </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mx-4 my-6   ">
          <div className="grid gap-2 ">
            <label className="col-span-12 ">
              Category Name <span className=" text-red-600">*</span>
            </label>
          <input
              {...register("categoryname")}
              type="text"
              placeholder="Enter category name"
              className=" col-span-2 bg-white  text-black px-2 py-1.5 outline-none rounded-md "
            />
              <p className="text-red-700 col-span-12 ">{errors.categoryname?.message}</p>
           <label className="col-span-12 ">
             Sub Category 1 Name <span className=" text-red-600">*</span>
            </label>
          <input
              {...register("subcategoryname1")}
              type="text"
              placeholder="Enter sub category name 1"
              className=" col-span-2 bg-white  text-black px-2 py-1.5 outline-none rounded-md mb-2 "
            />
                  <p className="text-red-700 col-span-12 ">{errors.subcategoryname1?.message}</p>
            <label className="col-span-12 ">
             Sub Category 2 Name <span className=" text-red-600">*</span>
            </label>
          <input
              {...register("subcategoryname2")}
              type="text"
              placeholder="Enter sub category name 2"
              className=" col-span-2 bg-white  text-black px-2 py-1.5 outline-none rounded-md "
            />
                  <p className="text-red-700 col-span-12 ">{errors.subcategoryname2?.message}</p>
          </div>
            <div className="flex items-center gap-4 mt-4">
                  <button
                    type="submit"
                    className={`my-6 cursor-pointer text-white bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] px-8 py-1.5 rounded-md ${
                      isSaving ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <div className="flex text-xl gap-2">
                        <AiOutlineLoading className="h-6 w-6 animate-spin" />
                        <p>Saving....</p>
                      </div>
                    ) : (
                      "Save"
                    )}
                  </button>
                  {/* <p  onClick={()=>navigate("/packages")} className={` cursor-pointer text-black bg-white  py-1.5 px-4 rounded-md `}>Cancel</p> */}
                </div>
        </form>
      </div>
    </>
  );
};

export default CategoryManagement;
