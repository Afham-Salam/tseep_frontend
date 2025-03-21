import { useEffect, useState } from "react";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { FaCircle } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { BiBookmark } from "react-icons/bi";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";
import useWindowWidth from "../hooks/useWindowWidth";
import APIClientPrivate from "../utils/api";
import { useNavigate } from "react-router-dom";

type Question = {
  _id: string;
  index: number;
  question: string;
  options: string[];
  correct: string;
};

export default function Questions() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [sidebarVisible, setSidebarVisible] = useState(true);
  const windowWidth = useWindowWidth();
  const isLargeScreen = windowWidth >= 1000;

  const [question, setQuestion] = useState<Question | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);

  useEffect(() => {
    if (isLargeScreen) {
      setSidebarVisible(true);
    } else {
      setSidebarVisible(false);
    }
  }, [isLargeScreen]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Fetch all questions
        const questionsResponse = await APIClientPrivate.get(
          "/api/question/get-questions",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTotalQuestions(questionsResponse.data.questions.length);

        // Fetch the current question
        const currentQuestionResponse = await APIClientPrivate.get(
          `/api/question/get-question/${currentQuestion}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setQuestion(currentQuestionResponse.data.question);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, [currentQuestion]);

  const handleSubmit = async () => {
    try {
      if (!question || selectedAnswer === null) {
        alert("Please select an answer before proceeding.");
        return;
      }
      const userID = localStorage.getItem("UserID");
      const answersPayload = {
        userId: userID,
        answers: [
          {
            index: question.index,
            selectedAnswer: selectedAnswer,
          },
        ],
      };

      // Send answers via POST request
      await APIClientPrivate.post(
        "/api/anwser/submit-answers",
        answersPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Answer submitted successfully");

      if (currentQuestion === totalQuestions) {
        navigate("/success");
      } else {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
      }
    } catch (error) {
      console.error("Error submitting test:", error);
      alert("Failed to submit test. Please try again.");
    }
  };

  const symbols = [
    { id: 1, color: "text-green-600", label: "Attended" },
    { id: 2, color: "text-red-600", label: "Not Attended" },
    { id: 3, color: "text-gray-400", label: "Yet to Attend" },
  ];

  return (
    <div className="bg-white flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`
    ${
      sidebarVisible
        ? "w-full sm:w-64 md:w-72 border-r border-gray-200 fixed sm:relative"
        : "w-0 sm:w-0"
    }
    h-screen overflow-y-auto transition-all duration-300
    bg-white z-50 shadow-lg sm:shadow-none
  `}
        >
          {sidebarVisible && (
            <div className="p-4">
              <button
                onClick={() => setSidebarVisible(false)}
                className="text-2xl absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100"
                aria-label="Close sidebar"
              >
                <MdOutlineSpaceDashboard />
              </button>

              <div className="flex flex-col mt-16 gap-4">
                <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {[...Array(totalQuestions)].map((_, index) => (
                    <button
                      key={index + 1}
                      className={`aspect-auto py-2 rounded border cursor-pointer flex items-center justify-center text-lg
                ${
                  currentQuestion === index + 1 ? "bg-[#e7ffd9] text-black" : ""
                }
              `}
                      onClick={() => setCurrentQuestion(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Symbols Legend */}
              <div className="shadow-md p-3 rounded-md mt-6 sm:mt-48">
                {symbols.length > 0 ? (
                  symbols.map((symbol) => (
                    <div
                      key={symbol.id}
                      className="flex items-center gap-2 mt-1"
                    >
                      <FaCircle className={`${symbol.color} text-xs`} />
                      <span className="text-sm">{symbol.label}</span>
                    </div>
                  ))
                ) : (
                  <></>
                )}
              </div>
            </div>
          )}
        </aside>

        {/* Main quiz area */}
        <div className="flex-1 p-6 overflow-auto">
          {!sidebarVisible && (
            <button
              onClick={() => setSidebarVisible(true)}
              className="text-2xl absolute left-4 top-28"
            >
              <MdOutlineSpaceDashboard />
            </button>
          )}

          <h1 className="md:text-2xl text-[20px] font-bold text-center text-[#2A586F] mb-5 relative">
            Assess Your Intelligence
            <span className="absolute lg:right-[38%] right-5 md:right-56 bottom-1 lg:w-[12%] md:w-[125px] w-28 h-1 bg-[#fac166]" />
          </h1>

          {/* Progress Bar */}
          <div className="flex items-center md:justify-between">
            <div className="h-2 md:w-[70%] w-36 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#2A586F]"
                style={{
                  width: `${(currentQuestion / totalQuestions) * 100}%`,
                }}
              ></div>
            </div>
            <div className="text-lg font-semibold whitespace-nowrap lg:mr-36 mr-1">
              {currentQuestion}/{totalQuestions}
            </div>
            <div className="flex items-center bg-[#fac166] text-yellow-800 px-3 py-1 text-md rounded-sm">
              <IoMdTime className="mr-1" />
              <span>5 Min</span>
            </div>
          </div>

          {/* Question Section */}
          {question ? (
            <div className="bg-gray-50 rounded-lg p-5 shadow-sm">
              <div className="flex items-start mb-3">
                <div className="bg-[#2A586F] text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                  {question.index}
                </div>
                <h2 className="text-lg font-medium">{question.question}</h2>
              </div>

              <div className="space-y-3 bg-white p-3">
                {question.options.map((option) => (
                  <div
                    key={option}
                    className={`p-3 rounded-md flex items-center cursor-pointer w-60 group ${
                      selectedAnswer === option ? "bg-[#e7ffd9]" : "bg-gray-100"
                    }`}
                    onClick={() => setSelectedAnswer(option)}
                  >
                    <label className="flex items-center gap-2 cursor-pointer w-full">
                      <input
                        type="radio"
                        name="quiz-answer"
                        value={option}
                        checked={selectedAnswer === option}
                        onChange={() => setSelectedAnswer(option)}
                        className="hidden "
                      />
                      <div className="w-5 h-5 border-2 border-gray-400 rounded-full flex items-center justify-center">
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${
                            selectedAnswer === option
                              ? "bg-[#2A586F]"
                              : "bg-gray-400"
                          }`}
                        ></div>
                      </div>
                      <span className="ml-2">{option}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center mt-5">Loading question...</p>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-5">
            <button className="cursor-pointer">
              <BiBookmark className="text-2xl text-gray-400" />
            </button>
            <div className="flex gap-2">
              <button
                className={`flex items-center  gap-1 px-5 py-1 rounded text-white bg-[#2A586F] ${
                  currentQuestion === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                onClick={() =>
                  currentQuestion > 1 && setCurrentQuestion(currentQuestion - 1)
                }
                disabled={currentQuestion === 1}
              >
                <IoArrowBack className="mr-1" /> Previous
              </button>
              <button
                className="flex items-center gap-1 px-3 py-1 cursor-pointer rounded text-white bg-[#2A586F]"
                onClick={handleSubmit}
              >
                Next <IoArrowForward className="ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
