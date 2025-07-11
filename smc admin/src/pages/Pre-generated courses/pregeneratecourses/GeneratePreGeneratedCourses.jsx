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
  // category: yup.string().required("Category is required"),
  // subCategory1: yup.string().required("Sub Category 1 is required"),
  // subCategory2: yup.string().required("Sub Category 2 is required"),
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
 const languages = [
  { value: "en", label: "English" },
  { value: "ta", label: "Tamil" },
  { value: "ml", label: "Malayalam" },
  { value: "te", label: "Telugu" },
  { value: "kn", label: "Kannada" },
  { value: "mr", label: "Marathi" },
  { value: "ur", label: "Urdu" },
  { value: "gu", label: "Gujarati" },
  { value: "ar", label: "Arabic" },
  { value: "bn", label: "Bengali" },
  { value: "bg", label: "Bulgarian" },
  { value: "zh", label: "Chinese" },
  { value: "hr", label: "Croatian" },
  { value: "cs", label: "Czech" },
  { value: "da", label: "Danish" },
  { value: "nl", label: "Dutch" },
  { value: "et", label: "Estonian" },
  { value: "fi", label: "Finnish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "el", label: "Greek" },
  { value: "he", label: "Hebrew" },
  { value: "hi", label: "Hindi" },
  { value: "hu", label: "Hungarian" },
  { value: "id", label: "Indonesian" },
  { value: "it", label: "Italian" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "lv", label: "Latvian" },
  { value: "lt", label: "Lithuanian" },
  { value: "no", label: "Norwegian" },
  { value: "pl", label: "Polish" },
  { value: "pt", label: "Portuguese" },
  { value: "ro", label: "Romanian" },
  { value: "ru", label: "Russian" },
  { value: "sr", label: "Serbian" },
  { value: "sk", label: "Slovak" },
  { value: "sl", label: "Slovenian" },
  { value: "es", label: "Spanish" },
  { value: "sw", label: "Swahili" },
  { value: "sv", label: "Swedish" },
  { value: "th", label: "Thai" },
  { value: "tr", label: "Turkish" },
  { value: "uk", label: "Ukrainian" },
  { value: "vi", label: "Vietnamese" },
  { value: "ks", label: "Kashmiri" }, // <-- Added Kashmiri
];

  const [processing, setProcessing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories1, setSubCategories1] = useState([]);
  const [subCategories2, setSubCategories2] = useState([]);

  const [category, setCategory] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [subcategory1, setSubCategory1] = useState("");
  const [subcategory1Name, setSubCategory1Name] = useState("");
  const [subcategory2, setSubCategory2] = useState("");
  const [subcategory2Name, setSubCategory2Name] = useState("");

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const watchSubtopic = watch("subtopic");
  const watchCourseType = watch("coursetype");

  // Fetch categories on load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API}/api/getonlyCategory`);
        setCategories(res.data.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch subCategory1 when category changes
  useEffect(() => {
    if (category) {
      const fetchSubCategory1 = async () => {
        try {
          const res = await axios.get(`${API}/api/getbasedOnCategory`, {
            params: { category },
          });
          setSubCategories1(res.data.data || []);
          setSubCategory1(""); // Reset
          setSubCategory1Name("");
          setSubCategory2(""); // Reset
          setSubCategory2Name("");
          setValue("subCategory1", "");
          setValue("subCategory2", "");
        } catch (error) {
          console.error("Error fetching subCategory1:", error);
        }
      };
      fetchSubCategory1();
    } else {
      setSubCategories1([]);
      setSubCategory1("");
      setSubCategory1Name("");
      setSubCategory2("");
      setSubCategory2Name("");
      setValue("subCategory1", "");
      setValue("subCategory2", "");
    }
  }, [category]);

  // Fetch subCategory2 when subCategory1 changes
  useEffect(() => {
    if (subcategory1) {
      const fetchSubCategory2 = async () => {
        try {
          const res = await axios.get(`${API}/api/getbasedOnSubategory1`, {
            params: { subCategory1: subcategory1 },
          });
          setSubCategories2(res.data.data || []);
          setSubCategory2("");
          setSubCategory2Name("");
          setValue("subCategory2", "");
        } catch (error) {
          console.error("Error fetching subCategory2:", error);
        }
      };
      fetchSubCategory2();
    } else {
      setSubCategories2([]);
      setSubCategory2("");
      setSubCategory2Name("");
      setValue("subCategory2", "");
    }
  }, [subcategory1]);

  const onSubmit = async (data) => {
    setProcessing(true);
    const { topic, category, subCategory1, subCategory2, language } = data;
const selectedLanguage = languages.find(l => l.value === language)?.label || language;
    const prompt = `Strictly in ${selectedLanguage}, Generate a list of Strict ${
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
          category:categoryName,
          subCategory1:subcategory1Name,
          subCategory2:subcategory2Name,
        },
      });
    } catch (err) {
      toast.error("Failed to generate course. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className=" mx-6 my-8 font-poppins h-full overflow-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="mx-4 my-6">
        <div className="mx-6 grid gap-4 font-extralight my-8">
          <div className="grid grid-cols-3 gap-6 items-center">
            <select
              value={category}
              onChange={(e) => {
                const selectedId = e.target.value;
                const selectedCat = categories.find(
                  (cat) => cat._id === selectedId
                );

                if (selectedCat) {
                  setCategory(selectedId);
                  setCategoryName(selectedCat.name);
                } else {
                  setCategory("");
                  setCategoryName("");
                }

                // Reset child selects
                setSubCategory1("");
                setSubCategory1Name("");
                setSubCategory2("");
                setSubCategory2Name("");

                setCurrentPage(1);
              }}
              className="w-full bg-white outline-none text-black rounded-md py-2 px-2"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              value={subcategory1}
              onChange={(e) => {
                const selectedId = e.target.value;
                const selectedSC1 = subCategories1.find(
                  (sc1) => sc1._id === selectedId
                );

                if (selectedSC1) {
                  setSubCategory1(selectedId);
                  setSubCategory1Name(selectedSC1.name);
                } else {
                  setSubCategory1("");
                  setSubCategory1Name("");
                }

                // Reset subCategory2
                setSubCategory2("");
                setSubCategory2Name("");

                setCurrentPage(1);
              }}
              className="w-full bg-white outline-none text-black rounded-md py-2 px-2"
              disabled={!category}
            >
              <option value="">All SubCategory1</option>
              {subCategories1.map((sc1) => (
                <option key={sc1._id} value={sc1._id}>
                  {sc1.name}
                </option>
              ))}
            </select>

            <select
              value={subcategory2}
              onChange={(e) => {
                const selectedId = e.target.value;
                const selectedSC2 = subCategories2.find(
                  (sc2) => sc2._id === selectedId
                );

                if (selectedSC2) {
                  setSubCategory2(selectedId);
                  setSubCategory2Name(selectedSC2.name);
                } else {
                  setSubCategory2("");
                  setSubCategory2Name("");
                }

                setCurrentPage(1);
              }}
              className="w-full bg-white outline-none text-black rounded-md py-2 px-2"
              disabled={!subcategory1}
            >
              <option value="">All SubCategory2</option>
              {subCategories2.map((sc2) => (
                <option key={sc2._id} value={sc2._id}>
                  {sc2.name}
                </option>
              ))}
            </select>
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
          <div className="grid grid-cols-3 gap-6 ">
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
