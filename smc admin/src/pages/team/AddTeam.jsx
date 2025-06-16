import React, { useState } from "react";
import Profile from "../../assets/profile.png";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { API } from "../../Host";
import { toast } from "react-toastify";
import { AiOutlineLoading } from "react-icons/ai";
import { useEffect } from "react";

const schema = yup.object().shape({
  fname: yup
    .string()
    .trim()
    .required("First name is required")
    .transform((value) => value.toLowerCase()),
  lname: yup
    .string()
    .required("Last name is required")
    .transform((value) => value.toLowerCase()),
  email: yup
    .string()
    .email("Please Enter a valid Email")
    .trim()
    .required("Email is required"),
  phone: yup.string().required("Please enter mob.no"),
  dob: yup.string().required("Please enter Date of birth"),
  designation: yup.string().required("Please select Designation"),
});
const AddTeam = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [base64Image, setBase64Image] = useState("");
  const [preview, setPreview] = useState(null);
  const [designation, setDesignation] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDesignation();
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      alert("Please select a file!");
      return;
    }
    const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSizeInBytes) {
      alert("File size exceeds 2MB!");
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result;
      setBase64Image(base64String);
      setPreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data) => {
    setIsSaving(true);

    const formData = {
      ...data,
      password: "Admin@123",
      type: "free",
    };
    try {
      const response = await axios.post(`${API}/api/adminsignup`, formData);
      const reAdminId = response.data.userId;

      if (response.status === 200 && selectedFile !== null) {
        const payload = {
          name: selectedFile.name,
          user: reAdminId,
          image: base64Image,
        };

        const response = await axios.post(`${API}/api/images`, payload);
        const responseData = response.data.image;

        toast.success("AdminId and profile Image created Successfully");
        navigate("/team");
      } else toast.success("New Admin created Successfully");
      navigate("/team");
    } catch (error) {
      console.log(
        "error",
        error.response ? error.response.data : error.message
      );
    }
  };
  const fetchDesignation = async () => {
    try {
      const response = await axios.get(`${API}/api/getroles`);
      if (Array.isArray(response.data.role)) {
        setDesignation(response.data.role);
      } else {
        console.error(
          "Expected an array of tax options, but got:",
          response.data
        );
        setDesignation([]); // Fallback to an empty array if the structure is unexpected
      }
    } catch (error) {
      console.error("Error fetching taxes:", error);
    }
  };

  return (
    <>
      <div className="font-extralight my-4">
        <p className=" mx-2 text-lg ">Add a new team</p>
        <hr />
        <div className="mx-12 my-6 space-y-1">
          <img
            src={preview ? preview : Profile}
            alt="Profile"
            className={`w-40 h-40 ${
              preview ? " rounded-3xl object-cover" : ""
            }`}
          />

          <div
            className={`relative text-base  bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] lg:w-40 h-12   my-5  `}
          >
            <p className=" absolute text-lg  py-2.5 text-center right-4">
              Upload Image
            </p>
            <input
              accept=".jpg,.jpeg,.png,.gif"
              type="file"
              onChange={handleFileChange}
              className="opacity-0 w-full h-full"
            />
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-12 md:grid-cols-10 mx-6 gap-6 ">
            <div className="grid col-span-3">
              <label>First Name</label>
              <input
                {...register("fname")}
                type="text"
                placeholder="Enter First name"
                className="outline-none text-black rounded-md py-1.5 px-3 my-3 "
              />
              <p className="text-red-700">{errors.fname?.message}</p>
            </div>
            <div className="grid col-span-3">
              <label>Last Name</label>
              <input
                {...register("lname")}
                type="text"
                placeholder="Enter Last name"
                className="outline-none text-black rounded-md py-1.5 px-3 my-3"
              />
              <p className="text-red-700">{errors.lname?.message}</p>
            </div>
            <div className="grid col-span-3">
              <label>Email</label>
              <input
                {...register("email")}
                type="email"
                placeholder="Enter Email"
                className="outline-none text-black rounded-md py-1.5 px-3 my-3"
              />
              <p className="text-red-700">{errors.email?.message}</p>
            </div>
          </div>
          <div className="grid lg:grid-cols-12 md:grid-cols-10 mx-6 gap-6 my-5">
            <div className="grid col-span-3">
              <label>Phone</label>
              <input
                {...register("phone")}
                type="text"
                className="outline-none text-black rounded-md py-1.5 px-3 my-3"
                placeholder="Enter Mobile Number"
              />
              <p className="text-red-700">{errors.phone?.message}</p>
            </div>
            <div className="grid col-span-3">
              <label>Date Of Birth</label>
              <input
                {...register("dob")}
                type="date"
                className="outline-none text-black rounded-md py-1.5 px-3 my-3"
              />
              <p className="text-red-700">{errors.dob?.message}</p>
            </div>
            <div className="grid col-span-3">
              <label>
                Designation<span className="text-red-600 ">*</span>
              </label>
              <select
                {...register("designation")}
                defaultValue="select"
                className="outline-none text-black rounded-md py-1.5 px-3 my-3"
              >
                <option value="select" disabled>
                  Select Designation
                </option>
                {designation &&
                  designation.map((role, index) => (
                    <option key={index} value={role.designation}>
                      {role.role_name}
                    </option>
                  ))}
              </select>
              <p className="text-red-700">{errors.designation?.message}</p>
            </div>
          </div>
          <button
            type="submit"
            className={`lg:absolute text-lg bottom-10 mx-6   bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] px-16 py-2 ${
              isSaving ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSaving}
          >
            {isSaving ? (
              <div className="flex  text-xl gap-2">
                <AiOutlineLoading className="h-6 w-6 animate-spin" />
                <p>Saving....</p>
              </div>
            ) : (
              "Save"
            )}
          </button>
        </form>{" "}
      </div>
    </>
  );
};

export default AddTeam;
