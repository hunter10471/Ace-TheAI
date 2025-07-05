"use client";

import React from "react";

interface ActivityStat {
  value: string | number;
  label: string;
  icon: React.ReactNode;
  color: string;
}

interface ActivityStatsProps {
  stats: ActivityStat[];
}

const ActivityStats: React.FC<ActivityStatsProps> = ({ stats }) => {
  return (
    <div className="p-4 w-full max-w-[350px] mt-[-60px]">
      <h3 className="text-xl font-bold my-4">Activity</h3>
      <div className="space-y-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center gap-3">
            <div
              className={`${stat.color} w-9 h-9 rounded-lg flex items-center justify-center text-white`}
            >
              {stat.icon}
            </div>
            <div>
              <div className="font-semibold text-base">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityStats;
