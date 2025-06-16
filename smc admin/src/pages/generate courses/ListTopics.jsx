import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API } from "../../Host";
import { toast } from "react-toastify";
import { AiOutlineLoading } from "react-icons/ai";

const ListTopics = () => {
  const { state } = useLocation();
  const [processing, setProcessing] = useState(false);
  const { jsonData, mainTopic, type } = state || {};
  const navigate = useNavigate();

  useEffect(() => {
    if (!jsonData) {
      navigate("/create");
    }
  }, []);

  const redirectform = () => {
    navigate("/create");
  };

  function redirectCourse() {
    const mainTopicData = jsonData[mainTopic][0];

    const firstSubtopic = mainTopicData.subtopics[0];

    if (type === "video & text course") {
      const query = `${firstSubtopic.title} ${mainTopic} in english`;
      sendVideo(query, firstSubtopic.title);
      setProcessing(true);
    } else {
      const prompt = `Explain me about this subtopic of ${mainTopic} with examples :- ${firstSubtopic.title}. Please Strictly Don't Give Additional Resources And Images.`;
      const promptImage = `Example of ${firstSubtopic.title} in ${mainTopic}`;
      setProcessing(true);
      sendPrompt(prompt, promptImage);
    }
  }

  async function sendPrompt(prompt, promptImage) {
    const dataToSend = {
      prompt: prompt,
    };
    try {
      const postURL = API + "/api/generate";
      const res = await axios.post(postURL, dataToSend);
      const generatedText = res.data.text;
      const htmlContent = generatedText;

      try {
        const parsedJson = htmlContent;
        sendImage(parsedJson, promptImage);
      } catch (error) {
        sendPrompt(prompt, promptImage);
      }
    } catch (error) {
      sendPrompt(prompt, promptImage);
    }
  }

  async function sendImage(parsedJson, promptImage) {
    const dataToSend = {
      prompt: promptImage,
    };
    try {
      const postURL = API + "/api/image";
      const res = await axios.post(postURL, dataToSend);
      try {
        const generatedText = res.data.url;
        sendData(generatedText, parsedJson);
        setProcessing(false);
      } catch (error) {
        sendImage(parsedJson, promptImage);
      }
    } catch (error) {
      sendImage(parsedJson, promptImage);
    }
  }

  async function sendData(image, theory) {
    jsonData[mainTopic][0].subtopics[0].theory = theory;
    jsonData[mainTopic][0].subtopics[0].image = image;

    const user = localStorage.getItem("user");
    const fname = localStorage.getItem("fname");
    const email = localStorage.getItem("email");
    const phone = localStorage.getItem("phone");
    const lname = localStorage.getItem("lname");
    const content = JSON.stringify(jsonData);
    const postURL = API + "/api/course";
    const response = await axios.post(postURL, {
      user,
      fname,
      lname,
      email,
      phone,
      content,
      type,
      mainTopic,
    });

    if (response.data.success) {
      toast.success(response.data.message);
      localStorage.setItem("courseId", response.data.courseId);
      localStorage.setItem("first", response.data.completed);
      localStorage.setItem("jsonData", JSON.stringify(jsonData));
      navigate("/content", {
        state: {
          jsonData: jsonData,
          mainTopic: mainTopic.toUpperCase(),
          type: type.toLowerCase(),
          courseId: response.data.courseId,
          end: "",
        },
      });
    } else {
      sendData(image, theory);
    }
  }

  async function sendDataVideo(image, theory) {
    jsonData[mainTopic][0].subtopics[0].theory = theory;
    jsonData[mainTopic][0].subtopics[0].youtube = image;

    const user = localStorage.getItem("user");
    const fname = localStorage.getItem("fname");
    const email = localStorage.getItem("email");
    const phone = localStorage.getItem("phone");
    const lname = localStorage.getItem("lname");
    const content = JSON.stringify(jsonData);
    const postURL = API + "/api/course";
    const response = await axios.post(postURL, {
      user,
      fname,
      lname,
      email,
      phone,
      content,
      type,
      mainTopic,
    });

    if (response.data.success) {
      toast.success(response.data.message);
      localStorage.setItem("courseId", response.data.courseId);
      localStorage.setItem("first", response.data.completed);
      localStorage.setItem("jsonData", JSON.stringify(jsonData));
      navigate("/content", {
        state: {
          jsonData: jsonData,
          mainTopic: mainTopic.toUpperCase(),
          type: type.toLowerCase(),
          courseId: response.data.courseId,
          end: "",
        },
      });
    } else {
      sendDataVideo(image, theory);
    }
  }

  async function sendVideo(query, subtopic) {
    const dataToSend = {
      prompt: query,
    };
    try {
      const postURL = API + "/api/yt";
      const res = await axios.post(postURL, dataToSend);

      try {
        const generatedText = res.data.url;
        sendTranscript(generatedText, subtopic);
      } catch (error) {
        sendVideo(query, subtopic);
      }
    } catch (error) {
      sendVideo(query, subtopic);
    }
  }

  async function sendTranscript(url, subtopic) {
    const dataToSend = {
      prompt: url,
    };
    try {
      const postURL = API + "/api/transcript";
      const res = await axios.post(postURL, dataToSend);

      try {
        const generatedText = res.data.url;
        const allText = generatedText.map((item) => item.text);
        const concatenatedText = allText.join(" ");
        const prompt = `Summarize this theory in a teaching way and :- ${concatenatedText}.`;
        sendSummery(prompt, url);
      } catch (error) {
        const prompt = `Explain me about this subtopic of ${mainTopic} with examples :- ${subtopic}. Please Strictly Don't Give Additional Resources And Images.`;
        sendSummery(prompt, url);
      }
    } catch (error) {
      const prompt = `Explain me about this subtopic of ${mainTopic} with examples :- ${subtopic}. Please Strictly Don't Give Additional Resources And Images.`;
      sendSummery(prompt, url);
    }
  }

  async function sendSummery(prompt, url) {
    const dataToSend = {
      prompt: prompt,
    };
    try {
      const postURL = API + "/api/generate";
      const res = await axios.post(postURL, dataToSend);
      const generatedText = res.data.text;
      const htmlContent = generatedText;

      try {
        const parsedJson = htmlContent;
        setProcessing(false);
        sendDataVideo(url, parsedJson);
      } catch (error) {
        sendSummery(prompt, url);
      }
    } catch (error) {
      sendSummery(prompt, url);
    }
  }

  const renderTopicsAndSubtopics = (topics) => {
    try {
      return (
        <div>
          {topics &&
            topics.map((topic) => (
              <div key={topic.title}>
                <h3 className="font-poppins text-lg font-medium my-1.5">
                  {topic.title}
                </h3>
                <div>
                  {topic.subtopics.map((subtopic) => (
                    <p
                      className="font-poppins text-sm font-extralight my-0.1 mx-1"
                      key={subtopic.title}
                    >
                      {subtopic.title}
                    </p>
                  ))}
                </div>
              </div>
            ))}
        </div>
      );
    } catch (error) {
      return (
        <div>
          {topics.map((topic) => (
            <div key={topic.title}>
              <h3 className="font-poppins text-lg font-medium my-1.5">
                {topic.title}
              </h3>
              <div>
                {topic.subtopics.map((subtopic) => (
                  <p
                    className="font-poppins text-sm font-extralight my-0.1 mx-1"
                    key={subtopic.title}
                  >
                    {subtopic.title}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className=" text-lg font-poppins font-extralight mx-12 my-5">
      <p className="text-xl font-medium my-1 mt-6">{mainTopic.toUpperCase()}</p>
      <p className="text-normal my-2">
        List of Topics & subtopics this course will cover
      </p>
      {jsonData && mainTopic in jsonData ? (
        renderTopicsAndSubtopics(jsonData[mainTopic])
      ) : (
        <p className="text-red-500">
          No topics available for the selected main topic.
        </p>
      )}

      <div className=" flex flex-col gap-3 mt-5">
        <button
          className={` text-base bg-white text-black w-48 py-2  font-normal `}
          onClick={redirectform}
        >
          Go Back
        </button>
        <button
          className={` text-base bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] w-48 py-2  font-normal `}
          onClick={redirectCourse}
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
  );
};

export default ListTopics;
