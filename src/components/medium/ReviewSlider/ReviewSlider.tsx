"use client";

import Image from "next/image";
import React, { useState } from "react";
import { IoChevronForwardSharp } from "react-icons/io5";
import { IoChevronBackSharp } from "react-icons/io5";
import { RiDoubleQuotesL } from "react-icons/ri";

interface Review {
  id: number;
  text: string;
  name: string;
  position: string;
  avatar: string;
}

const reviews: Review[] = [
  {
    id: 1,
    text: "Ace The AI Interview Coach helped me land my dream job! The feedback was spot on. I felt fully prepared for my real interview.",
    name: "Adam Smith",
    position: "Lead Software Engineer at Amazon inc.",
    avatar: "/assets/avatar.jpg"
  },
  {
    id: 2,
    text: "The AI coach identified my weak points and helped me improve dramatically. I went from nervous to confident in just a few sessions.",
    name: "Sarah Johnson",
    position: "Product Manager at Google",
    avatar: "/assets/avatar.jpg"
  },
  {
    id: 3,
    text: "Amazing platform! The personalized feedback and practice sessions made all the difference. I aced every interview after using this.",
    name: "Michael Chen",
    position: "Senior Developer at Microsoft",
    avatar: "/assets/avatar.jpg"
  }
];

const ReviewSlider = () => {
  const [currentReview, setCurrentReview] = useState(0);

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };
  const currentReviewData = reviews[currentReview];

  return (
    <div className="mt-32 flex flex-col items-center justify-center px-10 md:px-20">
      <div className="flex lg:flex-row flex-col items-center justify-between w-full max-w-6xl">
        <div className="flex flex-col gap-3 text-2xl lg:text-3xl text-center lg:text-left">
          <h1 className="text-gray-900 dark:text-white">
            Insights from the <br /> <b>community</b>
          </h1>
          <p className="text-sm lg:text-base max-w-[300px] text-gray-600 dark:text-gray-400">
            Here's what other users had to say about Ace The AI.
          </p>
          <div className="hidden lg:flex gap-5 mt-5 transition-all">
            <button 
              onClick={prevReview}
              className="border rounded-full p-3 border-gray-300 dark:border-gray-600 hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-gray-700 dark:text-gray-300"
            >
              <IoChevronBackSharp />
            </button>
            <button 
              onClick={nextReview}
              className="border rounded-full p-3 border-gray-300 dark:border-gray-600 hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-gray-700 dark:text-gray-300"
            >
              <IoChevronForwardSharp />
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center lg:items-stretch gap-5 max-w-[400px] mt-8 lg:mt-0">
          <RiDoubleQuotesL
            size={50}
            className="text-primary my-2 lg:my-0 lg:-ml-10 -mb-4"
          />
          <p className="text-xl lg:text-3xl lg:text-left text-center text-gray-900 dark:text-white transition-all duration-300">
            {currentReviewData.text}
          </p>
          <div className="flex items-center gap-5">
            <Image
              src={currentReviewData.avatar}
              width={60}
              height={60}
              className="rounded-full"
              alt="User avatar"
              objectFit="cover"
            />
            <div className="flex flex-col">
              <h2 className="font-bold text-sm text-gray-900 dark:text-white">
                {currentReviewData.name}
              </h2>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {currentReviewData.position}
              </span>
            </div>
          </div>
          <div className="flex lg:hidden gap-5 mt-5 transition-all text-2xl">
            <button 
              onClick={prevReview}
              className="border rounded-full p-2 border-gray-300 dark:border-gray-600 hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-gray-700 dark:text-gray-300"
            >
              <IoChevronBackSharp />
            </button>
            <button 
              onClick={nextReview}
              className="border rounded-full p-2 border-gray-300 dark:border-gray-600 hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-gray-700 dark:text-gray-300"
            >
              <IoChevronForwardSharp />
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-2 mt-6">
        {reviews.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentReview(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentReview 
                ? 'bg-primary' 
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ReviewSlider;
