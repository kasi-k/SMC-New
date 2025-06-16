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
  packagename: yup
    .string()
    .trim()
    .required("Package name is required")
    .transform((value) => value.toLowerCase()),
  email: yup.string().email().required("Email is required"),
});
const AdduserPackage = () => {
    const [isSaving, setIsSaving] = useState(false);
  const [userPackage, setUserPackage] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPackages();
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data) => {
    const selectedPackage = userPackage.find(
      (plan) => plan.packagename === data.packagename
    );
    if (selectedPackage) {
      const formData = {
        ...data,
        course: selectedPackage.course,
      };
      localStorage.setItem("plan", data.packagename);
      localStorage.setItem("courses", selectedPackage.course);

      try {
        const response = await axios.post(`${API}/api/addusertoplan`, formData);
        navigate("/packages");
      } catch (error) {
        console.log(error);
      }
    } else {
      console.error("Package not found.");
    }
  };
  const fetchPackages = async () => {
    try {
      const response = await axios.get(`${API}/api/getsubscriptionplan`);
      if (Array.isArray(response.data.plans)) {
        setUserPackage(response.data.plans);
      } else {
        console.error(
          "Expected an array of package options, but got:",
          response.data
        );
        setUserPackage([]); // Fallback to an empty array if the structure is unexpected
      }
    } catch (error) {
      console.error("Error fetching taxes:", error);
    }
  };
  const handlePackageChange = (event) => {
    const selectedPackageName = event.target.value;

    // Find the selected package object
    const selectedPackage = userPackage.find(
      (plan) => plan.packagename === selectedPackageName
    );

    setSelectedPackage(selectedPackage); 
  };
  return (
    <>
      <div className="mx-6 my-4 font-poppins h-full">
        <div className="flex justify-between items-center">
        <p className="mb-2 mx-2 mt-4">Add a user to package</p>
        <p className=" cursor-pointer flex  items-center gap-2 bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] px-4 py-1 rounded-md"><FiPlus />Bulk Upload Users</p>
       </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mx-4 my-6   ">
          <div className="grid gap-2.5 ">
            <label className="col-span-12 ">
              Package Name <span className=" text-red-600">*</span>
            </label>
            <div className="relative inline-block col-span-2 ">
              <select
                {...register("packagename")}
                defaultValue="select"
                className=" w-full bg-white  text-black px-2 py-2 outline-none rounded-md "
                onChange={handlePackageChange}
              >
                <option value="select" disabled>
                  Select Package
                </option>
                {userPackage &&
                  userPackage.map((plan, index) => (
                    <option key={index} value={plan.packagename}>
                      {plan.packagename}
                    </option>
                  ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-5 bg-gray-100 px-4 rounded-lg pointer-events-none outline-none">
                <FaCaretDown className="text-black text-2xl" />
              </div>
            </div>
            <label className="col-span-12 ">
              User Email ID <span className=" text-red-600">*</span>
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="Enter user Email-Id"
              className=" col-span-2 bg-white  text-black px-2 py-1.5 outline-none rounded-md "
            />
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
                  <p  onClick={()=>navigate("/packages")} className={` cursor-pointer text-black bg-white  py-1.5 px-4 rounded-md `}>Cancel</p>
                </div>
        </form>
      </div>
    </>
  );
};

export default AdduserPackage;
