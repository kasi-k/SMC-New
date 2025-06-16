import React, { useEffect, useState } from "react";
import Profile from "../../assets/profile.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { API, formatDate2 } from "../../Host";
import { toast } from "react-toastify";
import UpdateImage from "../users/UpdateImage";

const EditSchema = yup.object().shape({
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

const EditTeam = () => {
  const [isProfileModal, setIsProfileModal] = useState(false);
  const location = useLocation();
  const userId = location.state?.userId;
  const [userData, setUserData] = useState({});
  const [userImage, setUserImage] = useState({});
  const [designation, setDesignation] = useState([]);
  const [emailId, setEmailId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDesignation();
    fetchTeam();
    fetchImage();
  }, [isProfileModal]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(EditSchema),
  });

  const fetchTeam = async () => {
    try {
      const response = await axios.get(`${API}/api/getadminbyid/${userId}`);
      const responseData = response.data.user;
      setUserData(responseData);

      const data = response.data.user;

      setValue("fname", data.fname);
      setValue("lname", data.lname);
      setValue("dob", data.dob);
      setValue("email", data.email);
      setEmailId(data.email);
      setValue("phone", data.phone);
      setValue("designation", data.designation);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchImage = async () => {
    try {
      const response = await axios.get(
        `${API}/api/getimagebyid?user=${userId}`
      );
      const responseData = response.data.user;
      setUserImage(responseData);
    } catch (error) {
      console.log(error);
    }
  };
  const CloseProfileModal = () => {
    setIsProfileModal(!isProfileModal);
  };

  const onSubmit = async (data) => {
    const formData = {
      ...data,
    };
    try {
      const response = await axios.put(
        `${API}/api/adminupdate/${userId}`,
        formData
      );

      if (response.status === 200) {
        toast.success("Admin Updated Successfully");
        navigate("/team");
      }
    } catch (error) {
      console.error("Error updating category:", error);
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
        <p className=" mx-2 text-lg ">Edit Team</p>
        <hr />
        <div className="mx-2 my-4 space-y-1">
          <button
            onClick={() =>
              navigate(`/changepassword`, {
                state: {
                  adminemail: emailId,
                },
              })
            }
            className=" float-end bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] px-5 py-2"
          >
            Change Password
          </button>
          <div className="mx-10 ">
            <img
              src={userImage?.image ? userImage.image : Profile}
              alt="Profile"
              className={`w-40 h-40 ${
                userImage?.image ? " rounded-3xl object-cover" : ""
              }`}
            />
            <button
              className={` text-base  bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] lg:w-40 md:w-40 w-40 py-2.5 my-5 `}
              onClick={() => setIsProfileModal(true)}
            >
              Change Image
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mx-2 ">
            <p className="my-2">Personal Information</p>
            <hr />

            <div className="grid lg:grid-cols-12 my-6 mx-4 gap-4 text-slate-400">
              <div className="col-span-3">
                <div className="flex flex-col">
                  <label className="mb-7 ">First Name</label>
                  <input
                    type="text"
                    id="fname"
                    className=" outline-none bg-transparent lg:w-2/3 md:w-1/2 w-28 px-2"
                    {...register("fname")}
                  />
                  <p className="text-red-700">{errors.fname?.message}</p>
                </div>
                <hr className="lg:w-2/3 md:w-1/2 w-20" />
              </div>
              <div className="col-span-3 ">
                <div className="flex flex-col">
                  <label className="mb-7 ">Last Name</label>
                  <input
                    type="text"
                    id="lname"
                    className=" outline-none bg-transparent lg:w-2/3 md:w-1/2 w-28 px-2 "
                    {...register("lname")}
                  />
                  <p className="text-red-700">{errors.lname?.message}</p>
                </div>
                <hr className="lg:w-2/3 md:w-1/2 w-20" />
              </div>
              <div className="col-span-3">
                <div className="flex flex-col">
                  <label className="mb-6 ">Date Of Birth</label>
                  <input
                    type="date"
                    className="outline-none bg-transparent lg:w-2/3 md:w-1/2 w-28 "
                    {...register("dob")}
                  />
                  <p className="text-red-700">{errors.dob?.message}</p>
                </div>
                <hr className="lg:w-2/3 md:w-1/2 w-28" />
              </div>
              <div className="col-span-3">
                <div className="flex flex-col">
                  <label className="mb-3 ">Designation</label>
                  <select
                    {...register("designation")}
                    defaultValue="select"
                    className=" w-2/3 outline-none  rounded-md py-1.5 px-2  bg-transparent"
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
                <hr className="lg:w-2/3 md:w-1/2 w-28" />
              </div>
            </div>
            <p className="my-2">Contact Information</p>
            <hr />
            <div className="font-extralight grid lg:grid-cols-3 mx-2 my-8 gap-4">
              <div>
                <div className="flex flex-col">
                  <label className="mb-6">Email</label>
                  <input
                    type="email"
                    id="email"
                    className=" bg-transparent outline-none lg:w-54 md:w-56 w-48 px-2"
                    {...register("email")}
                  />
                  <p className="text-red-700">{errors.email?.message}</p>
                </div>
                <hr className="lg:w-54 md:w-56 w-48 mb-6" />
              </div>
              <div>
                <div className="flex flex-col">
                  <label className="mb-6">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    className="bg-transparent  outline-none lg:w-1/2 md:w-56 w-48 px-2"
                    {...register("phone")}
                  />
                  <p className="text-red-700">{errors.phone?.message}</p>
                </div>
                <hr className="lg:w-1/2 md:w-56 w-48 mb-6" />
              </div>
            </div>
            <button
              type="submit"
              className=" mx-2 bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] px-16 py-2"
            >
              Save
            </button>
          </div>
        </form>
      </div>
      {isProfileModal && <UpdateImage CloseProfileModal={CloseProfileModal} />}
    </>
  );
};

export default EditTeam;
