import { useEffect, useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCaretDown } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { API } from "../../../Host";
import { toast } from "react-toastify";
import { AiOutlineLoading } from "react-icons/ai";

const schema = yup.object().shape({
  category: yup.string().required("Category is required"),
  subCategory1: yup.string().required("Sub Category 1 is required"),
  subCategory2: yup.string().required("Sub Category 2 is required"),
  topic: yup.string().required("Topic is required"),
  language: yup.string().required("Language is required"),

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
      className="bg-white outline-none text-black rounded-md py-1.5 px-2"
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

const GeneratePreGeneratedCourses = () => {
  const [languages, setLanguages] = useState([
    { value: "English", label: "English" },
    { value: "Hindi", label: "Hindi" },
    { value: "Tamil", label: "Tamil" },
  ]);

  const [processing, setProcessing] = useState(false);
  const [options, setOptions] = useState([]);
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


  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const response = await axios.get(`${API}/api/getcategorycourse`);
      
      if (Array.isArray(response.data.cate)) {
        setOptions(response.data.cate);
      } else {
        console.error(
          "Expected an array of  options, but got:",
          response.data
        );
        setOptions([]);
      }
    } catch (error) {
      console.error("Error fetching taxes:", error);
    }
  };


  const onSubmit = async (data) => {
    setProcessing(true);
    const { topic, category, subCategory1, subCategory2, language } = data;
    const prompt = `Strictly in ${language}, Generate a list of Strict ${
      data.subtopic
    } topics and any number of subtopics for each topic under:

- Main Topic: ${topic.toLowerCase()}.
Everything in a single line. Generate JSON format as:
{
  "${topic.toLowerCase()}": [
    {
      "title": "Topic Title",
      "subtopics": [
        { "title": "Sub Topic Title", "theory": "", "youtube": "", "image": "", "done": false }
      ]
    }
  ]
}`;

    try {
      const res = await axios.post(`${API}/api/prompt`, { prompt });
      const cleaned = res.data.generatedText.replace(/```json|```/g, "");
      const json = JSON.parse(cleaned);

     

      navigate("/listpregeneratecourses", {
        state: {
          jsonData: json,
          mainTopic: topic.toLowerCase(),
          type: data.coursetype,
          lang: data.language,
          category,
          subCategory1,
          subCategory2,
        },
      });
    } catch (err) {
      toast.error("Failed to generate course. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className=" mx-6 my-8 font-poppins h-full">
      <form onSubmit={handleSubmit(onSubmit)} className="mx-4 my-6">
        <div className="mx-6 grid gap-4 font-extralight my-8">
          <div className="grid grid-cols-3 gap-6 items-center">
            <SelectField
              label="Category Name"
              register={register}
              name="category"
              options={options.map((category) => ({
                value: category.category,
                label: category.category,
              }))}
              error={errors.category?.message}
            />
            <SelectField
              label="Sub Category 1"
              register={register}
              name="subCategory1"
                options={options.map((category) => ({
                value: category.subCategory1,
                label: category.subCategory1,
              }))}
              error={errors.subCategory1?.message}
            />
            <SelectField
              label="Sub Category 2"
              register={register}
              name="subCategory2"
              options={options.map((category) => ({
                value: category.subCategory2,
                label: category.subCategory2,
              }))}
              error={errors.subCategory2?.message}
            />
          </div>
          <div>
            <InputField
              label="Topic"
              register={register}
              name="topic"
              placeholder="Enter topic name"
              error={errors.topic?.message}
            />
          </div>
          <div className="grid grid-cols-4 gap-4 items-center">
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
          </div>
          <div className="grid grid-cols-3 gap-6 items-center">
            <SelectField
              label="Language"
              register={register}
              name="language"
              options={languages}
              error={errors.language?.message}
            />

            {/* <InputField
              label="Thumbnail"
              register={register}
              name="thumbnail"
              error={errors.duration?.message}
            /> */}
          </div>
        </div>
        <div className="">
          <button
            className={`  bg-cyan-300 text-black mx-6 px-4 py-1.5 rounded-sm`}
            type="submit"
          >
            {processing ? (
              <span className="flex justify-center gap-3">
                {" "}
                <AiOutlineLoading className="h-6 w-6 animate-spin" />{" "}
                <p>Generating ....</p>
              </span>
            ) : (
              "Generate Course"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GeneratePreGeneratedCourses;
