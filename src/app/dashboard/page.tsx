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
    </div>
  );
}
