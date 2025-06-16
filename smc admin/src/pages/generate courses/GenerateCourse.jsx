import React, { useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API } from "../../Host";
import axios from "axios";

const GenerateCourse = () => {
  const navigate = useNavigate();
  const maxSubtopics = 5;
  const [formValues, setFormValues] = useState([{ sub: "" }]);
  const [selectedValue, setSelectedValue] = useState("4");
  const [selectedType, setSelectedType] = useState("Text & Image Course");
  const [paidMember, setPaidMember] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [endDate, setEndDate] = useState("");
  const [courses, setCourses] = useState([]);
  const [Count, setCount] = useState(0);

  const handleRadioChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleRadioChangeType = (event) => {
    setSelectedType(event.target.value);
  };
  const handleViewOwnCourse = () => {
    navigate("/viewcourse");
  };

  let handleChange = (i, e) => {
    let newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    setFormValues(newFormValues);
  };

  let addFormFields = () => {
    if (formValues.length < maxSubtopics) {
      setFormValues([...formValues, { sub: "" }]);
    } else {
      toast.error("You can only add 5 sub topics");
    }
  };

  let removeFormFields = () => {
    let newFormValues = [...formValues];
    newFormValues.pop();
    setFormValues(newFormValues);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const subtopics = [];
    setProcessing(true);

    formValues.forEach((subtopic) => {
      subtopics.push(subtopic.sub);
    });

    const mainTopic = document.getElementById("topic1").value;

    if (!mainTopic.trim()) {
      setProcessing(false);
      toast.error("Please fill in all required fields");
      return;
    }

    if (subtopics.length === 0) {
      setProcessing(false);
      toast.error("Please fill in all required fields");
      return;
    }

    const prompt = `Generate a list of Strict ${selectedValue} topics and any number sub topic for each topic for main title ${mainTopic.toLowerCase()}, everything in single line. Those ${selectedValue} topics should Strictly include these topics :- ${subtopics
      .join(", ")
      .toLowerCase()}. Strictly Keep theory, youtube, image field empty. Generate in the form of JSON in this format {
        "${mainTopic.toLowerCase()}": [
   {
   "title": "Topic Title",
   "subtopics": [
    {
    "title": "Sub Topic Title",
    "theory": "",
    "youtube": "",
    "image": "",
    "done": false
    },
    {
    "title": "Sub Topic Title",
    "theory": "",
    "youtube": "",
    "image": "",
    "done": false
    }
   ]
   },
   {
   "title": "Topic Title",
   "subtopics": [
    {
    "title": "Sub Topic Title",
    "theory": "",
    "youtube": "",
    "image": "",
    "done": false
    },
    {
    "title": "Sub Topic Title",
    "theory": "",
    "youtube": "",
    "image": "",
    "done": false
    }
   ]
   }
  ]
  }`;

    sendPrompt(prompt, mainTopic, selectedType);
  };

  async function sendPrompt(prompt, mainTopic, selectedType) {
    const dataToSend = {
      prompt: prompt,
    };

    try {
      const res = await axios.post(`${API}/api/prompt`, dataToSend);
      const generatedText = res.data.generatedText;
      const cleanedJsonString = generatedText
        .replace(/```json/g, "")
        .replace(/```/g, "");
      try {
        const parsedJson = JSON.parse(cleanedJsonString);

        setProcessing(false);
        navigate("/topics", {
          state: {
            jsonData: parsedJson,
            mainTopic: mainTopic.toLowerCase(),
            type: selectedType.toLowerCase(),
          },
        });
      } catch (error) {
        //sendPrompt(prompt, mainTopic, selectedType);
      }
    } catch (error) {
      //sendPrompt(prompt, mainTopic, selectedType);
    }
  }

  return (
    <>
      <div className="flex justify-end mx-1 my-2">
        <button
          onClick={handleViewOwnCourse}
          className=" font-extralight bg-gradient-to-r from-[#3D03FA] to-[#A71CD2]  py-1 px-2"
        >
          View Own Courses
        </button>
      </div>
      <hr />
      <div className="my-5 text-white font-poppins ">
        <p className="text-center font-extralight">Generate Course</p>
        <form onSubmit={handleSubmit}>
          <div className=" grid grid-cols-12 gap-3 mx-10 mt-6">
            <div className="lg:col-span-6 md:col-span-6 col-span-12">
              <p className="text-sm font-extralight">
                Type the topic on which you want to Generate course.
              </p>
              <div className="flex flex-col py-8 gap-1">
                <label htmlFor="topic1" value="Topic">
                  Course Topic <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Topic"
                  id="topic1"
                  className="py-2 px-4  rounded-md  text-black shadow-md outline-none lg:w-3/4 md:w-full w-full"
                />
              </div>
              <p className="text-sm font-extralight">
                Select the number of Subtopics you want this course to be spread
                across.
              </p>
              <p className="text-lg py-2">
                No of Subtopic <span className="text-red-600">*</span>
              </p>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="value"
                    id="4"
                    value="4"
                    onChange={handleRadioChange}
                    checked={selectedValue === "4"}
                    className="hidden peer"
                  />
                  <label
                    htmlFor="4"
                    className="flex items-center cursor-pointer"
                  >
                    <span className="w-4 h-4 border-2 border-gray-400 rounded-sm flex items-center justify-center peer-checked:border-blue-500 peer-checked:bg-blue-500">
                      <span
                        className={`w-3 h-3  ${
                          selectedValue === "4" ? "bg-white" : "hidden"
                        }`}
                      ></span>
                    </span>
                    <span className="ml-2">5</span>
                  </label>
                </div>

                <div className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="value"
                    id="7"
                    value="7"
                    onChange={handleRadioChange}
                    checked={selectedValue === "7"}
                    className="hidden peer"
                  />
                  <label
                    htmlFor="7"
                    className="flex items-center cursor-pointer"
                  >
                    <span className="w-4 h-4 border-2 border-gray-400 rounded-sm flex items-center justify-center peer-checked:border-blue-500 peer-checked:bg-blue-500">
                      <span
                        className={`w-3 h-3  ${
                          selectedValue === "7" ? "bg-white" : "hidden"
                        }`}
                      ></span>
                    </span>
                    <span className="ml-2">10</span>
                  </label>
                </div>
              </div>
              <p className="text-sm font-extralight py-5">
                You can enter a list of subtopics, which are the specifics you
                want to learn. You can leave this blank if you want our AI to
                generate the Sub Topics.
              </p>
              <div className="flex flex-col py-1 gap-1 ">
                <label htmlFor="subtopic" value="Sub Topic" className="text-lg">
                  Enter Subtopic<span className="text-red-600">*</span>
                </label>
                {formValues.map((element, index) => (
                  <div key={index}>
                    <input
                      name="sub"
                      value={element.sub}
                      onChange={(e) => handleChange(index, e)}
                      className="py-2 px-4 rounded-md text-black shadow-md outline-none lg:w-3/4 md:w-full w-full my-1"
                      placeholder="Enter Subtopic"
                      type="text"
                    />
                  </div>
                ))}

                <div className={` flex flex-wrap gap-3 `}>
                  <p
                    className={` text-base text-center bg-gradient-to-r from-[#3D03FA] to-[#A71CD2]  py-2.5 ${
                      formValues.length <= 1
                        ? "lg:w-3/4 md:w-full w-full"
                        : "lg:w-3/4 md:w-full w-full"
                    }`}
                    onClick={() => addFormFields()}
                  >
                    Add Subtopic
                  </p>
                  {formValues.length > 1 && (
                    <p
                      className=" text-base text-center bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] lg:w-3/4 md:w-full w-full  py-2.5 "
                      onClick={() => removeFormFields()}
                    >
                      Remove Subtopic
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className=" lg:col-span-6 md:col-span-6 col-span-12 lg:mx-10 md:mx-10">
              <p className="text-sm font-extralight">
                Choose your course content type
              </p>
              <p className="text-lg py-2">
                Course Type <span className="text-red-600">*</span>
              </p>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="value1"
                    id="textcourse"
                    value="Text & Image Course"
                    onChange={handleRadioChangeType}
                    checked={selectedType === "Text & Image Course"}
                    className="hidden peer"
                  />
                  <label
                    htmlFor="textcourse"
                    className="flex items-center cursor-pointer"
                  >
                    <span className="w-4 h-4 border-2 border-gray-400 rounded-sm flex items-center justify-center peer-checked:border-blue-500 peer-checked:bg-blue-500">
                      <span
                        className={`w-3 h-3  ${
                          selectedType === "Text & Image Course"
                            ? "bg-white"
                            : "hidden"
                        }`}
                      ></span>
                    </span>
                    <span className="ml-2">Theory & Image Course</span>
                  </label>
                </div>

                <div className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="value1"
                    id="videocourse"
                    value="Video & Text Course"
                    onChange={handleRadioChangeType}
                    checked={selectedType === "Video & Text Course"}
                    className="hidden peer"
                  />
                  <label
                    htmlFor="videocourse"
                    className="flex items-center cursor-pointer"
                  >
                    <span className="w-4 h-4 border-2 border-gray-400 rounded-sm flex items-center justify-center peer-checked:border-blue-500 peer-checked:bg-blue-500">
                      <span
                        className={`w-3 h-3  ${
                          selectedType === "Video & Text Course"
                            ? "bg-white"
                            : "hidden"
                        }`}
                      ></span>
                    </span>
                    <span className="ml-2">Video & Theory Course</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  className={` text-base bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] lg:w-1/2 md:w-3/4 w-full py-2.5 my-5 `}
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
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default GenerateCourse;
