import React, { use, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../../../Host";
import { AiOutlineLoading } from "react-icons/ai";

const Exam = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { courseId } = state;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [passedQuiz, setPassed] = useState(false);
  const [quizData, setQuizData] = useState([]);
  const [apiquizData, setApiQuizData] = useState({});
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    const responsequiz = await axios.get(
      `${API}/api/quizbyid?courseId=${courseId}`
    );

    setApiQuizData(responsequiz.data);
    setQuizData(responsequiz.data.questionAnswers);
  };

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    setShowCorrectAnswer(true);
    setErrorMessage("");
  };

  const handleNext = () => {
    if (!selectedAnswer) {
      setErrorMessage("Please select an Answer before proceeding.");
      return;
    }

    setUserAnswers([...userAnswers, selectedAnswer]);

    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowCorrectAnswer(false);
    } else {
      setCompleted(true);
      evaluateQuiz();
    }
  };

  const evaluateQuiz = () => {
    const correctAnswers = userAnswers.filter(
      (answer, index) => answer === quizData[index].answer
    ).length;

    if (correctAnswers > 4) {
      setPassed(true);
    } else {
      setPassed(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-darkest-blue">
      <div className="flex flex-1 justify-center items-center -mt-24">
        {quizData.length === 0 ? (
          <div className="text-center h-screen w-screen flex items-center justify-center">
            <AiOutlineLoading size={12} className="fill-white" />
          </div>
        ) : (
          <div className="flex-1 flex justify-center items-center flex-col content-center text-center -mt-20">
            {completed ? (
              <div>
                <p className="text-center  text-xl  font-medium my-4 text-white">
                  {passedQuiz
                    ? "You Have Passed The Quiz 🎉"
                    : "You Have Failed The Quiz 😔 Try again"}
                </p>
                <p className="text-center text-white text-base mt -2">
                  You scored{" "}
                  {
                    userAnswers.filter(
                      (answer, index) => answer === quizData[index].answer
                    ).length
                  }{" "}
                  out of {quizData.length} questions.
                </p>
                <p className="text-center text-white text-base my-3">
                  Total Score : {"  "}
                  {userAnswers.filter(
                    (answer, index) => answer === quizData[index].answer
                  ).length * 10}{" "}
                  out of {quizData.length * 10}
                </p>
              </div>
            ) : (
              <div>
                <h2 className="text-xl text-white font-medium mb-4">
                  Question {currentQuestionIndex + 1} of {quizData.length}
                </h2>
                <h3 className="text-lg text-white mb-4">
                  {quizData[currentQuestionIndex].question}
                </h3>
                <div className="flex flex-col">
                  {quizData[currentQuestionIndex].options.map(
                    (option, index) => {
                      const optionLetter = String.fromCharCode(65 + index); // Convert index to A, B, C, D
                      const isCorrect =
                        optionLetter === quizData[currentQuestionIndex].answer;
                      const isSelected = selectedAnswer === optionLetter;
                      const isWrong =
                        showCorrectAnswer && isSelected && !isCorrect;

                      return (
                        <button
                          key={index}
                          onClick={() => handleAnswer(optionLetter)}
                          className={`m-1.5 py-2 px-1 ${
                            isWrong
                              ? "bg-red-500"
                              : isCorrect && showCorrectAnswer
                              ? "bg-green-500"
                              : "bg-popup-gray border border-teal-500"
                          } text-white`}
                          disabled={selectedAnswer !== null}
                        >
                          {option}
                        </button>
                      );
                    }
                  )}
                </div>
                {showCorrectAnswer && (
                  <p className="text-red-500 mt-2">
                    {selectedAnswer !== quizData[currentQuestionIndex].answer &&
                      `Correct Answer: ${quizData[currentQuestionIndex].answer}`}
                  </p>
                )}
                {errorMessage && (
                  <p className="text-red-500 mt-2">{errorMessage}</p>
                )}
                <button
                  onClick={handleNext}
                  className="mt-4 bg-teal-500 text-white px-8 py-1.5 text-lg"
                  disabled={
                    currentQuestionIndex === quizData.length - 1 &&
                    !selectedAnswer
                  }
                >
                  Next
                </button>
              </div>
            )}
            {completed && (
              <div className="flex flex-col">
                <button
                  onClick={() => navigate("/coursemanagement")}
                  className=" text-white items-center justify-center content-center w-44 px-3 py-2 mt-1 mb-4 font-medium bg-teal-500"
                >
                  Finish
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Exam;
