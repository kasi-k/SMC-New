import { useEffect, useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCaretDown } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { API } from "../../Host";
import { toast } from "react-toastify";
import { AiOutlineLoading } from "react-icons/ai";

const schema = yup.object().shape({
  paymentId: yup.string().trim().required("Razorpay ID is required"),
  packagename: yup.string().trim().required("Package name is required"),
  duration: yup.string().trim().required("Plan Duration is required"),
  inr: yup.number().required("Price in INR required"),
  course: yup.string().trim().required("Courses are required"),
  tax: yup.number().required("Tax is required"),
  subtopic: yup
    .string()
    .oneOf(["5", "10"], "Please select a valid number of subtopics")
    .required("Please select the number of subtopics"),
  coursetype: yup
    .string()
    .oneOf(
      ["Text & Image Course", "Video & Text Course"],
      "Please select a valid course type"
    )
    .required("Please select the course type"),
  preCourses: yup
    .string()
    .oneOf(["Yes", "No"], "Please select Yes or No for Pre-Generated Courses")
    .required("Pre-Generated Courses selection is required"),
  studyGroupAccess: yup
    .string()
    .oneOf(["Yes", "No"], "Please select Yes or No for Study Group")
    .required("Study Group selection is required"),
  quizAccess: yup
    .string()
    .oneOf(["Yes", "No"], "Please select Yes or No for Quiz Access")
    .required("Quiz Access selection is required"),
});

// Reusable Input Component
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
      className="bg-white outline-none text-black rounded-md py-1.5 px-2"
      {...rest}
    />
    <p className="text-red-700">{error}</p>
  </div>
);

// Reusable Select Component
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

const RadioButtonGroup = ({
  label,
  register,
  name,
  options,
  error,
  watchValue,
}) => (
  <div className="grid gap-2">
    <p className="text-lg">
      {label} <span className="text-red-600">*</span>
    </p>
    <div className="flex flex-col space-y-1">
      {options.map((option) => {
        const id = `${name}-${option.value}`;
        return (
          <div className="flex items-center cursor-pointer" key={option.value}>
            <input
              {...register(name)}
              type="radio"
              id={id}
              value={option.value}
              className="hidden peer"
            />
            <label htmlFor={id} className="flex items-center cursor-pointer">
              <span className="w-4 h-4 border-2 border-gray-400 rounded-sm flex items-center justify-center peer-checked:border-blue-500 peer-checked:bg-blue-500">
                <span
                  className={`w-3 h-3 ${
                    watchValue === option.value ? "bg-white" : "hidden"
                  }`}
                />
              </span>
              <span className="ml-2">{option.label}</span>
            </label>
          </div>
        );
      })}
    </div>
    <p className="text-red-700">{error}</p>
  </div>
);

const AddPackage = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [optionsTax, setOptionsTax] = useState([]);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const watchSubtopic = watch("subtopic");
  const watchCourseType = watch("coursetype");
  const watchPreGenerated = watch("preCourses");
  const watchStudyGroup = watch("studyGroupAccess");
  const watchQuizAccess = watch("quizAccess");

  useEffect(() => {
    fetchTaxOptions();
  }, []);

  const fetchTaxOptions = async () => {
    try {
      const response = await axios.get(`${API}/api/gettax`);
      if (Array.isArray(response.data.tax)) {
        setOptionsTax(response.data.tax);
      } else {
        console.error(
          "Expected an array of tax options, but got:",
          response.data
        );
        setOptionsTax([]);
      }
    } catch (error) {
      console.error("Error fetching taxes:", error);
    }
  };

  const onSubmit = async (data) => {
    console.log(data);
    
    setIsSaving(true);
    const formData = {
      ...data,
      packagename: data.packagename.toLowerCase(),
    };
    try {
      const response = await axios.post(
        `${API}/api/subscriptionplan`,
        formData
      );

      if (response.status === 200) {
        toast.success("Package created Successfully");
        navigate("/packages");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className=" mx-6 my-8 font-poppins h-full">
      <p className="mb-2">Add a New Package</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mx-4 my-6">
        <div className="mx-6 grid gap-12 font-extralight my-8">
          <div className="grid grid-cols-3 gap-6 items-center">
            <InputField
              label="Package Name"
              register={register}
              name="packagename"
              placeholder="Enter Package name"
              error={errors.packagename?.message}
            />
            <SelectField
              label="Plan Renewal"
              register={register}
              name="duration"
              options={[
                { value: "monthly", label: "Monthly" },
                { value: "quarterly", label: "Quarterly" },
                { value: "halfYearly", label: "Half-Yearly" },
                { value: "annual", label: "Annual" },
              ]}
              error={errors.duration?.message}
            />
            <InputField
              label="Package Price INR"
              register={register}
              name="inr"
              placeholder="Enter Price In INR"
              error={errors.inr?.message}
            />
          </div>
          <div className="grid grid-cols-3 gap-4 items-center">
            <InputField
              label="No of Courses"
              register={register}
              name="course"
              type="number"
              placeholder="00"
              error={errors.course?.message}
            />
            <SelectField
              label="Tax"
              register={register}
              name="tax"
              options={optionsTax.map((tax) => ({
                value: tax.percentage,
                label: `${tax.percentage}%`,
              }))}
              error={errors.tax?.message}
            />
            <InputField
              label="Razorpay ID"
              register={register}
              name="paymentId"
              placeholder="Enter Razorpay ID"
              error={errors.razorpay?.message}
            />
          </div>
          <div className="grid grid-cols-5 gap-4 items-center">
            <RadioButtonGroup
              label="No of Subtopic"
              register={register}
              name="subtopic"
              options={[
                { value: "5", label: "05" },
                { value: "10", label: "10" },
              ]}
              error={errors.subtopic?.message}
              watchValue={watchSubtopic}
            />
            <RadioButtonGroup
              label="Course Type"
              register={register}
              name="coursetype"
              options={[
                {
                  value: "Text & Image Course",
                  label: "Theory & Image Course",
                },
                {
                  value: "Video & Text Course",
                  label: "Video & Theory Course",
                },
              ]}
              error={errors.coursetype?.message}
              watchValue={watchCourseType}
            />
            <RadioButtonGroup
              label="Pre-Generated Courses"
              register={register}
              name="preCourses"
              options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]}
              error={errors.preCourses?.message}
              watchValue={watchPreGenerated}
            />
            <RadioButtonGroup
              label="Study Group"
              register={register}
              name="studyGroupAccess"
              options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]}
              error={errors.studyGroupAccess?.message}
              watchValue={watchStudyGroup}
            />
            <RadioButtonGroup
              label="Quiz Access"
              register={register}
              name="quizAccess"
              options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]}
              error={errors.quizAccess?.message}
              watchValue={watchQuizAccess}
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
                <p>Saving....</p>
              </div>
            ) : (
              "Save"
            )}
          </button>
          <p
            onClick={() => navigate("/packages")}
            className={` cursor-pointer text-black bg-white  py-1.5 px-4 rounded-md `}
          >
            Cancel
          </p>
        </div>
      </form>
    </div>
  );
};

export default AddPackage;
