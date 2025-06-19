import React, { useContext, useEffect, useState } from "react";
// import TruncatedText from "../../components/TruncatedText";
import { useLocation, useNavigate } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import { FaCaretSquareLeft } from "react-icons/fa";
// import StyledText from "../../components/StyledText";
import YouTube from "react-youtube";
import { toast } from "react-toastify";
import axios from "axios";
import { IoChatbubbleEllipses, IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import { API } from "../../../Host";
import { AiFillHome } from "react-icons/ai";
import { HiDownload } from "react-icons/hi";
import { RiShareFill } from "react-icons/ri";
import { BiSolidFilePdf } from "react-icons/bi";
// import html2pdf from 'html2pdf.js';

// import robot from "../../assets/robot.png";
import { motion } from "framer-motion";
// import ChatWidget from "../../components/chatWidget";
// import NotesWidget from "../../components/notesWidget";
// import { ThemeContext } from "../../App";

const ContentPreCourses = () => {
    const { global, setGlobal } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);
  const [key, setkey] = useState("");
  const { state } = useLocation();
  const { mainTopic, type, courseId, end, pass, lang } = state || {};

  const jsonData = JSON.parse(localStorage.getItem("jsonData"));
 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [selected, setSelected] = useState("");
  const [theory, setTheory] = useState("");
  const [media, setMedia] = useState("");
  const [percentage, setPercentage] = useState(0);
  const [isComplete, setIsCompleted] = useState(false);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const handleOnClose = () => setIsOpenDrawer(false);
  const [isAnimationVisible, setIsAnimationVisible] = useState(false);
  const user = localStorage.getItem("user");

  const CountDoneTopics = () => {
    let doneCount = 0;
    let totalTopics = 0;

    jsonData[mainTopic.toLowerCase()].forEach((topic) => {

        topic.subtopics.forEach((subtopic) => {

            if (subtopic.done) {
                doneCount++;
            }
            totalTopics++;
        });
    });
    totalTopics = totalTopics + 1;
    // if(pass){
    //     totalTopics = totalTopics - 1;
    // }
    const completionPercentage = Math.round((doneCount / totalTopics) * 100);
    setPercentage(completionPercentage);
    if (completionPercentage >= '100') {
        setIsCompleted(true);
    }
}

  const [openTopics, setOpenTopics] = useState({});

  const handleOpenClose = (title) => {
    setOpenTopics((prev) => ({
      ...prev,
      [title]: !prev[title], // Toggle the open state for the clicked topic
    }));
  };

  const opts = {
    height: "390",
    width: "640",
  };

  const optsMobile = {
    height: "250px",
    width: "100%",
  };

  async function redirectExam() {
    const id = toast.loading("Please wait...");
    const mainTopicExam = jsonData[mainTopic.toLowerCase()];
    let subtopicsString = "";
    mainTopicExam.map((topicTemp) => {
      let titleOfSubTopic = topicTemp.title;
      subtopicsString = subtopicsString + " , " + titleOfSubTopic;
    });

    const postURL = API + "/api/aiexam";
    const response = await axios.post(postURL, {
      courseId,
      mainTopic,
      subtopicsString,
      lang,
    });
    if (response.data.success) {
      const element = document.documentElement; // or you can use a specific container if you want
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
        // Firefox
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        // Chrome, Safari and Opera
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        // IE/Edge
        element.msRequestFullscreen();
      } else {
        console.error("Full-screen mode is not supported by this browser.");
      }
      let questions = JSON.parse(response.data.message);

      
      navigate("/exam", {
        state: { topic: mainTopic, courseId: courseId, questions: questions },
      });
      toast.update(id, {
        render: "Starting Quiz",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    } else {
      toast.update(id, {
        render: "Internal Server Error",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    }
  }

  async function htmlDownload() {
    const id = toast.loading("Please wait exporting...");
    // Generate the combined HTML content
    const combinedHtml = await getCombinedHtml(
      mainTopic,
      jsonData[mainTopic.toLowerCase()]
    );

    // Create a temporary div element
    const tempDiv = document.createElement("div");
    tempDiv.style.width = "100%"; // Ensure div is 100% width
    tempDiv.style.height = "100%"; // Ensure div is 100% height
    tempDiv.innerHTML = combinedHtml;
    document.body.appendChild(tempDiv);

    // Create the PDF options
    const options = {
      filename: `${mainTopic}.pdf`,
      image: { type: "jpeg", quality: 1 },
      margin: [15, 15, 15, 15],
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      html2canvas: {
        scale: 2,
        logging: false,
        scrollX: 0,
        scrollY: 0,
        useCORS: true,
      },
      jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
    };

    // Generate the PDF
    html2pdf()
      .from(tempDiv)
      .set(options)
      .save()
      .then(() => {
        // Save the PDF
        document.body.removeChild(tempDiv);
        toast.update(id, {
          render: "Done!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
        });
      });
  }

  async function getCombinedHtml(mainTopic, topics) {
    async function toDataUrl(url) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.onload = function () {
          const reader = new FileReader();
          reader.onloadend = function () {
            resolve(reader.result);
          };
          reader.readAsDataURL(xhr.response);
        };

        xhr.onerror = function () {
          reject({
            status: xhr.status,
            statusText: xhr.statusText,
          });
        };

        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.send();
      }).catch((error) => {
        console.error(`Failed to fetch image at ${url}:`, error);
        return ""; // Fallback or placeholder
      });
    }

    const topicsHtml = topics
      .map(
        (topic) => `
      <h3 style="font-size: 18pt; font-weight: bold; margin: 0; margin-top: 15px;">${
        topic.title
      }</h3>
      ${topic.subtopics
        .map(
          (subtopic) => `
          <p style="font-size: 16pt; margin-top: 10px;">${subtopic.title}</p>
      `
        )
        .join("")}
  `
      )
      .join("");

    const theoryPromises = topics.map(async (topic) => {
      const subtopicPromises = topic.subtopics.map(
        async (subtopic, index, array) => {
          const imageUrl =
            type === "text & image course"
              ? await toDataUrl(subtopic.image)
              : ``;
          return `
          <div>
              <p style="font-size: 16pt; margin-top: 20px; font-weight: bold;">
                  ${subtopic.title}
              </p>
              <div style="font-size: 12pt; margin-top: 15px;">
                  ${
                    subtopic.done
                      ? `
                          ${
                            type === "text & image course"
                              ? imageUrl
                                ? `<img style="margin-top: 10px;" src="${imageUrl}" alt="${subtopic.title} image">`
                                : `<a style="color: #0000FF;" href="${subtopic.image}" target="_blank">View example image</a>`
                              : `<a style="color: #0000FF;" href="https://www.youtube.com/watch?v=${subtopic.youtube}" target="_blank" rel="noopener noreferrer">Watch the YouTube video on ${subtopic.title}</a>`
                          }
                          <div style="margin-top: 10px;">${
                            subtopic.theory
                          }</div>
                      `
                      : `<div style="margin-top: 10px;">Please visit ${subtopic.title} topic to export as PDF. Only topics that are completed will be added to the PDF.</div>`
                  }
              </div>
          </div>
      `;
        }
      );
      const subtopicHtml = await Promise.all(subtopicPromises);
      return `
          <div style="margin-top: 30px;">
              <h3 style="font-size: 18pt; text-align: center; font-weight: bold; margin: 0;">
                  ${topic.title}
              </h3>
              ${subtopicHtml.join("")}
          </div>
      `;
    });
    const theoryHtml = await Promise.all(theoryPromises);

    return `
  <div class="html2pdf__page-break" 
       style="display: flex; align-items: center; justify-content: center; text-align: center; margin: 0 auto; max-width: 100%; height: 11in;">
      <h1 style="font-size: 30pt; font-weight: bold; margin: 0;">
          ${mainTopic}
      </h1>
  </div>
  <div class="html2pdf__page-break" style="text-align: start; margin-top: 30px; margin-right: 16px; margin-left: 16px;">
      <h2 style="font-size: 24pt; font-weight: bold; margin: 0;">Index</h2>
      <br>
      <hr>
      ${topicsHtml}
  </div>
  <div style="text-align: start; margin-right: 16px; margin-left: 16px;">
      ${theoryHtml.join("")}
  </div>
  `;
  }

  async function finish() {
    if (sessionStorage.getItem('first') === 'true') {
        if (!end) {
            const today = new Date();
            const formattedDate = today.toLocaleDateString('en-GB');
            navigate('/certificate', { state: { courseTitle: mainTopic, end: formattedDate } });
        } else {
            navigate('/certificate', { state: { courseTitle: mainTopic, end: end } });
        }

    } else {
        const dataToSend = {
            courseId: courseId
        };
        try {
            const postURL = API + '/api/finish';
            const response = await axios.post(postURL, dataToSend);
            if (response.data.success) {
                const today = new Date();
                const formattedDate = today.toLocaleDateString('en-GB');
                sessionStorage.setItem('first', 'true');
                sendEmail(formattedDate);
            } else {
                finish()
            }
        } catch (error) {
            finish()
        }
    }
}

  async function sendEmail(formattedDate) {
    const userName = localStorage.getItem("fname");
    const email = localStorage.getItem("email");
    const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  </head>
  <body style="margin-left:auto;margin-right:auto;margin-top:auto;margin-bottom:auto;background-color:rgb(255,255,255);font-family:ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';">
    <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:37.5em;margin-left:auto;margin-right:auto;margin-top:40px;margin-bottom:40px;width:465px;border-radius:0.25rem;border-width:1px;border-style:solid;border-color:rgb(234,234,234);padding:20px">
      <tr style="width:100%">
        <td>
          <h1 style="margin-left:0px;margin-right:0px;margin-top:30px;margin-bottom:30px;padding:0px;text-align:center;font-size:24px;font-weight:400;color:rgb(0,0,0)">Congratulations on Completing Your Course!</h1>
          <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">Hi <strong>${userName}</strong>,</p>
          <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">Congratulations on completing the course <strong>"${mainTopic}"</strong> on Pick My Course! We're thrilled to see you achieve your learning goals. You've demonstrated dedication and a thirst for knowledge, and we commend you for your accomplishment.</p>
          <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">To celebrate your success, we've prepared a certificate of completion for you. You can download it here:</p>
          <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">We encourage you to share your achievement with your friends and colleagues on social media using the hashtag <strong>#SeekMyCourseGrad</strong>.</p>
          <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">What's next? Continue your learning journey with Pick My Course! Explore our vast library of courses and discover new topics to master.</p>
          <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">Keep learning, keep growing!</p>
          <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">The <strong>Pick My Course</strong> Team</p>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

    try {
      const postURL = API + "/api/sendcertificate";
      await axios
        .post(postURL, { html, email })
        .then((res) => {
          navigate("/viewcertificate", {
            state: { courseTitle: mainTopic, end: formattedDate },
          });
        })
        .catch((error) => {
          navigate("/viewcertificate", {
            state: { courseTitle: mainTopic, end: formattedDate },
          });
        });
    } catch (error) {
      navigate("/viewcertificate", {
        state: { courseTitle: mainTopic, end: formattedDate },
      });
    }
  }

  useEffect(() => {
    loadMessages();
    const CountDoneTopics = () => {
      let doneCount = 0;
      let totalTopics = 0;

      jsonData[mainTopic.toLowerCase()].forEach((topic) => {
        topic.subtopics.forEach((subtopic) => {
          if (subtopic.done) {
            doneCount++;
          }
          totalTopics++;
        });
      });
      const completionPercentage = Math.round((doneCount / totalTopics) * 100);
      setPercentage(completionPercentage);
      if (completionPercentage >= "100") {
        setIsCompleted(true);
      }
    };

    if (!mainTopic) {
      navigate("/create");
    } else {
      if (percentage >= "100") {
        setIsCompleted(true);
      }

      const mainTopicData = jsonData[mainTopic.toLowerCase()][0];
      const firstSubtopic = mainTopicData.subtopics[0];
      firstSubtopic.done = true;
      setSelected(firstSubtopic.title);
      setTheory(firstSubtopic.theory);

      if (type === "video & text course") {
        setMedia(firstSubtopic.youtube);
      } else {
        setMedia(firstSubtopic.image);
      }
      localStorage.setItem("jsonData", JSON.stringify(jsonData));
      CountDoneTopics();
    }
  }, []);

  useEffect(() => {
    setIsAnimationVisible(true);

    const timer = setTimeout(() => {
      setIsAnimationVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleSelect = (topics, sub) => {
    const mTopic = jsonData[mainTopic.toLowerCase()].find(
      (topic) => topic.title === topics
    );
    const mSubTopic = mTopic?.subtopics.find(
      (subtopic) => subtopic.title === sub
    );

    if (
      mSubTopic.theory === "" ||
      mSubTopic.theory === undefined ||
      mSubTopic.theory === null
    ) {
      if (type === "video & text course") {
        const query = `${mSubTopic.title} ${mainTopic} in english`;
        const id = toast.loading("Please wait...");
        sendVideo(query, topics, sub, id, mSubTopic.title);
      } else {
        const prompt = `Strictly in ${lang}, Explain me about this subtopic of ${mainTopic} with examples :- ${mSubTopic.title}. Please Strictly Don't Give Additional Resources And Images.`;
        const promptImage = `Example of ${mSubTopic.title} in ${mainTopic}`;
        const id = toast.loading("Please wait...");
        sendPrompt(prompt, promptImage, topics, sub, id);
      }
    } else {
      setSelected(mSubTopic.title);

      setTheory(mSubTopic.theory);
      if (type === "video & text course") {
        setMedia(mSubTopic.youtube);
      } else {
        setMedia(mSubTopic.image);
      }
    }
    setIsSidebarOpen(false);
  };

  async function sendPrompt(prompt, promptImage, topics, sub, id) {
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
        sendImage(parsedJson, promptImage, topics, sub, id);
      } catch (error) {
        sendPrompt(prompt, promptImage, topics, sub, id);
      }
    } catch (error) {
      sendPrompt(prompt, promptImage, topics, sub, id);
    }
  }

  async function sendImage(parsedJson, promptImage, topics, sub, id) {
    const dataToSend = {
      prompt: promptImage,
    };
    try {
      const postURL = API + "/api/image";
      const res = await axios.post(postURL, dataToSend);
      try {
        const generatedText = res.data.url;
        sendData(generatedText, parsedJson, topics, sub, id);
      } catch (error) {
        sendImage(parsedJson, promptImage, topics, sub, id);
      }
    } catch (error) {
      sendImage(parsedJson, promptImage, topics, sub, id);
    }
  }

  async function sendData(image, theory, topics, sub, id) {
    const mTopic = jsonData[mainTopic.toLowerCase()].find(
      (topic) => topic.title === topics
    );
    const mSubTopic = mTopic?.subtopics.find(
      (subtopic) => subtopic.title === sub
    );
    mSubTopic.theory = theory;
    mSubTopic.image = image;
    setSelected(mSubTopic.title);

    toast.update(id, {
      render: "Done!",
      type: "success",
      isLoading: false,
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
    });
    setTheory(theory);
    if (type === "video & text course") {
      setMedia(mSubTopic.youtube);
    } else {
      setMedia(image);
    }
    mSubTopic.done = true;
    updateCourse();
  }

  async function sendDataVideo(image, theory, topics, sub, id) {
    const mTopic = jsonData[mainTopic.toLowerCase()].find(
      (topic) => topic.title === topics
    );
    const mSubTopic = mTopic?.subtopics.find(
      (subtopic) => subtopic.title === sub
    );
    mSubTopic.theory = theory;
    mSubTopic.youtube = image;
    setSelected(mSubTopic.title);

    toast.update(id, {
      render: "Done!",
      type: "success",
      isLoading: false,
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
    });
    setTheory(theory);
    if (type === "video & text course") {
      setMedia(image);
    } else {
      setMedia(mSubTopic.image);
    }
    mSubTopic.done = true;
    updateCourse();
  }

  async function updateCourse() {
    CountDoneTopics();
    localStorage.setItem("jsonData", JSON.stringify(jsonData));

    
    const dataToSend = {
      content: JSON.stringify(jsonData),
      courseId: courseId,
    };
    try {
      const postURL = API + "/api/update";
      await axios.post(postURL, dataToSend);
    } catch (error) {
      updateCourse();
    }
  }

  async function sendVideo(query, mTopic, mSubTopic, id, subtop) {
    const dataToSend = {
      prompt: query,
    };
    try {
      const postURL = API + "/api/yt";
      const res = await axios.post(postURL, dataToSend);

      try {
        const generatedText = res.data.url;
        sendTranscript(generatedText, mTopic, mSubTopic, id, subtop);
      } catch (error) {
        sendVideo(query, mTopic, mSubTopic, id, subtop);
      }
    } catch (error) {
      sendVideo(query, mTopic, mSubTopic, id, subtop);
    }
  }

  async function sendTranscript(url, mTopic, mSubTopic, id, subtop) {
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
        const prompt = `Strictly in ${lang}, Summarize this theory in a teaching way :- ${concatenatedText}.`;
        sendSummery(prompt, url, mTopic, mSubTopic, id);
      } catch (error) {
        const prompt = `Strictly in ${lang}, Explain me about this subtopic of ${mainTopic} with examples :- ${subtop}. Please Strictly Don't Give Additional Resources And Images.`;
        sendSummery(prompt, url, mTopic, mSubTopic, id);
      }
    } catch (error) {
      const prompt = `Strictly in ${lang}, Explain me about this subtopic of ${mainTopic} with examples :- ${subtop}.  Please Strictly Don't Give Additional Resources And Images.`;
      sendSummery(prompt, url, mTopic, mSubTopic, id);
    }
  }

  async function sendSummery(prompt, url, mTopic, mSubTopic, id) {
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
        sendDataVideo(url, parsedJson, mTopic, mSubTopic, id);
      } catch (error) {
        sendSummery(prompt, url, mTopic, mSubTopic, id);
      }
    } catch (error) {
      sendSummery(prompt, url, mTopic, mSubTopic, id);
    }
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const defaultMessage = `<p>Hey there! I'm your AI teacher. If you have any questions about your ${mainTopic} course, whether it's about videos, images, or theory, just ask me. I'm here to clear your doubts.</p>`;
  const defaultPrompt = `I have a doubt about this topic :- ${mainTopic}. Please clarify my doubt in very short :- `;

  const loadMessages = async () => {
    try {
      const jsonValue = localStorage.getItem(mainTopic);
      if (jsonValue !== null) {
        setMessages(JSON.parse(jsonValue));
      } else {
        const newMessages = [
          ...messages,
          { text: defaultMessage, sender: "bot" },
        ];
        setMessages(newMessages);
        await storeLocal(newMessages);
      }
    } catch (error) {
      loadMessages();
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;

    const userMessage = { text: newMessage, sender: "user" };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    await storeLocal(updatedMessages);
    setNewMessage("");

    let mainPrompt = defaultPrompt + newMessage;
    const dataToSend = { prompt: mainPrompt };
    const url = API + "/api/chat";

    try {
      const response = await axios.post(url, dataToSend);

      if (response.data.success === false) {
        sendMessage();
      } else {
        const botMessage = { text: response.data.text, sender: "bot" };
        const updatedMessagesWithBot = [...updatedMessages, botMessage];
        setMessages(updatedMessagesWithBot);
        await storeLocal(updatedMessagesWithBot);
      }
    } catch (error) {}
  };

  async function storeLocal(messages) {
    try {
      localStorage.setItem(mainTopic, JSON.stringify(messages));
    } catch (error) {
      localStorage.setItem(mainTopic, JSON.stringify(messages));
    }
  }

  const redirectcourse = () => {
    navigate("/my_courses");
  };

  const renderTopicsAndSubtopics = (topics) => {
    return (
      <>
        <span
          className=" flex gap-2 mx-4  items-center text-white font-poppins font-extralight "
          onClick={redirectcourse}
          // onClick={() => setIsSidebarOpen(false)}
        >
          <FaCaretSquareLeft className="text-lg" />
          <p className="my-3 "> Back to Home</p>
        </span>
        <div className=" font-poppins font-extralight ">
          {topics.map((topic) => (
            <div key={topic.title} className="">
              <div className=" ">
                <button
                  onClick={() => handleOpenClose(topic.title)}
                  type="button"
                  className={`inline-flex  justify-between w-full text-left text-sm  text-white px-6 py-2.5  ${
                    openTopics[topic.title]
                      ? "bg-teal-500"
                      : "border border-teal-500 mt-0.5"
                  }`}
                >
                  {topic.title}
                  <IoIosArrowDown
                    className={` h-5 w-5 mt-2 transition-transform bg-white text-[#200098] rounded ${
                      openTopics[topic.title] ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openTopics[topic.title] && (
                  <div className="px-1">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                    >
                      {topic.subtopics.map((subtopic) => (
                        <>
                          <p
                            key={subtopic.title}
                            onClick={() =>
                              handleSelect(topic.title, subtopic.title)
                            }
                            className="flex py-1.5 px-2 justify-start gap-5 text-sm items-center font-extralight text-white cursor-pointer "
                            role="menuitem"
                          >
                            {subtopic.title}
                            {subtopic.done && (
                              <FaCheck className="ml-2" size={12} />
                            )}
                          </p>
                          <div className="h-0.5 w-full -translate-y-2/4 bg-gray-500 mt-1"></div>
                        </>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <p
          className="text-center mt-3 mx-4 flex flex-row items-center text-base font-bold  text-white cursor-pointer"
          onClick={redirectExam}
        >
          {" "}
          {mainTopic} Quiz
          {pass === true ? <FaCheck className="ml-2" size={12} /> : <></>}
        </p>
      </>
    );
  };

  return (
    <>
      {!mainTopic ? null : (
        <div className={`flex flex-col h-screen  text-white lg:mt-0 md:mt-0  bg-black ${isSidebarOpen ? "mt-0" : "mt-8"}`}>
          <div className="flex flex-row overflow-y-auto  ">
            <div
              className={`${
                isSidebarOpen ? "w-full" : "w-0"
              } md:w-3/12 bg-black overflow-y-auto transition-all duration-300 relative`}
            >
              <div className="mt-3">
                {jsonData &&
                  renderTopicsAndSubtopics(jsonData[mainTopic.toLowerCase()])}
              </div>
            </div>
            <div
              className={`overflow-y-auto flex-grow flex-col ${
                isSidebarOpen ? "hidden" : "w-full"
              } md:w-9/12`}
            >
              <button
                className="md:hidden block p-2 bg-teal-500 text-black fixed top-0 left-0 z-30 w-full"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                ☰ Open Sub Topics
              </button>
              <nav className="py-5 bg-gray-900 border-b border-gray-500 flex justify-between items-center flex-wrap">
                <div className="ml-1  flex flex-col lg:w-1/2 md:w-1/2 w-4/5">
                  <TruncatedText text={mainTopic} len={10} />
                  {isComplete ? (
                    <p
                      onClick={finish}
                      className="mr-3 underline text-white font-normal mx-8 whit"
                    >
                      Download Certificate
                    </p>
                  ) : (
                    <span className="text-white">
                      <p className="lg:w-3/4 md:w-3/4 w-full text-end mx-4 text-lg font-extralight">{`${percentage}%`}</p>
                      <div className="lg:w-3/4 md:w-3/4 w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700 mx-5">
                        <div
                          className="bg-teal-500 h-4 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <p className="mx-6 mt-0.5 text-sm whitespace-nowrap">Completion status</p>
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-5 mr-5 mt-5 lg:ml-0 md:ml-0 ml-8">
                  <div className="">
                    <AiFillHome
                      onClick={redirectcourse}
                      size={30}
                      color={"#31C48D"}
                    />
                  </div>
               
                  <div className="flex gap-2 items-center" onClick={htmlDownload}>
                    <BiSolidFilePdf
                      size={30}
                      color={"#31C48D"}
                    />
                    <span className="lg:block md:block hidden"> Export Course as PDF</span>
                  </div>
                </div>
              </nav>
              <div className="px-5 text-white bg-gray-900 pt-5 font-poppins font-extralight">
                <p className="text-white font-normal text-sm">{selected}</p>
                <div className="overflow-hidden mt-4 text-white text-sm pb-10 max-w-full">
                  {type === "video & text course" ? (
                    <div>
                      <YouTube
                        key={media}
                        className="mb-5 overflow-auto no-scrollbarss"
                        videoId={media}
                        opts={opts}
                      />
                      <StyledText text={theory} />
                    </div>
                  ) : (
                    <div>
                      <StyledText text={theory} />
                      <img
                        className="overflow-hidden p-10"
                        src={media}
                        alt="Media"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div
            className={`fixed inset-0 z-50 ${
              isOpenDrawer ? "block" : "hidden"
            }`}
          >
            <div className="bg-[#200098] h-full lg:w-96 md:w-80 w-72 right-0 absolute">
              <div className="flex justify-end items-center p-2">
                <button
                  onClick={() => setIsOpenDrawer(false)}
                  className="text-white"
                >
                  <IoClose size={24} />
                </button>
              </div>
              <div
                className="overflow-y-auto"
                style={{ height: "calc(100% - 200px)" }}
              >
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex font-poppins font-extralight text-base ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`rounded-lg  p-1 m-2 ${
                        msg.sender === "user"
                          ? "text-center text-white"
                          : "text-center text-white"
                      }`}
                    >
                      <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mx-6 mt-2">
                <input
                  value={newMessage}
                  placeholder="Ask Something..."
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full border border-gray-300 rounded-md outline-none py-5 text-center  "
                  type="text"
                />
              </div>
              <div className="flex justify-center">
                <button
                  className={`text-white text-base bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] w-1/2 py-2.5 my-5 `}
                  type="submit"
                  onClick={sendMessage}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <ChatWidget
              defaultMessage={defaultMessage}
              defaultPrompt={defaultPrompt}
              mainTopic={mainTopic}
            />
            <NotesWidget courseId={courseId} mainTopic={mainTopic} />
          </div>
        </div>
      )}
    </>
  );
};

export default ContentPreCourses;