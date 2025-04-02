import DashboardStatsCard from "@/components/medium/DashboardStatsCard/DashboardStatsCard";
import { interviewSuccessRateChartData } from "@/lib/data";
import { DashboardStatsCardType } from "@/lib/types";
import Image from "next/image";
import React from "react";
import { PiHandWavingFill } from "react-icons/pi";

export default function page() {
  return (
    <div>
      <div className="flex justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-medium -mb-1">
            Welcome back, Rafay{" "}
            <PiHandWavingFill size={40} className="text-amber-400" />
          </h1>
          <span className="text-gray-500 text-sm">
            Prepare, Practice, Perform!
          </span>
        </div>
        <div>
          <Image
            src={"/assets/avatar.jpg"}
            alt="avatar"
            width={48}
            height={48}
            className="rounded-full"
          />
        </div>
      </div>
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
        />
      </div>
    </div>
  );
}
