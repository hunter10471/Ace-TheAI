import Image from "next/image";
import React from "react";
import { IoChevronForwardSharp } from "react-icons/io5";
import { IoChevronBackSharp } from "react-icons/io5";
import { RiDoubleQuotesL } from "react-icons/ri";

const ReviewSlider = () => {
  return (
    <div className="mt-32 flex lg:flex-row flex-col items-center justify-between px-10 md:px-20">
      <div className="flex flex-col gap-3 text-2xl lg:text-3xl text-center lg:text-left">
        <h1>
          Insights from the <br /> <b>community</b>
        </h1>
        <p className="text-sm lg:text-base max-w-[300px]">
          Here’s what other users had to say about Ace The AI.
        </p>
        <div className="hidden lg:flex gap-5 mt-5 transition-all">
          <button className="border rounded-full p-1 border-gray-300 hover:shadow-md">
            <IoChevronBackSharp />
          </button>
          <button className="border rounded-full p-1 border-gray-300 hover:shadow-md">
            <IoChevronForwardSharp />
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center lg:items-stretch gap-5 max-w-[400px]">
        <RiDoubleQuotesL
          size={50}
          className="text-primary my-2 lg:my-0 lg:-ml-10 -mb-4"
        />
        <p className="text-xl lg:text-3xl lg:text-left text-center">
          Ace The AI Interview Coach helped me land my dream job! The feedback
          was spot on. I felt fully prepared for my real interview.
        </p>
        <div className="flex items-center gap-5">
          <Image
            src={"/assets/avatar.jpg"}
            width={60}
            height={60}
            className="rounded-full"
            alt="User avatar"
            objectFit="cover"
          />
          <div className="flex flex-col">
            <h2 className="font-bold text-sm">Adam Smith</h2>
            <span className="text-xs">
              Lead Software Engineer at Amazon inc.
            </span>
          </div>
        </div>
        <div className="flex lg:hidden gap-5 mt-5 transition-all text-2xl">
          <button className="border rounded-full p-1 border-gray-300 hover:shadow-md">
            <IoChevronBackSharp />
          </button>
          <button className="border rounded-full p-1 border-gray-300 hover:shadow-md">
            <IoChevronForwardSharp />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewSlider;
