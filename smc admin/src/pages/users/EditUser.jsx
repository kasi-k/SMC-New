import React, { useEffect, useState } from "react";
import Profile from "../../assets/profile.png";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { API } from "../../Host";
import { toast } from "react-toastify";
import { AiOutlineLoading } from "react-icons/ai";
import { FaCaretDown } from "react-icons/fa";

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
  plan: yup
    .string()
    .oneOf(["monthly", "quarterly", "halfYearly", "annual"], "Please select a valid plan")
    .required("Please select a plan"),
  city: yup
    .string()
    .oneOf(["monthly", "quarterly", "halfYearly", "annual"], "Please select a valid city")
    .required("Please select a city"),
  state: yup
    .string()
    .oneOf(["monthly", "quarterly", "halfYearly", "annual"], "Please select a valid state")
    .required("Please select a state"),
  country: yup
    .string()
    .oneOf(["monthly", "quarterly", "halfYearly", "annual"], "Please select a valid country")
    .required("Please select a country"),
  zipcode: yup
    .string()
    .oneOf(["monthly", "quarterly", "halfYearly", "annual"], "Please select a valid zip code")
    .required("Please select a zip code"),
  addressline1: yup.string().required("Address Line 1 is required"),
  addressline2: yup.string().required("Address Line 2 is required"),
});

const InputField = ({
  label,
  register,
  name,
  type = "text",
  error,
  ...rest
}) => (
  <div className="grid gap-2">
    <label className="text-lg">
      {label} <span className="text-red-600">*</span>
    </label>
    <input
      {...register(name)}
      type={type}
      className="bg-white outline-none text-black rounded-md py-2 px-2"
      {...rest}
    />
    <p className="text-red-700">{error}</p>
  </div>
);

const SelectField = ({ label, register, name, options, error }) => (
  <div className="grid gap-2">
    <label className="text-lg">
      {label} <span className="text-red-600">*</span>
    </label>
    <div className="relative ">
      <select
        defaultValue=""
        {...register(name)}
        className="w-full bg-white outline-none text-black rounded-md py-2 px-2"
      >
        <option value="" disabled>
          Select {label}
        </option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <div className="absolute inset-y-0 right-0 flex items-center pr-5 bg-gray-100 px-4 rounded-lg pointer-events-none outline-none">
        <FaCaretDown className="text-black text-2xl" />
      </div>
    </div>
    <p className="text-red-700">{error}</p>
  </div>
);
const EditUser = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API}/api/getusersbyid?id=${userId}`);
      const responseData = response.data.user;
      setUserData(responseData);
      const data = response.data.user;
      setValue("fname", data.fname);
      setValue("lname", data.lname);
      setValue("dob", data.dob);
      setValue("email", data.email);
      setValue("phone", data.phone);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (data) => {
    const formData = {
      ...data,
    };
    toast.success("User updated successfully");
    navigate("/users");
  };

  return (
    <>
      <div className="font-poppins  h-full  mx-6">
        <p className=" mx-2 text-lg  mt-6">Edit user</p>
        <form onSubmit={handleSubmit(onSubmit)} className="mx-4 ">
          <div className="mx-6 grid gap-2 font-extralight my-8">
            <div className="grid grid-cols-3 gap-8 items-center">
              <InputField
                label="First Name"
                register={register}
                name="fname"
                placeholder="Enter first name"
                error={errors.fname?.message}
              />
              <InputField
                label="Last Name"
                register={register}
                name="lname"
                placeholder="Enter last Name"
                error={errors.lname?.message}
              />
              <InputField
                label="Email"
                register={register}
                name="email"
                placeholder="Enter email"
                error={errors.email?.message}
              />
            </div>
            <div className="grid grid-cols-3 gap-8 items-center">
              <InputField
                label="Phone"
                register={register}
                name="phone"
                placeholder="Enter phone"
                error={errors.phone?.message}
              />
              <InputField
                label="Date Of Birth"
                register={register}
                name="dob"
                type="date"
                error={errors.dob?.message}
              />
              <SelectField
                label="Plan "
                register={register}
                name="plan"
                options={[
                  { value: "monthly", label: "Monthly" },
                  { value: "quarterly", label: "Quarterly" },
                  { value: "halfYearly", label: "Half-Yearly" },
                  { value: "annual", label: "Annual" },
                ]}
                error={errors.plan?.message}
              />
            </div>
            <div className="grid grid-cols-3 gap-8 items-center">
              <InputField
                label="Address Line 1"
                register={register}
                name="addressline1"
                placeholder="Enter address line 1"
                error={errors.addressline1?.message}
              />
              <InputField
                label="Address Line 2"
                register={register}
                name="addressline2"
                placeholder="Enter address line 2"
                error={errors.addressline2?.message}
              />
              <SelectField
                label="City "
                register={register}
                name="city"
                options={[
                  { value: "monthly", label: "Monthly" },
                  { value: "quarterly", label: "Quarterly" },
                  { value: "halfYearly", label: "Half-Yearly" },
                  { value: "annual", label: "Annual" },
                ]}
                error={errors.city?.message}
              />
            </div>
            <div className="grid grid-cols-3 gap-8 items-center">
              <SelectField
                label="State "
                register={register}
                name="state"
                options={[
                  { value: "monthly", label: "Monthly" },
                  { value: "quarterly", label: "Quarterly" },
                  { value: "halfYearly", label: "Half-Yearly" },
                  { value: "annual", label: "Annual" },
                ]}
                error={errors.state?.message}
              />
              <SelectField
                label="Country "
                register={register}
                name="country"
                options={[
                  { value: "monthly", label: "Monthly" },
                  { value: "quarterly", label: "Quarterly" },
                  { value: "halfYearly", label: "Half-Yearly" },
                  { value: "annual", label: "Annual" },
                ]}
                error={errors.city?.message}
              />
              <SelectField
                label="Zip Code "
                register={register}
                name="zipcode"
                options={[
                  { value: "monthly", label: "Monthly" },
                  { value: "quarterly", label: "Quarterly" },
                  { value: "halfYearly", label: "Half-Yearly" },
                  { value: "annual", label: "Annual" },
                ]}
                error={errors.zipcode?.message}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
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
                  <p>Updating....</p>
                </div>
              ) : (
                "Update"
              )}
            </button>
            <p
              onClick={() => navigate("/users")}
              className={` cursor-pointer text-black bg-white  py-1.5 px-4 rounded-md `}
            >
              Cancel
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditUser;
