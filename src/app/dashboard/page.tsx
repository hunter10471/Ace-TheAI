import DashboardStatsCard from "@/components/medium/DashboardStatsCard/DashboardStatsCard";
import ActionCard from "@/components/medium/ActionCard/ActionCard";
import Calendar from "@/components/medium/Calendar/Calendar";
import { interviewSuccessRateChartData } from "@/lib/data";
import { DashboardStatsCardType } from "@/lib/types";
import Image from "next/image";
import React from "react";
import { PiHandWavingFill } from "react-icons/pi";
import { MdOutlineEdit } from "react-icons/md";
import { BsChatSquareQuote } from "react-icons/bs";
import { BsPatchQuestion } from "react-icons/bs";
import { getUser } from "../actions/actions";
import { IoCalendarNumberOutline } from "react-icons/io5";
import { IoStatsChartOutline } from "react-icons/io5";
import { IoTimeOutline } from "react-icons/io5";
import ActivityStats from "@/components/medium/ActivityStats/ActivityStats";
import { LuPieChart } from "react-icons/lu";

export default async function page() {
  const user = await getUser();
  const highlightDates = [6, 13, 22];
  const activityStats = [
    {
      value: "256",
      label: "Learning hours",
      icon: <IoTimeOutline size={22} />,
      color: "bg-[#009EFA]",
    },
    {
      value: "90/100",
      label: "Average test result",
      icon: <IoStatsChartOutline size={22} />,
      color: "bg-[#00C9A7]",
    },
    {
      value: "48",
      label: "Interviews participated",
      icon: <LuPieChart size={22} />,
      color: "bg-[#C197FF]",
    },
  ];

  return (
    <div>
      <div className="flex justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl -mb-1 text-gray-900 dark:text-gray-100">
            Welcome back, {user.name.split(" ")[0]}
            <PiHandWavingFill size={40} className="text-amber-400" />
          </h1>
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            Prepare, Practice, Perform!
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Image
            src={"/assets/avatar.jpg"}
            alt="avatar"
            width={42}
            height={42}
            className="rounded-full"
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user.name}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{user.email}</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex my-6 gap-4">
          <DashboardStatsCard
            color="#3C77C6"
            darkColor="#00367E"
            lightColor="#96C3FF"
            title="Practice Sessions This Week"
            imageSrc="/assets/practice-this-week.png"
            stats="18/25"
            percentage={5}
            progress={70}
            type={DashboardStatsCardType.PracticeSessions}
          />
          <DashboardStatsCard
            color="#E76A84"
            darkColor="#E42B51"
            lightColor="#96C3FF"
            title="Interview Success Rate"
            imageSrc="/assets/interview-success-rate.png"
            stats="85%"
            percentage={-3}
            type={DashboardStatsCardType.InterviewSuccess}
            chartData={interviewSuccessRateChartData}
          />
          <DashboardStatsCard
            color="#9570C9"
            darkColor="#7533D2"
            title="Interviews Coming Up This Week"
            imageSrc="/assets/interviews-coming-up.png"
            stats="4"
            percentage={5}
            progress={70}
            type={DashboardStatsCardType.InterviewThisWeek}
            calendarDays={[6, 13, 22]}
          />
        </div>
        <Calendar highlightDates={highlightDates} />
      </div>
      <h1 className="text-2xl mb-4 text-gray-900 dark:text-gray-100">What's Next?</h1>
      <div className="flex gap-7">
        <div className="flex gap-4">
          <ActionCard
            title="Practice Today"
            description="Begin a new practice interview to sharpen your skills."
            buttonText="Start Practice"
            icon={<MdOutlineEdit size={30} className="text-primary" />}
          />
          <ActionCard
            title="View Feedback"
            description="Check out the latest feedback to improve your performance."
            buttonText="View Feedback"
            icon={<BsChatSquareQuote size={30} className="text-primary" />}
          />
          <ActionCard
            title="New Questions"
            description="Discover new questions added to the question bank."
            buttonText="Explore Questions"
            icon={<BsPatchQuestion size={30} className="text-primary" />}
          />
        </div>
        <ActivityStats stats={activityStats} />
      </div>
    </div>
  );
}
