import { useEffect, useState } from "react";
import { GoHome } from "react-icons/go";
import { Link } from "react-router-dom";
import APIClientPrivate from "../utils/api";

export default function Success({}) {
  const userId = localStorage.getItem("UserID");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [comment, setComment] = useState<string>("");
  const emojis = [
    { rating: 1, emoji: "😢", label: "Very Dissatisfied" },
    { rating: 2, emoji: "😔", label: "Dissatisfied" },
    { rating: 3, emoji: "😐", label: "Neutral" },
    { rating: 4, emoji: "😊", label: "Satisfied" },
    { rating: 5, emoji: "🥰", label: "Very Satisfied" },
  ];

  useEffect(() => {
    const fetchResult = async () => {
      const token = localStorage.getItem("token");

      console.log(userId, token);
      try {
        const response = await APIClientPrivate.get(
          `/api/anwser/get-result/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data.result);

        const calculatedScore = response.data.result.reduce(
          (acc: any, item: any) => acc + item.score,
          0
        );
        setTotalScore(calculatedScore);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchResult();
  }, []);

  const handleSubmit = async () => {
    if (!selectedRating) return;

    try {
      const token = localStorage.getItem("token");
      const response = await APIClientPrivate.post(
        "/api/feedback/submit",
        { rating: selectedRating, userId, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(response.data.message);
      setSelectedRating(null);
      setComment("");
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-3 lg:p-0  ">
      <div className="flex flex-col justify-center items-center gap-2">
        <img src="/check.png" alt="Sucess" className="w-[70px]" />
        <p className="font-semibold text-[18px] text-center">
          Congratulations you have Succesfully Completed The Test
        </p>

        <p className="font-bold">
          Score &nbsp;:&emsp;
          <span className="bg-[#fac166] px-4 py-1 font-semibold   rounded-3xl">
            {totalScore}/50
          </span>
        </p>
        <div className="font-bold text-[20px] text-white bg-[#2A586F] mt-2 rounded-md px-4 py-2">
          Your ID: {userId}
        </div>
      </div>

      {/*feedback section*/}
      <div className="bg-white rounded-lg shadow-xl md:p-6 p-2 md:w-[60%] mt-2">
        <h2 className="text-xl font-bold ">Feedback</h2>

        <div className="mt-3">
          <h3 className="text-xl font-bold tracking-wider">
            Give us a feedback!
          </h3>
          <p className="text-gray-600  text-justify">
            Your input is important for us. We take customer feedback very
            seriously.
          </p>
        </div>

        <div className="flex  mt-5 mb-5 gap-3 ">
          {emojis.map((item) => (
            <button
              key={item.rating}
              onClick={() => setSelectedRating(item.rating)}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl cursor-pointer
            ${
              selectedRating === item.rating
                ? "bg-[#2A586F]  "
                : "bg-gray-300 hover:bg-gray-300 opacity-50"
            }`}
              aria-label={item.label}
            >
              {item.emoji}
            </button>
          ))}
        </div>

        <div className="mb-2 ">
          <textarea
            className="w-full border-[#c4c4c4] border-1 rounded-md p-4 h-24 focus:outline-none  shadow-md"
            placeholder="Add a comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={selectedRating === null}
          className={`md:w-1/3 bg-[#2A586F] lg:px-4 border px-1  py-2 rounded-md text-white font-bold text-sm
          ${
            selectedRating !== null
              ? " hover:bg-transparent hover:text-[#2A586F] border-[#2A586F] cursor-pointer "
              : " bg-[#2A586F] cursor-not-allowed"
          }`}
        >
          Submit Feedback
        </button>
      </div>
      <Link to={"/"} className="flex items-center gap-2 my-2">
        <GoHome />
        <span>Back to home</span>
      </Link>
    </div>
  );
}
